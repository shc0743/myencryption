# 关于构建工具

[直接看解决方案](#临时性解决方案)

在 [derive_key.js](../../impl/JavaScript/lib/src/derive_key.js) 中, 我们使用以下代码动态导入 WebScrypt 库：

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

这在纯浏览器环境中运行得很好, 但在 Node.js 环境中可能会出现问题, 因为 Node.js 中没有 `document` 对象，也无法处理这样的传统模块动态导入。

据查询，[WebScrypt](https://github.com/EtherDream/WebScrypt) 没有通过 npm 发布，而是直接将其作为一个仓库托管在 GitHub 上。为了方便原生ESM的导入，我们使用了上述代码，将其作为类似于ES6模块的方式进行导入。

这样做的好处是，我们的代码可以直接在浏览器中运行，可是当与构建工具配合使用时，构建工具无法正确定位到 `scrypt.js` 文件，导致构建失败。

以 Vite 为例，如果直接导入，可能出现类似以下错误：

```ts
// 默认配置(vite.config.js)

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

    node_modules/simple-web-encryption/dist/main.bundle.js:229:16:
      229 │ var scryptAPI = await load_deps_es5("scrypt", import.meta.resolve("./WebScrypt/scrypt.js"));
          ╵                 ~~~~~

YOUR_APP_PATH/node_modules/esbuild/lib/main.js:1477
  let error = new Error(text);
              ^

Error: Build failed with 1 error:
node_modules/simple-web-encryption/dist/main.bundle.js:229:16: ERROR: Top-level await is not available in the configured target environment ("chrome87", "edge88", "es2020", "firefox78", "safari14" + 2 overrides)
    at failureErrorWithLog (YOUR_APP_PATH/node_modules/esbuild/lib/main.js:1477:15)   
    at YOUR_APP_PATH/node_modules/esbuild/lib/main.js:946:25
    at YOUR_APP_PATH/node_modules/esbuild/lib/main.js:1355:9
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  errors: [Getter/Setter],
  warnings: [Getter/Setter]
}

Node.js v22.15.0
```

即使我们在 `vite.config.js` 中配置了 `esbuild.target: 'es2022'`，也无法解决问题。

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
            target: 'es2022' // 确保设置为支持 top-level await 的版本
        }
    }
})
```

仍然会报错：

```bash
The file does not exist at "YourApp/node_modules/.vite/deps/WebScrypt/scrypt.js" which is in the optimize deps directory. The dependency might be incompatible with the dep optimizer. Try adding it to `optimizeDeps.exclude`.
```

## 临时性解决方案

使用以下配置：

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
                "simple-web-encryption",
            ],
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2022' // 确保设置为支持 top-level await 的版本
        },
        exclude: [
            "simple-web-encryption",
        ]
    }
})
```

然后，在 `index.html` 中，我们需要添加 importmap：

```html
<script type="importmap">{
"imports":{
    "simple-web-encryption": "./lib/simple-web-encryption/dist/main.bundle.min.js"
}
}</script>
```

最后，需要把 simple-web-encryption 的dist目录中`main.bundle.min.js`以及整个 `WebScrypt` 复制到固定位置。

# 我们的努力

我们正在努力尝试解决此问题，可能需要一段时间，届时可以直接使用 npm 管理，不再需要手动导入。

如果您有更好的解决方案，欢迎提交 issue 或 pull request。

