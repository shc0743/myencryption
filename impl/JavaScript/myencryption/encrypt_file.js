import { derive_key } from "./derive_key.js";
import { hexlify, unhexlify } from "./binascii.js";
import { get_random_bytes } from "./random.js";
import { str_encode, str_decode } from "./str.js";
import { encrypt_data, decrypt_data } from "./encrypt_data.js";

function nextTick() {
    return new Promise(r => requestAnimationFrame(r));
}

/**
 * 加密文件
 * @param {Object} file_reader - 文件读取器对象，需要实现(start, end) => Promise<Uint8Array>
 * @param {Object} file_writer - 文件写入器对象，需要实现write(Uint8Array)方法
 * @param {string} key - 用户密钥
 * @param {string|null} phrase - 可选短语，用于密钥派生
 * @param {number|null} N - scrypt参数N
 * @param {number} chunk_size - 分块大小，默认为32MB
 * @returns {Promise<boolean>} 返回加密是否成功
 */
export async function encrypt_file(file_reader, file_writer, user_key, callback = null, phrase = null, N = null, chunk_size = 32 * 1024 * 1024) {
    // 写入文件头标识和版本 (16字节)
    await file_writer(str_encode('MyEncryption/1.1'));

    // 产生主密钥
    // TODO: 主密钥的随机性非常重要！考虑让用户移动鼠标来收集随机性
    const key = hexlify(get_random_bytes(64));
    const ekey = await encrypt_data(key, user_key);
    const ekey_bytes = str_encode(ekey);

    // 检查长度
    if (ekey_bytes.length > 1024) {
        throw new Error("(Internal Error) This should not happen. Contact the application developer.");
    }

    // 写入主密钥密文长度(4字节)和内容，填充到1024字节
    const lengthBuffer = new ArrayBuffer(4);
    new DataView(lengthBuffer).setUint32(0, ekey_bytes.length, true);
    await file_writer(new Uint8Array(lengthBuffer));
    await file_writer(ekey_bytes);

    // 填充剩余空间
    const padding = new Uint8Array(1024 - ekey_bytes.length).fill(0);
    await file_writer(padding);

    // 生成初始IV用于派生密钥 (12字节)
    callback?.(0); await nextTick();
    const iv_for_key = get_random_bytes(12);
    const { derived_key, parameter, N: N2 } = await derive_key(key, iv_for_key, phrase, N);
    N = N2;

    // 准备头部JSON数据
    const header_data = {
        "parameter": parameter,
        "N": N,
        "v": 5.5,
        "iv": hexlify(iv_for_key)
    };
    const header_json = str_encode(JSON.stringify(header_data));

    // 写入JSON长度(4字节)和JSON数据
    const headerLengthBuffer = new ArrayBuffer(4);
    new DataView(headerLengthBuffer).setUint32(0, header_json.length, true);
    await file_writer(new Uint8Array(headerLengthBuffer));
    await file_writer(header_json);

    let total_bytes = 0; // 用于统计总字节数
    let nonce_counter = 1;
    let position = 0;

    // 分块加密处理
    callback?.(0);
    const cryptoKey = await crypto.subtle.importKey('raw', derived_key, { name: 'AES-GCM' }, false, ['encrypt']);
    while (true) {
        // 读取文件块
        const chunk = await file_reader(position, position + chunk_size);
        if (chunk.length === 0) break;

        // 为每个分块生成新IV (12字节)
        const iv = new ArrayBuffer(12);
        // 确保 IV 唯一
        if (nonce_counter >= 2 ** 64 || nonce_counter >= Number.MAX_SAFE_INTEGER) {
            throw new Error("FATAL: IV Exception: nonce_counter exceeded the maximum value.");
        }
        new DataView(iv).setBigUint64(4, BigInt(nonce_counter)); // 写入8字节计数器
        nonce_counter++;

        // 使用WebCrypto进行加密
        const ivArray = new Uint8Array(iv);
        const ciphertext = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: ivArray,
            },
            cryptoKey,
            chunk
        );

        // 分离密文和tag (最后16字节是tag)
        const ciphertextArray = new Uint8Array(ciphertext);
        const tag = ciphertextArray.slice(-16);
        const encryptedData = ciphertextArray.slice(0, -16);

        // 写入分块信息: 原始数据长度(8字节) + IV(12字节) + 密文 + tag(16字节)
        const chunkLenBuffer = new ArrayBuffer(8);
        new DataView(chunkLenBuffer).setBigUint64(0, BigInt(chunk.length), true);
        await file_writer(new Uint8Array(chunkLenBuffer));
        await file_writer(ivArray);
        await file_writer(encryptedData);
        await file_writer(tag);

        total_bytes += chunk.length;
        position += chunk.length;

        callback?.(total_bytes);
    }

    // 写入结束标记和总字节数
    await file_writer(new Uint8Array([0xFF, 0xFD, 0xF0, 0x10, 0x13, 0xD0, 0x12, 0x18]));

    const totalBytesBuffer = new ArrayBuffer(8);
    new DataView(totalBytesBuffer).setBigUint64(0, BigInt(total_bytes), true);
    await file_writer(new Uint8Array(totalBytesBuffer));
    await file_writer(new Uint8Array([0x55, 0xAA]));

    return true;
}
/**
 * 解密文件
 * @param {Object} file_reader - 文件读取器对象，需要实现(start, end) => Promise<Uint8Array>
 * @param {Object} file_writer - 文件写入器对象，需要实现write(Uint8Array)方法
 * @param {string} user_key - 用户提供的解密密钥
 * @param {Function} [callback=null] - 进度回调函数
 * @returns {Promise<boolean>} 返回解密是否成功
 */
