# simple-data-crypto

A cross-platform encryption library, using AES_256_GCM, with cipher details wrapped so that the user can use it easily.

[中文版](./README.zh-CN.md)

## Features

- Easy-to-use encryption
- Secure encryption method
- AES_256_GCM encryption plus Scrypt, with default N=262144
- Cross-platform (currently: Python and JavaScript)
- Parameter customizable

# How to use

Currently we have finished [Python](./impl/Python/encryption.py) and [JavaScript](./impl/JavaScript/myencryption/main.js) editions.

## Python

**Important**: The Python edition is currently out-dated. Please try not to use it while I am working on the new edition.

If you are the end user, the easiest way to use the app is to [Get the application based on the module](https://github.com/shc0743/myencryption/releases/).

If you are a developer and need to use it in your project:

1. [Get the module from the releases](https://github.com/shc0743/myencryption/releases/)
2. Ensure that `pycryptodome` is installed.
3. It is easy-to-use.

```python
# yourcode.py
from encryption import encrypt_data, decrypt_data

secure = encrypt_data('raw_text', 'your_password')  # No extra arguments required (but optional)

text = decrypt_data(secure, 'your_password')  # No necessary to remember parameters
```

Encrypting a file is also supported.

```python
# yourcode2.py
from encryption import encrypt_file, decrypt_file

encrypt_file('raw_file.png', 'secure.bin', 'your_password')

decrypt_file('secure.bin', 'new_raw_file.png', 'your_password')
```

## JavaScript

**Notice**: The JavaScript edition is functional-limited

To use the JavaScript version in your project:

1. Install by npm (**Recommended**) or [Get the module from the releases](https://github.com/shc0743/myencryption/releases/)
2. Import and use the provided functions. Note: The JavaScript version uses `await` for asynchronous operations, so ensure your code is inside an `async` function.

For a demo, please [go here](https://github.com/shc7432/MyEncryptionApp-Demo/tree/main)

**Note**: When using this library in Vite or other build tools, special syntax is required.

### Install via npm

Run the following command:

```bash
npm i simple-data-crypto
```

### Examples

**Note**: Different import methods are required in different environments.

Node.js environment or native browser environment:
```javascript
// yourcode.js
// Auto-selection generally works well
import { encrypt_data, decrypt_data } from 'simple-data-crypto';
// If not working in Node.js, use:
// import { encrypt_data, decrypt_data } from 'simple-data-crypto/node';
// If not working in browser, use:
// import { encrypt_data, decrypt_data } from 'simple-data-crypto/browser';

async function example() {
    const secure = await encrypt_data('raw_text', 'your_password');
    const text = await decrypt_data(secure, 'your_password');
    console.log(text);
}
example();
```

When using Vite or other build tools:

```javascript
import { encrypt_data, decrypt_data } from 'simple-data-crypto/builder'; // Must specify manually

// Usage is the same as above
```

File encryption is a little more difficult due to browser limitations. (That is not what we can improve!)

# File format

See [File Format spec](./docs/general/file-format-spec.md) for details. Chinese version: [文件格式规范](./docs/general/file-format-spec.zh-CN.md)

# API Docs

### Python API
[English edition](./docs/Python/api-docs.md) | [中文版本](./docs/Python/api-docs.zh-CN.md)

### JavaScript API
[English edition](./docs/JavaScript/api-docs.md) | [中文版本](./docs/JavaScript/api-docs.zh-CN.md)

# LICENSE

This project: **MIT License**.

## 3rd-party libraries

[@EtherDream/WebScrypt](https://github.com/EtherDream/WebScrypt) (MIT)
```
## License

[MIT](https://opensource.org/licenses/MIT)
```

[scrypt-js](https://www.npmjs.com/package/scrypt-js) (MIT)

[esbuild](https://www.npmjs.com/package/esbuild) (MIT)

[pycryptodome](https://www.pycryptodome.org/src/license) (partially in the public domain and partially released under the BSD 2-Clause license)
