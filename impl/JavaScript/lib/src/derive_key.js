import { hexlify, unhexlify } from "./binascii.js";
import { get_random_bytes, get_random_uint8_number } from "./random.js";
import { str_decode, str_encode } from "./str.js";
import * as Exceptions from './exceptions.js';
import { scrypt } from './scrypt-layer/entrance.js';
import { decrypt_data } from "./encrypt_data.js";
import { GetFileVersion, ENCRYPTION_FILE_VER_1_1_0, PADDING_SIZE, CheckAlgorithm, ENCRYPTION_FILE_VER_1_2_10020 } from "./internal-util.js";

export const deriveKey__phrases = ['Furina', 'Neuvillette', 'Venti', 'Nahida', 'Kinich', 'Kazuha'];
/**
 * Derive a key from a phrase and a key.
 * @param {string} key 
 * @param {Uint8Array} iv 
 * @param {?string} phrase 
 * @param {?number} N 
 * @param {?Uint8Array} salt 
 * @param {number} r 
 * @param {number} p 
 * @param {number} dklen 
 */
export async function derive_key(key, iv, phrase = null, N = null, salt = null, r = 8, p = 1, dklen = 32) {
    if (N === null) N = 262144;
    if (typeof N !== "number" || N > 2097152 || r < 1 || p < 1 || typeof r !== "number" || typeof p !== "number" || typeof dklen !== "number") {
        throw new Exceptions.InvalidScryptParameterException();
    }
    if (typeof key !== "string") throw new Exceptions.InvalidParameterException("key must be a string");
    if (!(iv instanceof Uint8Array)) throw new Exceptions.InvalidParameterException("iv must be a Uint8Array");
    if (phrase !== null && typeof phrase !== "string") throw new Exceptions.InvalidParameterException("phrase must be a string");

    // (2) 生成salt
    if (!salt) {
        salt = get_random_bytes(64);
    }

    // 处理phrase
    if (!phrase) {
        phrase = deriveKey__phrases[(get_random_uint8_number()) % deriveKey__phrases.length];
    }
    if (phrase.includes(":")) {
        throw new Exceptions.InvalidParameterException("phrase MUST NOT contain \":\"");
    }

    const parameter = `${phrase}:${hexlify(salt)}`;

    // (3) 生成加密密钥
    const keyInput = `MyEncryption/1.1 Fontaine/4.2 Iv/${hexlify(iv)} user_parameter=${parameter} user_key=${key}`;

    // 使用Scrypt进行密钥派生(pycryptodome没有PBKDF2HMAC，使用Scrypt作为替代)
    // AES-256需要32字节密钥
    /**
     * @type {Uint8Array}
     */
    const derived_key = await scrypt(str_encode(keyInput), salt, N, r, p, dklen)

    return ({ derived_key, parameter, N });
}


/**
 * Derive a key for a file.
 * @param {(start: number, end: number) => Promise<Uint8Array>} file_reader 
 * @param {string} user_key 
 */
export async function derive_key_for_file(file_reader, user_key) {
    let read_pos = 16 + 4;
    const version = await GetFileVersion(file_reader);

    if (version === ENCRYPTION_FILE_VER_1_1_0) {
        throw new Exceptions.NotSupportedException("Deriving a key for V1.1 files is not supported");
    }
    if (version !== ENCRYPTION_FILE_VER_1_2_10020) {
        throw new Exceptions.EncryptionVersionMismatchException();
    }

    const ekey_len = new DataView((await file_reader(read_pos, read_pos + 4)).buffer).getUint32(0, true);
    const ekey = str_decode(await file_reader(read_pos + 4, read_pos + 4 + ekey_len));

    read_pos += PADDING_SIZE;
    
    if (ekey_len > PADDING_SIZE) {
        throw new Exceptions.InternalError("(Internal Error) This should not happen. Contact the application developer.");
    }
        
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
    const header_version = header_json.v;
    if (!([5.5].includes(header_version))) throw new Exceptions.EncryptionVersionMismatchException();
    const [phrase, salt_hex] = header_json.parameter.split(':');
    const salt = unhexlify(salt_hex);
    const iv4key = unhexlify(header_json.iv);
    const N = header_json.N;
    const algorithm = header_json.a;

    // 判断是否支持的加密算法
    CheckAlgorithm(algorithm);

    return ((await derive_key(key, iv4key, phrase, N, salt)).derived_key);
}


export async function scrypt_hex(key, salt, N, r, p, dklen) {
    return hexlify(await scrypt(str_encode(key), str_encode(salt), N, r, p, dklen));
}

export { scrypt };