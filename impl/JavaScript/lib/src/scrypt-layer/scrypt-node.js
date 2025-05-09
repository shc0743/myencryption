// @ts-ignore
import { scrypt as s } from 'scrypt-js';

export function scrypt(key, salt, N, r, p, dklen, onprogress = null) {
    return s(key, salt, N, r, p, dklen, (onprogress ? ((progress) => {
        onprogress(progress);
    }) : undefined));
}