import { hexlify } from "./binascii.js";
import { get_random_bytes, get_random_uint8_number } from "./random.js";
import { str_encode } from "./str.js";
import * as Exceptions from './exceptions.js';
import { scrypt } from './scrypt-layer/entrance.js';

export const deriveKey__phrases = ['Furina', 'Neuvillette', 'Venti', 'Nahida', 'Kinich', 'Kazuha'];
/**
 * Derive a key from a phrase and a key.
 * @param {string} key 
 * @param {Uint8Array} iv 
 * @param {?string} phrase 
 * @param {?number} N 
 * @param {?Uint8Array} salt 
 * @param {?number} r 
 * @param {?number} p 
 * @param {?number} dklen 
 * @returns 
 */
export async function derive_key(key, iv, phrase = null, N = null, salt = null, r = 8, p = 1, dklen = 32) {
    if (N === null) N = 262144;
    if (typeof N !== "number" || N > 2097152) {
        throw new Exceptions.InvalidScryptParameterException();
    }

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


export async function scrypt_hex(key, salt, N, r, p, dklen) {
    return hexlify(await scrypt(str_encode(key), str_encode(salt), N, r, p, dklen));
}

export { scrypt };