// streamed encryption
import { CryptContext } from "./context.js";
import * as Exceptions from './exceptions.js';
import { str_decode } from "./str.js";
import { derive_key } from "./derive_key.js";
import { unhexlify } from "./binascii.js";
import { decrypt_data } from "./encrypt_data.js";
import { normalize_version, ENCRYPTION_FILE_VER_1_2_10020 } from "./encrypt_file.js";
import { PADDING_SIZE, END_IDENTIFIER, END_MARKER, TAIL_BLOCK_MARKER, FILE_END_MARKER } from './internal-util.js';

const crypto = globalThis.crypto; // To avoid the possible security risk


export class InputStream {
    /** @type {((start: number, end: number, signal?: AbortSignal) => Promise<Uint8Array>) | null} */
    #reader;
    #cache = {
        position: 0,
        end: 0,
        /** @type {?Uint8Array} */ data: null,
    };
    #size;
    get [Symbol.toStringTag]() {
        return 'Stream';
    }

    /**
     * @param {(start: number, end: number, signal?: AbortSignal) => Promise<Uint8Array>} reader The reader function
     * @param {number} size The size of the stream
     */
    constructor(reader, size) {
        if (typeof reader !== 'function') throw new Exceptions.InvalidParameterException('Stream: Invalid reader');
        this.#reader = reader;
        if (typeof size !== 'number') throw new Exceptions.InvalidParameterException('Stream: Invalid size');
        this.#size = size;
    }

    get size() {
        return this.#size;
    }

    /** @type {AbortController|null} */
    #abort_controller = null;

    /**
     * Read a stream
     * @param {Number} start start pos
     * @param {Number} end end pos
     * @param {Number|null} suggestion_end The suggested end. Used for caching.
     * @param {AbortController|null} abort The abort controller. Used for aborting the read.
     * @returns {Promise<Uint8Array>}
     */
    async read(start, end, suggestion_end = null, abort = null) {
        if (!this.#reader) throw new Error('Stream: The stream has been closed.');
        if (this.#cache.position != null && this.#cache.end && this.#cache.data && (start >= this.#cache.position && end <= this.#cache.end)) {
            // cache match
            return this.#cache.data.slice(start - this.#cache.position, end - this.#cache.position);
        }

        // normalize parameters
        if (start < 0) throw new Exceptions.InvalidParameterException('Stream: Invalid start position');
        if (end > this.#size) end = this.#size;
        if (suggestion_end != null && suggestion_end > this.#size) suggestion_end = this.#size;

        this.#abort_controller = abort;
        if (suggestion_end != null && suggestion_end !== 0) {
            // cache policy
            const data = await this.#reader(start, suggestion_end, abort?.signal);
            this.#abort_controller = null;
            // save cache
            this.#cache.position = start;
            this.#cache.end = start + data.length;
            this.#cache.data = (data);
            // return data
            return data.slice(0, end - start);
        }
        // cache mismatch
        const data = await this.#reader(start, end, abort?.signal);
        this.#abort_controller = null;
        return data;
    }

    abort() {
        this.#abort_controller?.abort();
    }

    purge() {
        this.#cache.position = this.#cache.end = 0;
        this.#cache.data = null;
    }

    close() {
        this.#reader = null;
        this.purge();
    }
};


/**
 * Prepare for a stream decryption.
 * @param {CryptContext} ctx Context
 * @param {InputStream} stream The stream to decrypt.
 * @param {String} password The password.
 * @param {Object} [param3={}] Options.
 * @param {boolean} [param3.cache=true] Set if the cache is enabled.
 * @param {number} [param3.cache_max_size=256 * 1024 * 1024] Set the maximium size of the cache.
 */
export async function decrypt_stream_init(ctx, stream, password, {
    cache = true,
    cache_max_size = 256 * 1024 * 1024,
} = {}) {
    if (ctx._inited) throw new Exceptions.CryptContextReusedException();
    Object.defineProperty(ctx, '_inited', { value: true });

    ctx._type = '@decrypt_stream';
    ctx.stream = {
        stream: stream,
        release: () => ctx.stream.stream.close(),
    };

    // 派生密钥
    const header = await stream.read(0, 13, 5000);
    if (str_decode(header) !== 'MyEncryption/') {
        throw new Exceptions.InvalidFileFormatException();
    }
    const top_header_version = (str_decode(await stream.read(13, 16)));
    if(!(['1.1', '1.2'].includes(top_header_version))) {
        throw new Exceptions.EncryptionVersionMismatchException();
    }
    const version_marker = new DataView((await stream.read(16, 20)).buffer).getUint32(0, true);
    const version = normalize_version(top_header_version, version_marker);
    let read_pos = 16 + 4;

    if (version !== ENCRYPTION_FILE_VER_1_2_10020) {
        throw new Exceptions.NotSupportedException("Cannot perform a streamed decryption on V1.1 files");
    }

    const ekey_len = new DataView((await stream.read(read_pos, read_pos + 4)).buffer).getUint32(0, true);
    const ekey = str_decode(await stream.read(read_pos + 4, read_pos + 4 + ekey_len));

    read_pos += PADDING_SIZE;
    
    if (ekey_len > PADDING_SIZE) {
        throw new Exceptions.InternalError("(Internal Error) This should not happen. Contact the application developer.");
    }
        
    // 解密主密钥
    const key = await decrypt_data(ekey, password);

    // 读取头部JSON长度
    const json_len_bytes = await stream.read(read_pos, read_pos + 4);
    const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
    read_pos += 4;

    // 解析头部JSON
    const header_json = JSON.parse(
        str_decode(await stream.read(read_pos, read_pos + json_len))
    );
    read_pos += json_len;

    // 提取派生参数
    const header_version = header_json.v;
    if (!([5.5].includes(header_version))) throw new Exceptions.EncryptionVersionMismatchException();
    const [phrase, salt_hex] = header_json.parameter.split(':');
    const salt = unhexlify(salt_hex);
    const iv4key = unhexlify(header_json.iv);
    const N = header_json.N;

    // 获取chunk size和iv参数
    const chunk_size = Number(new DataView((await stream.read(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
    let nonce_counter = Number(new DataView((await stream.read(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
    read_pos += 16;

    // 对应加密时，需要提供一个iv，我们把iv取回来，重新生成密钥（所有数据块的密钥是相同的）
    const { derived_key } = await derive_key(key, iv4key, phrase, N, salt);
    const cryptoKey = await crypto.subtle.importKey('raw', derived_key, { name: 'AES-GCM' }, false, ['decrypt']);

    ctx.key = cryptoKey;
    ctx.chunk_size = chunk_size;
    ctx.nonce_counter = nonce_counter;
    ctx.header_json_length = json_len;
    ctx.cache_enabled = !!cache;
    ctx.cached_chunks = new Map();
    ctx.cached_chunks_add_order = new Array();
    ctx.cached_size = 0;
    ctx.cache_max_size = cache_max_size;

    return true;
}


/**
 * Decrypt a stream.
 * @param {CryptContext} ctx Context
 * @param {Number} bytes_start The start byte to decrypt
 * @param {Number} bytes_end The end byte to decrypt
 * @param {AbortController|null} abort The abort controller.
 * @returns {Promise<Blob>} The decrypted data, stored in a Blob object.
 */
export async function decrypt_stream(ctx, bytes_start, bytes_end, abort) {
    if (!ctx._inited) throw new Exceptions.CryptContextNotInitedException();
    if (ctx._type !== '@decrypt_stream') throw new Exceptions.InvalidCryptContextTypeException(ctx._type);
    if (ctx._released) throw new Exceptions.CryptContextReleasedException();

    /** @type {InputStream} */
    const stream = ctx.stream.stream;
    const chunk_size = ctx.chunk_size;
    const nonce_counter_start = ctx.nonce_counter;
    const result = [];
    
    // 文件头16 + 版本标识4 + 主密钥4096 + JSON长度4 + JSON + chunk_size8 + IV8
    const chunks_start = 16 + 4 + PADDING_SIZE + 4 + ctx.header_json_length + 8 + 8;
    // tag 16字节
    const size_per_chunk = chunk_size + 16;

    // 确定需要解密的分块位置
    const max_chunk = Math.floor((stream.size - chunks_start - (32 + 8 + 32 + 8 + FILE_END_MARKER.length)) / size_per_chunk);
    const start_chunk = Math.max(0, Math.floor(bytes_start / chunk_size));
    const end_chunk = Math.min(max_chunk, Math.floor(bytes_end / chunk_size));
    if (end_chunk < 0 || start_chunk > max_chunk) throw new Exceptions.InvalidParameterException("Out of range")

    // 用于读取chunk
    const read_chunk = async (chunk) => {
        // 检查缓存
        if (ctx.cache_enabled && ctx.cached_chunks.has(chunk)) {
            return ctx.cached_chunks.get(chunk);
        }

        // 定位对应chunk
        let pos = chunks_start + (chunk * size_per_chunk);
        // 读取8字节
        const eight_bytes = await stream.read(pos, pos + 8, pos + (2 * size_per_chunk), abort);
        // 判断是否特殊情况
        let real_size = 0;
        if ((eight_bytes).every((v, i) => v === END_IDENTIFIER[i])) {
            const full_bytes = await stream.read(pos, pos + 32, null, abort); // 读取完整标记
            pos += 32;
            // 判断是否结束
            if (full_bytes.every((v, i) => v === END_MARKER[i])) {
                return false
            }
            if (full_bytes.every((v, i) => v === TAIL_BLOCK_MARKER[i])) {
                // 读取分块长度
                const chunk_len_bytes = await stream.read(pos, pos + 8, null, abort);
                pos += 8;
                real_size = Number(new DataView(chunk_len_bytes.buffer).getBigUint64(0, true));
                if (real_size === 0) return false // 读取到0字节，结束循环
            }
        }

        // 读取
        const ciphertext_length = (real_size ? real_size : chunk_size)
        const ciphertext = await stream.read(pos, pos + ciphertext_length + 16, null, abort);
        // 获取iv
        const nonce_counter = nonce_counter_start + chunk;
        const iv_array = new ArrayBuffer(12);
        new DataView(iv_array).setBigUint64(4, BigInt(nonce_counter), true);

        // 使用WebCrypto解密
        try {
            const data = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: new Uint8Array(iv_array),
                },
                ctx.key,
                ciphertext
            );
            // 保存到缓存
            if (ctx.cache_enabled) {
                if (data.byteLength < ctx.cache_max_size) {
                    ctx.cached_chunks_add_order.push(chunk);
                    ctx.cached_chunks.set(chunk, data);
                    ctx.cached_size += data.byteLength;
                }

                // 检查缓存大小
                while (ctx.cached_size > ctx.cache_max_size) {
                    const oldest_chunk = ctx.cached_chunks_add_order.shift();
                    ctx.cached_size -= ctx.cached_chunks.get(oldest_chunk).byteLength;
                    ctx.cached_chunks.delete(oldest_chunk);
                }
            }
            return data;
        }
        catch (e) {
            if (!e || !(e instanceof DOMException)) throw new Exceptions.InternalError(`Internal error.`, { cause: e });
            const name = e.name;
            if (name === 'InvalidAccessError') throw new Exceptions.InvalidParameterException('InvalidAccessError.', { cause: e });
            if (name === 'OperationError') throw new Exceptions.CannotDecryptException('Cannot decrypt. Did you provide the correct password?', { cause: e });
            throw new Exceptions.InternalError(`Unexpected error.`, { cause: e });
        }
    };

    // 读取chunk
    let EOFbit = false;
    for (let i = start_chunk; i <= end_chunk; i++) {
        const decrypted_chunk = await read_chunk(i);
        if (!decrypted_chunk) {
            EOFbit = true;
            break;
        }
        result.push(decrypted_chunk);
    }

    // 合成Blob
    const blob_full = new Blob(result);
    // 裁剪需要的部分
    const startpos = start_chunk * chunk_size;
    // const endpos = (end_chunk + 1) * chunk_size - 1;
    // bytes_start, bytes_end
    const blob = blob_full.slice(bytes_start - startpos, bytes_end - startpos);
    
    // @ts-ignore
    if (EOFbit) blob.eof = true;
    return blob;
}
