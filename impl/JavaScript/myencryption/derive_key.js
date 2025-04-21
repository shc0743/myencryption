import { load_deps_es5 } from "./loader.js";
const scryptAPI = await load_deps_es5('scrypt', import.meta.resolve('./WebScrypt/scrypt.js'));
import { hexlify } from "./binascii.js";
import { get_random_bytes, get_random_uint8_number } from "./random.js";
import { str_encode } from "./str.js";

scryptAPI.setResPath(import.meta.resolve('./WebScrypt/asset/'));
scryptAPI.load();

// 对 WebScrypt 的自定义封装
export const scrypt = (function () {
    const queue = [];
    let running = false;
    const work = (task) => new Promise(async (resolve) => {
        scryptAPI.onprogress = p => {
            if (task.onprogress) task.onprogress(p);
        };
        scryptAPI.oncomplete = dk => {
            task.resolve(dk);
            resolve(true);
        };
        scryptAPI.onerror = e => {
            task.reject(e);
            resolve(false);
        };
        scryptAPI.config({ N: task.N, r: task.r, P: task.p }, { maxPassLen: 1024, maxSaltLen: 1024, maxDkLen: 1024, maxThread: 1 });
        await new Promise(r => scryptAPI.onready = r);
        scryptAPI.hash(task.key, task.salt, task.dklen);
    });
    async function thread() {
        while (queue.length) try {
            const task = queue.splice(0, 1)[0];
            await work(task);
            await nextTick();
        } catch (e) { console.error('[scrypt]', 'Task failed', e); }
        running = false;
    }
    return function scrypt(key, salt, N, r, p, dklen, onprogress = null) {
        return new Promise((resolve, reject) => {
            queue.push({
                key, salt, N, r, p, dklen, resolve, reject, onprogress
            });
            if (!running) {
                running = true;
                setTimeout(thread); // 启动宏任务
            }
        });
    }
})();

export const deriveKey__phrases = ['Furina', 'Neuvillette', 'Venti', 'Nahida', 'Kinich', 'Kazuha'];
export async function derive_key(key, iv, phrase = null, N = null, salt = null, r = 8, p = 1, dklen = 32) {
    if (N === null) N = 262144;
    if (typeof N !== "number" || N > 2097152) {
        throw new TypeError("Invalid or too large N value!");
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
        throw new Error("phrase MUST NOT contain \":\"");
    }

    const parameter = `${phrase}:${hexlify(salt)}`;

    // (3) 生成加密密钥
    const keyInput = `MyEncryption/1.1 Fontaine/4.2 Iv/${hexlify(iv)} user_parameter=${parameter} user_key=${key}`;

    // 使用Scrypt进行密钥派生(pycryptodome没有PBKDF2HMAC，使用Scrypt作为替代)
    // AES-256需要32字节密钥
    const derived_key = await scrypt(str_encode(keyInput), salt, N, r, p, dklen)

    return ({ derived_key, parameter, N });
}

function nextTick() {
    return new Promise(r => setTimeout(r));
}


export async function scrypt_hex(key, salt, N, r, p, dklen) {
    return hexlify(await scrypt(str_encode(key), str_encode(salt), N, r, p, dklen));
}