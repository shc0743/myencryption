import * as Exceptions from "./exceptions.js";
import { str_decode } from "./str.js";

export const PADDING_SIZE = 4096; // 4096 bytes
export const END_IDENTIFIER = [
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
];
export const TAIL_BLOCK_MARKER = [
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55,
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55,
];
export const END_MARKER = [
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
];
export const FILE_END_MARKER = [0xFF, 0xFD, 0xF0, 0x10, 0x13, 0xD0, 0x12, 0x18, 0x55, 0xAA];
export const POWER_2_64 = 2n ** 64n;
if (POWER_2_64 !== BigInt('18446744073709551616')) {
    throw new Exceptions.UnexpectedError('POWER_2_64 is not 2^64');
}

// @ts-ignore
const timerproc = (typeof process === 'undefined') ?
    requestAnimationFrame : // browser
    setTimeout; // node.js
export function nextTick() {
    return new Promise(r => timerproc(r));
}

/**
 * @param {string} major_version
 * @param {number|null} version_marker
 */
export function normalize_version(major_version, version_marker = null) {
    if (!major_version) return `Unknown Version`;
    let vm = String(version_marker);
    if (String(major_version) === '1.1') vm = 'null';
    if (!version_marker) return `${major_version}/0`;
    return `${major_version}/${vm}`;
}

// versions
export const ENCRYPTION_FILE_VER_1_1_0 = normalize_version('1.1');
export const ENCRYPTION_FILE_VER_1_2_10020 = normalize_version('1.2', 10020);


/**
 * @param {(start: number, end: number) => Promise<Uint8Array>} file_reader - 文件读取器对象，需要实现(start: number, end: number) => Promise<Uint8Array>
 */
export async function GetFileVersion(file_reader) {
    // 读取文件头并验证
    const header = await file_reader(0, 13);
    if (str_decode(header) !== 'MyEncryption/') {
        throw new Exceptions.InvalidFileFormatException();
    }
    const top_header_version = (str_decode(await file_reader(13, 16)));
    if(!(['1.1', '1.2'].includes(top_header_version))) {
        throw new Exceptions.EncryptionVersionMismatchException();
    }
    const version_marker = new DataView((await file_reader(16, 20)).buffer).getUint32(0, true);
    const version = normalize_version(top_header_version, version_marker);
    return version;
}

/**
 * @param {(start: number, end: number) => Promise<Uint8Array>} file_reader - 文件读取器对象，需要实现(start: number, end: number) => Promise<Uint8Array>
 */
export async function GetFileInfo(file_reader) {
    const version = await GetFileVersion(file_reader);
    if (version === ENCRYPTION_FILE_VER_1_1_0) {
        throw new Exceptions.OperationNotPermittedException('The chunk size is volatile and we cannot get a fixed value.');
    }
    if (version === ENCRYPTION_FILE_VER_1_2_10020) {
        let read_pos = 16 + 4;
        const ekey_len = new DataView((await file_reader(read_pos, read_pos + 4)).buffer).getUint32(0, true);
        const ekey = str_decode(await file_reader(read_pos + 4, read_pos + 4 + ekey_len));
        read_pos += PADDING_SIZE;
        const json_len_bytes = await file_reader(read_pos, read_pos + 4);
        const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
        read_pos += 4;
        read_pos += json_len;
        const chunk_size = Number(new DataView((await file_reader(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
        let nonce_counter = Number(new DataView((await file_reader(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
        return ({ version, chunk_size, nonce_counter, ekey });
    }
    throw new Exceptions.EncryptionVersionMismatchException();
}

/**
 * @param {(start: number, end: number) => Promise<Uint8Array>} file_reader
 */
export async function GetFileChunkSize(file_reader) {
    return (await GetFileInfo(file_reader)).chunk_size;
}

/**
 * @param {string} algorithm
 */
export function CheckAlgorithm(algorithm) {
    // 判断是否支持的加密算法
    // 默认是AES-GCM
    if ((!!algorithm) && (algorithm !== "AES-GCM")) {
        if (algorithm === 'ChaCha20' || algorithm === 'ChaCha20-Poly1305') {
            throw new Exceptions.ChaCha20NotSupportedException();
        }
        if (algorithm === 'DES' || algorithm === 'RC4') {
            throw new Exceptions.DangerousEncryptionAlgorithmException();
        }
        if (algorithm === 'XTS-AES') {
            throw new Exceptions.EncryptionAlgorithmNotSupportedException("XTS-AES Not supported yet");
        }
        throw new Exceptions.EncryptionAlgorithmNotSupportedException(undefined, {
            cause: new Error(String(algorithm))
        });
    }
}

/**
 * @param {string} message
 */
export async function is_encrypted_message(message) {
    if (typeof message !== 'string') return false;
    
    if (message.charAt(0) === ':') {
        const arr = message.split(':');
        if (arr.length === 8) {
            const [, data, phrase, salt, N, v, a,] = arr;
            return !!(data && phrase && salt && N && v && a);
        }
        return false;
    }

    if (message.charAt(0) !== '{') return false;

    try {
        const json = JSON.parse(message);
        return (json.data && json.parameter && json.N && json.v); 
    }
    catch {
        return false; 
    }
}

/**
 * @param {(start: number, end: number) => Promise<Uint8Array>} file_reader - 文件读取器对象，需要实现(start: number, end: number) => Promise<Uint8Array>
 */
export async function is_encrypted_file(file_reader) {
    try {
        const info = await GetFileInfo(file_reader);
        return !!info.version;
    }
    catch {
        return false; 
    }
}