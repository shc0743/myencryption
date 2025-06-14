import { derive_key } from "./derive_key.js";
import { hexlify, unhexlify } from "./binascii.js";
import { get_random_bytes } from "./random.js";
import { str_encode, str_decode } from "./str.js";
import { encrypt_data, decrypt_data } from "./encrypt_data.js";
import * as Exceptions from './exceptions.js';

import {
    normalize_version, ENCRYPTION_FILE_VER_1_1_0, ENCRYPTION_FILE_VER_1_2_10020,
    PADDING_SIZE,
    END_IDENTIFIER, TAIL_BLOCK_MARKER, END_MARKER, FILE_END_MARKER,
    nextTick,
    GetFileVersion,
    CheckAlgorithm,
    POWER_2_64,
} from "./internal-util.js";
export { normalize_version, ENCRYPTION_FILE_VER_1_1_0, ENCRYPTION_FILE_VER_1_2_10020 };
    
const crypto = globalThis.crypto; // To avoid the possible security risk


/**
 * 加密文件
 * @param {(start: number, end: number) => Promise<Uint8Array>} file_reader - 文件读取器对象，需要实现(start: number, end: number) => Promise<Uint8Array>
 * @param {(data: Uint8Array) => Promise<void>} file_writer - 文件写入器对象，需要实现write(Uint8Array)方法
 * @param {string} user_key - 用户密钥
 * @param {((progress: number) => void)|null} callback - 可选回调函数，用于报告加密进度
 * @param {string|null} phrase - 可选短语，用于密钥派生
 * @param {number|null} N - scrypt参数N
 * @param {number} chunk_size - 分块大小，默认为32MiB
 * @returns {Promise<boolean>} 返回加密是否成功
 */
