# About Build Tools

# This article is outdated and does not reflect the current situation. There is no need to continue reading. This document is kept mainly to prevent unexpected issues.

---

[Chinese edition](./about-build-tools.zh-CN.md)

[Directly show me the solution](#temporary-solution)

In [derive_key.js](../../impl/JavaScript/lib/src/derive_key.js), we use the following code to dynamically import the WebScrypt library:

```javascript
const scryptAPI = await load_deps_es5('scrypt', import.meta.resolve('./WebScrypt/scrypt.js'));
```

```javascript
// loader.js
export function load_script(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = e => reject(e);
        document.head.append(script);
    });
}

export function load_deps_es5(deps_name, deps_src) {
    if (Reflect.has(globalThis, deps_name)) return Promise.resolve(Reflect.get(globalThis, deps_name));
    return load_script(deps_src).then(() => {
        return Reflect.get(globalThis, deps_name);
    });
}
```

This works well in a pure browser environment but may cause issues in Node.js because `document` is not available in Node.js, and such traditional module dynamic imports cannot be handled.

According to research, [WebScrypt](https://github.com/EtherDream/WebScrypt) is not published via npm but is hosted directly on GitHub as a repository. To facilitate native ESM imports, we use the above code to import it in a way similar to ES6 modules.

The advantage of this approach is that our code can run directly in the browser. However, when used with build tools, the build tools cannot correctly locate the `scrypt.js` file, causing the build to fail.

For example, with Vite, directly importing may result in errors like the following:

```ts
// Default configuration (vite.config.js)

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    server: {
        port: 5173
    },
})
```

```bash
> vite

17:30:16 [vite] (client) Re-optimizing dependencies because vite config has changed

  VITE v6.3.4  ready in 4809 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
X [ERROR] Top-level await is not available in the configured target environment ("chrome87", "edge88", "es2020", "firefox78", "safari14" + 2 overrides)

    node_modules/simple-data-crypto/dist/main.bundle.js:229:16:
      229 │ var scryptAPI = await load_deps_es5("scrypt", import.meta.resolve("./WebScrypt/scrypt.js"));
          ╵                 ~~~~~

YOUR_APP_PATH/node_modules/esbuild/lib/main.js:1477
  let error = new Error(text);
              ^

Error: Build failed with 1 error:
node_modules/simple-data-crypto/dist/main.bundle.js:229:16: ERROR: Top-level await is not available in the configured target environment ("chrome87", "edge88", "es2020", "firefox78", "safari14" + 2 overrides)
    at failureErrorWithLog (YOUR_APP_PATH/node_modules/esbuild/lib/main.js:1477:15)   
    at YOUR_APP_PATH/node_modules/esbuild/lib/main.js:946:25
    at YOUR_APP_PATH/node_modules/esbuild/lib/main.js:1355:9
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  errors: [Getter/Setter],
  warnings: [Getter/Setter]
}

Node.js v22.15.0
```

Even if we configure `esbuild.target: 'es2022'` in `vite.config.js`, the issue cannot be resolved.

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    server: {
        port: 5173
    },
    build: {
        target: "esnext",
        sourcemap: true,
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2022' // Ensure the version supports top-level await
        }
    }
})
```

The error persists:

```bash
The file does not exist at "YourApp/node_modules/.vite/deps/WebScrypt/scrypt.js" which is in the optimize deps directory. The dependency might be incompatible with the dep optimizer. Try adding it to `optimizeDeps.exclude`.
```

## Temporary Solution

Use the following configuration:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    server: {
        port: 5173
    },
    build: {
        target: "esnext",
        sourcemap: true,
        rollupOptions: {
            external: [
                "simple-data-crypto",
            ],
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2022' // Ensure the version supports top-level await
        },
        exclude: [
            "simple-data-crypto",
        ]
    }
})
```

Then, in `index.html`, add an import map:

```html
<script type="importmap">{
"imports":{
    "simple-data-crypto": "./lib/simple-data-crypto/dist/main.bundle.min.js"
}
}</script>
```

Finally, copy the `main.bundle.min.js` file and the entire `WebScrypt` directory from the `simple-data-crypto` dist folder to a fixed location.

## Our Efforts

We are working to resolve this issue, which may take some time. Once resolved, you will be able to manage it directly via npm without manual imports.

If you have a better solution, feel free to submit an issue or pull request.