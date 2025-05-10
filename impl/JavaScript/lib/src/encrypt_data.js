import { get_random_bytes } from "./random.js";
import { derive_key } from "./derive_key.js";
import { hexlify, unhexlify } from "./binascii.js";
import { str_decode, str_encode } from "./str.js";
import * as Exceptions from './exceptions.js';
import { CheckAlgorithm } from "./internal-util.js";

function safeparse(json) {
    try {
        return JSON.parse(json);
    } catch {
        throw new Exceptions.InvalidParameterException('The JSON is not valid.');
    }
}

/**
 * @param {string} message
 * @param {string} key
 * @param {?string} [phrase] phrase
 * @param {number} [N] N
 */
export async function encrypt_data(message, key, phrase = null, N = null) {
    // (1) 生成随机IV (12 bytes for GCM)
    const iv = get_random_bytes(12);

    // 派生密钥
    const { derived_key, parameter, N: N2 } = await derive_key(key, iv, phrase, N);
    N = N2;

    // (4) 加密消息
    const cipher = await crypto.subtle.importKey("raw", derived_key, "AES-GCM", false, ["encrypt"]);

    if (typeof message !== "string") {
        throw new Exceptions.OperationNotPermittedException("The ability to directly encrypt binary data has been removed in the new version. Please use `encrypt_file` instead.");
    }

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
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

    return JSON.stringify({
        data: message_encrypted,
        parameter: parameter,
        N: N,
        v: 5.6,
        "a": "AES-GCM",
    });
}


/**
 * @param {string} message_encrypted
 * @param {string|Uint8Array} key
 */
export async function decrypt_data(message_encrypted, key) {
    const jsoned = safeparse(message_encrypted);
    const parameter = jsoned.parameter;
    const N = parseInt(jsoned.N);
    const alg = jsoned.a;
    CheckAlgorithm(alg);

    // 将十六进制字符串转换回字节
    const encrypted_data = unhexlify(jsoned.data);
    const [phrase, salt_b64] = parameter.split(':');
    const salt = unhexlify(salt_b64);

    if (isNaN(N) || !parameter || !encrypted_data || !salt) throw new Exceptions.BadDataException('The message or parameters are bad.')
    if (encrypted_data.length < 28) throw new Exceptions.BadDataException("The message was too short.");

    // 提取 IV (前12字节)、密文和认证标签(最后16字节)
    const iv = encrypted_data.slice(0, 12);
    const ciphertext = encrypted_data.slice(12, -16);
    const tag = encrypted_data.slice(-16);

    // const { derived_key } = await derive_key(key, iv, phrase, N, salt);
    const derived_key = (typeof key === "string") ?
        ((await derive_key(key, iv, phrase, N, salt)).derived_key) :
        (key);

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
        if (!e) throw new Exceptions.InternalError(`Internal error.`, { cause: e });
        const name = e.name;
        if (name === 'InvalidAccessError') throw new Exceptions.InvalidParameterException('InvalidAccessError.', { cause: e });
        if (name === 'OperationError') throw new Exceptions.CannotDecryptException('Cannot decrypt. Did you provide the correct password?', { cause: e });
        if (!e) throw new Exceptions.InternalError(`Unexpected error.`, { cause: e });
    }
}

