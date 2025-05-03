import * as Exceptions from './exceptions.js';

const CRYPT_CONTEXT = Object.create(null);
CRYPT_CONTEXT[Symbol.toStringTag] = 'CryptContext';
CRYPT_CONTEXT['toString'] = function () {
    return `${this[Symbol.toStringTag]} Object`;
};

export { CRYPT_CONTEXT as CryptContext };

async function _await(PromiseLike) {
    if (PromiseLike instanceof Promise) return await PromiseLike;
    return PromiseLike;
}

export async function crypt_context_create() {
    const ctx = Object.create(CRYPT_CONTEXT);
    Object.defineProperty(ctx, '_created', { value: true });
    return ctx;
}

export async function crypt_context_destroy(ctx) {
    if (!ctx || ctx._released) throw new Exceptions.InvalidParameterException("Invalid context");
    for (const i of Reflect.ownKeys(ctx)) {
        const o = Reflect.get(ctx, i);
        if (o) {
            if (o.release) await _await(o.release());
            else if (o.free) await _await(o.free());
            else if (o.reset) await _await(o.reset());
            else if (o.clear) await _await(o.clear());
        }
        if (!i.startsWith('_')) Reflect.deleteProperty(ctx, i);
    }
    Object.defineProperty(ctx, '_released', { value: true });
    return true;
}