export async function encrypt_file(file_reader, file_writer, user_key, callback = null, phrase = null, N = null, chunk_size = 32 * 1024 * 1024) {
    // fast-fail
    if (typeof file_reader !== 'function' || typeof file_writer !== 'function') {
        throw new Exceptions.InvalidParameterException("file_reader and file_writer must be functions");
    }
    if ((typeof user_key !== 'string')) {
        throw new Exceptions.InvalidParameterException("user_key must be a string");
    }
    if (!chunk_size) throw new Exceptions.InvalidParameterException('chunk_size must be greater than 0.');
    const original_callback = callback;
    callback = (typeof callback === 'function') ? async function UserCallback(progress) {
        try {
            const r = original_callback?.(progress);
            // @ts-ignore
            if ((r) && (r instanceof Promise)) await r;
        } catch (e) {
            throw new Exceptions.UnhandledExceptionInUserCallback('An unhandled exception was encountered during a user callback.', { cause: e });
        }
    } : null;

    // 写入文件头标识和版本 (16字节)
    await file_writer(str_encode('MyEncryption/1.2'));

    // 写入版本标识符
    const VERSION_MARKER = 10020;
    const versionMarkerBuffer = new ArrayBuffer(4);
    new DataView(versionMarkerBuffer).setUint32(0, VERSION_MARKER, true);
    await file_writer(new Uint8Array(versionMarkerBuffer));

    // 产生主密钥
    const key = hexlify(get_random_bytes(128));
    // N在这里被使用
    const ekey = await encrypt_data(key, user_key, phrase, N);
    const ekey_bytes = str_encode(ekey);
    // 对于128字节的随机主密钥，我们在下面完全没有必要使用过高的N。
    N = 8192; // 降低文件内容的N以提升性能

    // 检查长度
    if (ekey_bytes.length > PADDING_SIZE) {
        throw new Exceptions.InternalError("(Internal Error) This should not happen. Contact the application developer.");
    }

    // 写入主密钥密文长度(4字节)和内容，填充到PADDING_SIZE字节
    const lengthBuffer = new ArrayBuffer(4);
    new DataView(lengthBuffer).setUint32(0, ekey_bytes.length, true);
    await file_writer(new Uint8Array(lengthBuffer));
    await file_writer(ekey_bytes);

    // 填充剩余空间
    const padding = new Uint8Array(PADDING_SIZE - ekey_bytes.length - 4).fill(0);
    await file_writer(padding);

    // 生成初始IV用于派生密钥 (12字节)
    await callback?.(0); await nextTick();
    const iv_for_key = get_random_bytes(12);
    const { derived_key, parameter, N: N2 } = await derive_key(key, iv_for_key, phrase, N);
    N = N2;

    // 准备头部JSON数据
    // 注意：安全性主要依靠主密钥。实际上对于64字节的随机主密钥完全没有必要使用过高的N。
    const header_data = {
        "parameter": parameter,
        "N": N,
        "v": 5.5,
        "a": "AES-GCM",
        "iv": hexlify(iv_for_key)
    };
    const header_json = str_encode(JSON.stringify(header_data));

    // 写入JSON长度(4字节)和JSON数据
    const headerLengthBuffer = new ArrayBuffer(4);
    new DataView(headerLengthBuffer).setUint32(0, header_json.length, true);
    await file_writer(new Uint8Array(headerLengthBuffer));
    await file_writer(header_json);

    // 写入chunk size参数
    const chunkSizeBuffer = new ArrayBuffer(8);
    new DataView(chunkSizeBuffer).setBigUint64(0, BigInt(chunk_size), true);
    await file_writer(new Uint8Array(chunkSizeBuffer));

    let total_bytes = 0; // 用于统计总字节数
    let nonce_counter = BigInt(1);
    let position = 0;

    // 写入iv参数
    const nonce_counter_start = new ArrayBuffer(8);
    new DataView(nonce_counter_start).setBigUint64(0, nonce_counter, true);
    await file_writer(new Uint8Array(nonce_counter_start));

    // 分块加密处理
    await callback?.(0);
    const cryptoKey = await crypto.subtle.importKey('raw', derived_key, { name: 'AES-GCM' }, false, ['encrypt']);
    while (true) {
        // 读取文件块
        const chunk = await file_reader(position, position + chunk_size);
        // chunk should be a Uint8Array
        if (!(chunk instanceof Uint8Array)) throw new Exceptions.BadDataException("The file chunk is not a Uint8Array.");
        if (chunk.length === 0) break;
        const isFinalChunk = chunk.length < chunk_size;

        // 为每个分块生成新IV (12字节)
        const iv = new ArrayBuffer(12);
        // 确保 IV 唯一
        if (nonce_counter >= POWER_2_64) {
            throw new Exceptions.IVException("nonce_counter exceeded the maximum value.");
        }
        new DataView(iv).setBigUint64(4, nonce_counter, true); // 写入8字节计数器
        nonce_counter++; // 计数器加1

        if (isFinalChunk) {
            await file_writer(new Uint8Array(TAIL_BLOCK_MARKER));
            // 写入该分块长度
            const chunkLengthBuffer = new ArrayBuffer(8);
            new DataView(chunkLengthBuffer).setBigUint64(0, BigInt(chunk.length), true);
            await file_writer(new Uint8Array(chunkLengthBuffer));
        }

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

        // 写入分块信息: 密文 + tag(16字节)
        // 密文的长度和原文相同
        const ciphertextArray = new Uint8Array(ciphertext);
        await file_writer(ciphertextArray);

        total_bytes += chunk.length;
        position += chunk.length;

        await callback?.(total_bytes);
    }

    // 写入结束标记和总字节数
    await file_writer(new Uint8Array(END_MARKER));

    const totalBytesBuffer = new ArrayBuffer(8);
    new DataView(totalBytesBuffer).setBigUint64(0, BigInt(total_bytes), true);
    await file_writer(new Uint8Array(totalBytesBuffer));
    await file_writer(new Uint8Array(FILE_END_MARKER));

    return true;
}

/**
 * 解密文件（1.1）
 * @deprecated 仅供兼容1.1版本使用。
 * @param {(start: number, end: number) => Promise<Uint8Array>} file_reader - 文件读取器对象，需要实现(start: number, end: number) => Promise<Uint8Array>
 * @param {Function} file_writer - 文件写入器对象，需要实现write(Uint8Array)方法
 * @param {((progress: number) => void)|null} callback - 可选回调函数，用于报告加密进度
 * @param {string} user_key - 用户提供的解密密钥
 * @param {Function} [callback=null] - 进度回调函数
 * @returns {Promise<boolean>} 返回解密是否成功
 */
