import { get_random_bytes } from "./random.js";
import { derive_key } from "./derive_key.js";
import { hexlify, unhexlify } from "./binascii.js";
import { str_decode, str_encode } from "./str.js";
import * as Exceptions from './exceptions.js';
import { CheckAlgorithm } from "./internal-util.js";

const crypto = globalThis.crypto; // To avoid the possible security risk

/**
 * @param {string} json
 */
function safeparse(json) {
    try {
        const r = JSON.parse(json);
        if (!r || !r.data || !r.phrase || !r.salt || !r.N || !r.v) throw new Exceptions.BadDataException('The message is bad since the JSON is not complete.');
        return r;
    } catch {
        throw new Exceptions.BadDataException('The message is bad since it is neither a JSON or a new-format ciphertext.');
    }
}

/**
 * @param {string} message
 * @param {string} key
 * @param {?string} phrase phrase
 * @param {?number} N N
 */
export async function encrypt_data(message, key, phrase = null, N = null) {
    // (1) 生成随机IV (12 bytes for GCM)
    const iv = get_random_bytes(12);

    // (2) 派生密钥
    const { derived_key, parameter, N: N2 } = await derive_key(key, iv, phrase, N);
    N = N2;

    // (3) 导入密钥
    const cipher = await crypto.subtle.importKey("raw", derived_key, "AES-GCM", false, ["encrypt"]);

    if (typeof message !== "string") {
        throw new Exceptions.OperationNotPermittedException("The ability to directly encrypt binary data has been removed in the new version. Please use `encrypt_file` instead.");
    }

    const alg = "AES-GCM";

    // (4) 加密消息
    const ciphertext = await crypto.subtle.encrypt(
        {
            name: alg,
            iv: iv
        },
        cipher,
        str_encode(message)
    );

    // 组合IV + 密文 + 认证标签
    const encrypted_message = new Uint8Array(iv.length + ciphertext.byteLength);
    encrypted_message.set(iv, 0);
    encrypted_message.set(new Uint8Array(ciphertext), iv.length);
    const message_encrypted = hexlify(encrypted_message);

    const v = 5.6;

    // 返回数据
    return `:${message_encrypted}:${parameter}:${N}:${v}:${alg}:`;
}


/**
 * @param {string} message_encrypted
 */
export async function parse_ciphertext(message_encrypted) {
    let jsoned;
    if (message_encrypted.charAt(0) === ':') {
        const arr = message_encrypted.split(':');
        if (arr.length !== 8) throw new Exceptions.BadDataException('The message is bad.');
        const [, data, phrase, salt, N, v, a,] = arr;
        jsoned = { data, phrase, salt, N: +N, v: +v, a };
    } else {
        jsoned = safeparse(message_encrypted);
    }
    const N = parseInt(jsoned.N);
    const alg = jsoned.a;
    CheckAlgorithm(alg);

    // 将十六进制字符串转换回字节
    const encrypted_data = unhexlify(jsoned.data);
    let phrase, salt_b64;
    if (jsoned.parameter) [phrase, salt_b64] = jsoned.parameter.split(':');
    else {
        phrase = jsoned.phrase; salt_b64 = jsoned.salt;
    }
    const salt = unhexlify(salt_b64);

    if (isNaN(N) || !phrase || ('string' !== typeof phrase) || !encrypted_data || !salt)
        throw new Exceptions.BadDataException('The message or parameters are bad.')
    if (encrypted_data.length < 28)
        throw new Exceptions.BadDataException("The message was too short.");

    // 提取 IV (前12字节)、密文和认证标签(最后16字节)
    const iv = encrypted_data.slice(0, 12);
    const ciphertext = encrypted_data.slice(12, -16);
    const tag = encrypted_data.slice(-16);

    return { iv, ciphertext, tag, phrase, salt, N };
}

/**
 * @param {string} message_encrypted
 * @param {string|Uint8Array} key
 */
export async function decrypt_data(message_encrypted, key) {
    const { iv, ciphertext, tag, phrase, salt, N } = await parse_ciphertext(message_encrypted);

    const derived_key = (typeof key === "string") ?
        ((await derive_key(key, iv, phrase, N, salt)).derived_key) :
        (key);
    if (!(derived_key instanceof Uint8Array)) throw new Exceptions.InvalidParameterException("The key is not valid.");

    const cipher = await crypto.subtle.importKey("raw", derived_key, "AES-GCM", false, ["decrypt"]);

    try {
        const decrypted_data = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            cipher,
            new Uint8Array([...ciphertext, ...tag])
        );

        try {
            return str_decode(decrypted_data);
        } catch {
            throw new Exceptions.OperationNotPermittedException("The ability to directly decrypt binary data has been removed in the new version. If you have encrypted binary data, please recover it using the old version.");
        }
    }
    catch (e) {
        if (!e || !(e instanceof DOMException)) throw new Exceptions.InternalError(`Internal error.`, { cause: e });
        const name = e.name;
        if (name === 'InvalidAccessError') throw new Exceptions.InvalidParameterException('InvalidAccessError.', { cause: e });
        if (name === 'OperationError') throw new Exceptions.CannotDecryptException('Cannot decrypt. Did you provide the correct password?', { cause: e });
        throw new Exceptions.InternalError(`Unexpected error.`, { cause: e });
    }
}

