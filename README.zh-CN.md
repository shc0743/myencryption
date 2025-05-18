# MyEncryption

一个跨平台的加密库，使用 AES_256_GCM，封装了加密细节，用户可以轻松使用。

[English Version](./README.md)

## 功能

- 易于使用的加密
- 安全的加密方法
- AES_256_GCM 加密结合 Scrypt，默认 N=262144
- 跨平台（目前支持：Python 和 JavaScript）
- 参数可自定义

# 如何使用

目前我们已完成 [Python](./impl/Python/encryption.py) 和 [JavaScript](./impl/JavaScript/myencryption/main.js) 版本。

## Python

**重要提示**：Python 版本目前已过时，我正在着手于新版本的开发工作。在新版本完成之前，请尽量不要使用Python版。

如果您是最终用户，最简单的使用方式是[获取基于模块的应用程序](https://github.com/shc0743/myencryption/releases/)。

如果您是开发者并需要在项目中使用：

1. [从发布页面获取模块](https://github.com/shc0743/myencryption/releases/)
2. 确保已安装 `pycryptodome`。
3. 使用非常简单。

```python
# yourcode.py
from encryption import encrypt_data, decrypt_data

secure = encrypt_data('raw_text', 'your_password')  # 无需额外参数（但可选）

text = decrypt_data(secure, 'your_password')  # 无需记住参数
```

也支持加密文件。

```python
# yourcode2.py
from encryption import encrypt_file, decrypt_file

encrypt_file('raw_file.png', 'secure.bin', 'your_password')

decrypt_file('secure.bin', 'new_raw_file.png', 'your_password')
```

## JavaScript

**注意**：JavaScript 版本功能有限

要在项目中使用 JavaScript 版本：

1. 使用 npm 安装（**推荐**） 或 [从发布页面获取模块](https://github.com/shc0743/myencryption/releases/)
2. 导入并使用提供的函数。注意：JavaScript 版本使用 `Promise` 进行异步操作。

For a demo, please [go here](https://github.com/shc7432/MyEncryptionApp-Demo/tree/main)

**注意**：在 Vite 或其他构建工具中使用此库需要使用特殊的语法。

### 通过 npm 安装

运行以下命令：

```bash
npm i simple-data-crypto
```

### 示例

**注意**: 在不同的环境中需要使用不同的导入方式。

Node.js 环境 或者 原生浏览器环境：
```javascript
// yourcode.js
import { encrypt_data, decrypt_data } from 'simple-data-crypto'; // npm的自动选择一般不会出现问题
// 如果在Node中这段代码无法正常工作，改为：
// import { encrypt_data, decrypt_data } from 'simple-data-crypto/node';
// 如果在浏览器中这段代码无法正常工作，改为：
// import { encrypt_data, decrypt_data } from 'simple-data-crypto/browser';

async function example() {
    const secure = await encrypt_data('raw_text', 'your_password');
    const text = await decrypt_data(secure, 'your_password');
    console.log(text);
}
example();
```

使用 Vite 或其他构建工具的环境：

```javascript
import { encrypt_data, decrypt_data } from'simple-data-crypto/builder'; // 必须手动指定

// 使用方式与上面相同
```

由于浏览器限制，文件加密稍显复杂。（这不是我们可以改变的！）

# 文件格式

[文件格式规范](./docs/general/file-format-spec.zh-CN.md)

# API 文档

### Python API
[English edition](./docs/Python/api-docs.md) | [中文版本](./docs/Python/api-docs.zh-CN.md)

### JavaScript API
[English edition](./docs/JavaScript/api-docs.md) | [中文版本](./docs/JavaScript/api-docs.zh-CN.md)

### 最近的破坏性变更

[>=1.5.0] `Stream` 被重命名为 `InputStream`。没有实际上的 API 更改，但（如果用到）需要重命名。

# 许可证

本项目：**MIT License**。

## 第三方库

[@EtherDream/WebScrypt](https://github.com/EtherDream/WebScrypt) (MIT)
```
## License

[MIT](https://opensource.org/licenses/MIT)
```

[scrypt-js](https://www.npmjs.com/package/scrypt-js) (MIT)

[esbuild](https://www.npmjs.com/package/esbuild) (MIT)

[pycryptodome](https://www.pycryptodome.org/src/license) (partially in the public domain and partially released under the BSD 2-Clause license)

