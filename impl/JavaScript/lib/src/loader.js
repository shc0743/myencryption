export function load_script(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = e => reject(e);
        document.head.append(script);
    });
}

export function load_module(src) {
    return import(src); // just a wrapper
}

export function load_deps_es5(deps_name, deps_src) {
    if (Reflect.has(globalThis, deps_name)) return Promise.resolve(Reflect.get(globalThis, deps_name));
    return load_script(deps_src).then(() => {
        return Reflect.get(globalThis, deps_name);
    });
}