export async function decrypt_file(file_reader, file_writer, user_key, callback = null) {
    // 读取文件头并验证
    const header = await file_reader(0, 16);
    if (str_decode(header) !== 'MyEncryption/1.1') {
        throw new TypeError("Invalid file format");
    }
    let read_pos = 16;

    // 读取主密钥密文长度
    const ekey_len_bytes = await file_reader(read_pos, read_pos + 4);
    const ekey_len = new DataView(ekey_len_bytes.buffer).getUint32(0, true);
    read_pos += 4;

    // 读取主密钥密文并跳过填充
    const ekey = str_decode(await file_reader(read_pos, read_pos + ekey_len));
    read_pos += 1024; // 直接跳过1024字节区域

    // 解密主密钥 (假设decrypt_data已实现)
    const key = await decrypt_data(ekey, user_key);

    // 读取头部JSON长度
    const json_len_bytes = await file_reader(read_pos, read_pos + 4);
    const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
    read_pos += 4;

    // 解析头部JSON
    const header_json = JSON.parse(
        str_decode(await file_reader(read_pos, read_pos + json_len))
    );
    read_pos += json_len;

    // 提取派生参数
    const [phrase, salt_hex] = header_json.parameter.split(':');
    const salt = unhexlify(salt_hex);
    const iv4key = unhexlify(header_json.iv);
    const N = header_json.N;

    // 对应加密时，需要提供一个iv，我们把iv取回来，重新生成密钥（所有数据块的密钥是相同的）
    callback?.(0);
    await nextTick();
    const { derived_key } = await derive_key(key, iv4key, phrase, N, salt);

    let total_bytes = 0;
    // 分块解密循环
    const cryptoKey = await crypto.subtle.importKey('raw', derived_key, { name: 'AES-GCM' }, false, ['decrypt']);
    while (true) {
        // 读取分块长度标记
        const chunk_len_bytes = await file_reader(read_pos, read_pos + 8);
        read_pos += 8;

        // 检查结束标记
        if (chunk_len_bytes.every((v, i) =>
            v === [0xFF, 0xFD, 0xF0, 0x10, 0x13, 0xD0, 0x12, 0x18][i]
        )) break;

        // 解析分块长度
        const chunk_len = Number(
            new DataView(chunk_len_bytes.buffer).getBigUint64(0, true)
        );

        // 读取IV(12字节)、密文和tag(16字节)
        const iv = await file_reader(read_pos, read_pos + 12);
        read_pos += 12;
        const ciphertext = await file_reader(read_pos, read_pos + chunk_len + 16);
        read_pos += chunk_len + 16;

        const full_ciphertext = ciphertext;

        // 使用WebCrypto解密
        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            cryptoKey,
            full_ciphertext
        );

        // 写入解密后的数据
        await file_writer(new Uint8Array(decrypted));
        total_bytes += decrypted.byteLength;
        if (callback) callback(total_bytes);
    }

    // 验证总字节数和结束标记
    const total_bytes_bytes = await file_reader(read_pos, read_pos + 8);
    const total_bytes_decrypted = Number(
        new DataView(total_bytes_bytes.buffer).getBigUint64(0, true)
    );
    read_pos += 8;

    const end_marker = await file_reader(read_pos, read_pos + 2);
    if (total_bytes !== total_bytes_decrypted) throw new TypeError("File corrupted: total bytes mismatch")
    if (!end_marker.every((v, i) => v === [0x55, 0xAA][i])) throw new TypeError("Invalid end marker");

    return true;
}
