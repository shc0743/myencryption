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

**注意**：JavaScript 版本功能有限。目前无法在 JavaScript 环境中更改文件的密码。

在项目中使用 JavaScript 版本：

1. [从发布页面获取模块](https://github.com/shc0743/myencryption/releases/)
2. 导入并使用提供的函数。注意：JavaScript 版本使用 `await` 进行异步操作，因此请确保代码在 `async` 函数中。

```javascript
// yourcode.js
import { encrypt_data, decrypt_data } from './myencryption/main.js';

async function example() {
    const secure = await encrypt_data('raw_text', 'your_password');
    const text = await decrypt_data(secure, 'your_password');
    console.log(text);
}
example();
```

由于浏览器限制，文件加密稍显复杂。（这不是我们可以改变的！）要了解更多，可以打开 [demo](./impl/JavaScript/demo/demo.js) 查看一个简单的示例。

# 文件格式

文件格式结构如下：

1. **头部 (16 字节)**：包含字符串 `MyEncryption/1.1`，用于标识文件格式和版本。
2. **加密主密钥 (1024 字节)**：
   - 4 字节：加密主密钥的长度。
   - 可变长度：加密主密钥。
   - 填充至 1024 字节。
3. **头部 JSON**：
   - 4 字节：JSON 元数据的长度。
   - 可变长度：包含参数（如 `N`、`iv` 和 `parameter`）的 JSON 元数据。
4. **加密数据块**：
   - 每个块包含：
     - 8 字节：原始数据长度。
     - 12 字节：块的 IV。
     - 可变长度：加密数据。
     - 16 字节：认证标签。
5. **尾部**：
   - 8 字节：结束标记（`0xFF, 0xFD, 0xF0, 0x10, 0x13, 0xD0, 0x12, 0x18`）。
   - 8 字节：原始文件的总字节数。
   - 2 字节：最终标记（`0x55, 0xAA`）。

# API 文档

### Python API

- `encrypt_data(raw_text, password, **kwargs)`：加密字符串。
- `decrypt_data(encrypted_text, password)`：解密字符串。
- `encrypt_file(input_file, output_file, password, **kwargs)`：加密文件。
- `decrypt_file(input_file, output_file, password)`：解密文件。

### JavaScript API

- `encrypt_data(message, key, phrase = null, N = null)`：异步加密字符串。
- `decrypt_data(message_encrypted, key)`：异步解密字符串。
- `encrypt_file(file_reader, file_writer, user_key, callback = null, phrase = null, N = null, chunk_size = 32 * 1024 * 1024)`：异步加密文件。
- `decrypt_file(file_reader, file_writer, user_key, callback = null)`：异步解密文件。
- `change_file_password(file_head, current_key, new_key)`：更改加密文件的密码。  
  **参数**：  
  - `file_head` (Blob)：文件头。建议提供 2KB，至少提供 1044 字节。  
  - `current_key` (String)：当前文件密码。  
  - `new_key` (String)：新密码。  
  **返回值**：  
  - `Blob`：新的文件头。请注意，新文件头的大小与原始文件不同。不要用它构造新文件，而是用新文件头直接写回去，覆盖原来的数据，不需要偏移文件。  
  **异常**：  
  - `Error`：如果文件头无效或文件大小不足。
   * 注意: 不建议在web端更改密码。由于浏览器写入文件的工作原理（https://developer.mozilla.org/zh-CN/docs/Web/API/FileSystemFileHandle/createWritable ）
 * 任何通过写入流造成的更改在写入流被关闭前都不会反映到文件句柄所代表的文件上。这通常是将数据写入到一个临时文件来实现的，然后只有在写入文件流被关闭后才会用临时文件替换掉文件句柄所代表的文件。
 * 也就是说，旧密码将始终存在于磁盘上。这将导致敏感数据泄露。
 * 另外，由于这个特性，大文件相关操作会变得非常非常慢。
 * 所以，除非特殊情况，务必始终使用 native 应用程序来修改文件密码

# 许可证

本项目：**GPL-3.0**。

## 第三方库

[@EtherDream/WebScrypt](https://github.com/EtherDream/WebScrypt) (MIT)
```
## License

[MIT](https://opensource.org/licenses/MIT)
```

