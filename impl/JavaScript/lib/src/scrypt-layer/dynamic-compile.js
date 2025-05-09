import { load_deps_es5 } from "../loader.js";
const scryptAPI = await load_deps_es5('scrypt', import.meta.resolve('./WebScrypt/scrypt.js'));
scryptAPI.setResPath(import.meta.resolve('./WebScrypt/asset/'));
scryptAPI.load();



// 对 WebScrypt 的自定义封装
export const scrypt = (function () {
    const queue = [];
    let running = false;
    const work = (task) => new Promise(async (resolve, reject) => {
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
        try {
            scryptAPI.config({ N: task.N, r: task.r, P: task.p }, { maxPassLen: 8192, maxSaltLen: 2048, maxDkLen: 1024, maxThread: 1 });
            await new Promise(r => scryptAPI.onready = r);
            scryptAPI.hash(task.key, task.salt, task.dklen);
        } catch (e) {
            reject(e);
        }
    });
    async function thread() {
        let task = null;
        while (queue.length) try {
            task = queue.splice(0, 1)[0];
            await work(task);
            await nextTick();
        } catch (e) {
            task?.reject(e);
        }
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


function nextTick() {
    return new Promise(r => setTimeout(r));
}