export async function decrypt_file_V_1_1_0(file_reader, file_writer, user_key, callback = null) {
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

    // 解密主密钥
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
    if (total_bytes !== total_bytes_decrypted) throw new Exceptions.FileCorruptedException("File corrupted: total bytes mismatch")
    if (!end_marker.every((v, i) => v === [0x55, 0xAA][i])) throw new Exceptions.InvalidEndMarkerException("Invalid end marker");

    return true;
}
/**
 * 解密文件
 * @param {(start: number, end: number) => Promise<Uint8Array>} file_reader - 文件读取器对象，需要实现(start: number, end: number) => Promise<Uint8Array>
 * @param {(data: Uint8Array) => Promise<void>} file_writer - 文件写入器对象，需要实现write(Uint8Array)方法
 * @param {string|Uint8Array} user_key - 用户提供的解密密钥（字符串）或者派生后的密钥（Uint8Array）
 * @param {((progress: number) => void)|null} callback - 可选回调函数，用于报告加密进度
 * @returns {Promise<boolean>} 返回解密是否成功
 */
export async function decrypt_file(file_reader, file_writer, user_key, callback = null) {
    // fast-fail
    if (typeof file_reader !== 'function' || typeof file_writer !== 'function') {
        throw new Exceptions.InvalidParameterException("file_reader and file_writer must be functions");
    }
    if ((typeof user_key !== 'string') && (!(user_key instanceof ArrayBuffer)) && (!(user_key instanceof Uint8Array))) {
        throw new Exceptions.InvalidParameterException("user_key must be a string or ArrayBuffer or Uint8Array");
    }
    const original_callback = callback;
    callback = (typeof callback === 'function') ? async function UserCallback(progress) {
        try {
            const r = original_callback?.(progress);
            // @ts-ignore
            if ((r) && (r instanceof Promise)) await r;
        } catch (e) {
            throw new Exceptions.UnhandledExceptionInUserCallback('An unhandled exception was encountered during a user callback.', { cause: e });
        }
    } : null;

    // 考虑到JavaScript一般不会处理2^53数量级的文件，我们对read_pos使用number而不是bigint
    let read_pos = 16 + 4;
    const version = await GetFileVersion(file_reader);

    if (version === ENCRYPTION_FILE_VER_1_1_0) {
        if (typeof user_key !== 'string') throw new Exceptions.NotSupportedException("operation not supported");
        return await decrypt_file_V_1_1_0(file_reader, file_writer, user_key, callback);
    }

    const ekey_len = new DataView((await file_reader(read_pos, read_pos + 4)).buffer).getUint32(0, true);
    const ekey = str_decode(await file_reader(read_pos + 4, read_pos + 4 + ekey_len));

    read_pos += PADDING_SIZE;
    
    if (ekey_len > PADDING_SIZE) {
        throw new Exceptions.InternalError("(Internal Error) This should not happen. Contact the application developer.");
    }
        
    // 解密主密钥
    const key = (typeof user_key === 'string') ? await decrypt_data(ekey, user_key) : null;

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
    const header_version = header_json.v;
    if (!([5.5].includes(header_version))) throw new Exceptions.EncryptionVersionMismatchException();
    const [phrase, salt_hex] = header_json.parameter.split(':');
    const salt = unhexlify(salt_hex);
    const iv4key = unhexlify(header_json.iv);
    const N = header_json.N;
    const algorithm = header_json.a;

    // 判断是否支持的加密算法
    CheckAlgorithm(algorithm);

    // 获取chunk size和iv参数
    const chunk_size = Number(new DataView((await file_reader(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
    let nonce_counter = BigInt(new DataView((await file_reader(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
    read_pos += 16;

    // 对应加密时，需要提供一个iv，我们把iv取回来，重新生成密钥（所有数据块的密钥是相同的）
    await callback?.(0);
    await nextTick();
    const derived_key = (typeof user_key === 'string') ? (
        key ? ((await derive_key(key, iv4key, phrase, N, salt)).derived_key) : Exceptions.raise(new Exceptions.InternalError())
    ) : user_key;

    let total_bytes = 0, is_final_chunk = false;
    // 分块解密循环
    const cryptoKey = await crypto.subtle.importKey('raw', derived_key, { name: 'AES-GCM' }, false, ['decrypt']);
    while (true) {
        // 读取分块长度标记
        const chunk_tag = await file_reader(read_pos, read_pos + 8);

        // 检查结束标记
        let real_size = 0;
        if ((chunk_tag).every((v, i) => v === END_IDENTIFIER[i])) {
            const full_bytes = await file_reader(read_pos, read_pos + 32); // 读取完整标记
            if (full_bytes.every((v, i) => v === END_MARKER[i])) {
                read_pos += 32; // 跳过标记
                break;
            }
            if (full_bytes.every((v, i) => v === TAIL_BLOCK_MARKER[i])) {
                is_final_chunk = true;
                read_pos += 32; // 跳过标记
                // 读取分块长度
                const chunk_len_bytes = await file_reader(read_pos, read_pos + 8);
                read_pos += 8;
                real_size = Number(new DataView(chunk_len_bytes.buffer).getBigUint64(0, true));
                if (real_size === 0) break; // 读取到0字节，结束循环
            }
        }

        // 解析分块长度（不包括16字节标签）
        const ciphertext_length = (is_final_chunk ? real_size : chunk_size)

        // 获取iv
        const iv_array = new ArrayBuffer(12);
        new DataView(iv_array).setBigUint64(4, BigInt(nonce_counter), true);
        nonce_counter++;
        
        // 读取密文和tag(16字节)
        const ciphertext = await file_reader(read_pos, read_pos + ciphertext_length + 16);
        read_pos += ciphertext_length + 16;

        const full_ciphertext = ciphertext;

        // 使用WebCrypto解密
        try {
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: new Uint8Array(iv_array),
                },
                cryptoKey,
                full_ciphertext
            );

            // 写入解密后的数据
            await file_writer(new Uint8Array(decrypted));
            total_bytes += decrypted.byteLength;
        } catch (e) {
            if (!e || !(e instanceof DOMException)) throw new Exceptions.InternalError(`Internal error.`, { cause: e });
            const name = e.name;
            if (name === 'InvalidAccessError') throw new Exceptions.InvalidParameterException('InvalidAccessError.', { cause: e });
            if (name === 'OperationError') throw new Exceptions.UnexpectedFailureInChunkDecryptionException(undefined, { cause: e });
            throw new Exceptions.InternalError(`Unexpected error.`, { cause: e });
        }
        if (callback) await callback(total_bytes);
    }

    // 验证总字节数和结束标记
    const total_bytes_bytes = await file_reader(read_pos, read_pos + 8);
    const total_bytes_decrypted = Number(
        new DataView(total_bytes_bytes.buffer).getBigUint64(0, true)
    );
    read_pos += 8;

    const end_marker = await file_reader(read_pos, read_pos + FILE_END_MARKER.length);
    if (total_bytes !== total_bytes_decrypted) throw new Exceptions.FileCorruptedException("total bytes mismatch")
    if (!end_marker.every((v, i) => v === FILE_END_MARKER[i])) throw new Exceptions.InvalidEndMarkerException();

    return true;
}


/**
 * @param {Blob} blob
 * @param {string} password
 * @param {((progress: number) => void)|null} callback - 可选回调函数，用于报告加密进度
 * @param {string|null} phrase - 可选短语，用于密钥派生
 * @param {number|null} N - scrypt参数N
 * @param {number} chunk_size - 分块大小，默认为32MiB
 * @returns {Promise<Blob>}
 */
export async function encrypt_blob(blob, password, callback, phrase, N, chunk_size) {
    if (!(blob instanceof Blob)) throw new Exceptions.InvalidParameterException("blob must be a Blob");
    const buffer = [];
    const file_reader = async (/** @type {number} */ start, /** @type {number} */ end) => new Uint8Array(await (blob.slice(start, end).arrayBuffer()));
    const file_writer = async (/** @type {Uint8Array} */ data) => { buffer.push(data) };
    if (!await encrypt_file(file_reader, file_writer, password, callback, phrase, N, chunk_size)) throw new Exceptions.UnexpectedError();
    return new Blob(buffer);
}
/**
 * @param {Blob} blob
 * @param {string | Uint8Array} password
 * @param {((progress: number) => void)|null} callback - 可选回调函数，用于报告加密进度
 * @returns {Promise<Blob>}
 */
export async function decrypt_blob(blob, password, callback) {
    if (!(blob instanceof Blob)) throw new Exceptions.InvalidParameterException("blob must be a Blob");
    const buffer = [];
    const file_reader = async (/** @type {number} */ start, /** @type {number} */ end) => new Uint8Array(await (blob.slice(start, end).arrayBuffer()));
    const file_writer = async (/** @type {Uint8Array} */ data) => { buffer.push(data) };
    if (!await decrypt_file(file_reader, file_writer, password, callback)) throw new Exceptions.UnexpectedError();
    return new Blob(buffer);
}