# MyEncryption

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

### npm usage

Install by the following command:

```bash
npm i simple-web-encryption
```

### Example usage

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

File encryption is a little more difficult due to browser limitations. (That is not what we can improve!)

# File format

See [File Format spec](./docs/general/file-format-spec.md) for details. Chinese version: [文件格式规范](./docs/general/file-format-spec.zh-CN.md)

# API Docs

### Python API

- `encrypt_data(raw_text, password, **kwargs)`: Encrypts a string.
- `decrypt_data(encrypted_text, password)`: Decrypts a string.
- `encrypt_file(input_file, output_file, password, **kwargs)`: Encrypts a file.
- `decrypt_file(input_file, output_file, password)`: Decrypts a file.

### JavaScript API

- `encrypt_data(message, key, phrase = null, N = null)`: Encrypts a string asynchronously.
- `decrypt_data(message_encrypted, key)`: Decrypts a string asynchronously.
- `encrypt_file(file_reader, file_writer, user_key, callback = null, phrase = null, N = null, chunk_size = 32 * 1024 * 1024)`: Encrypts a file asynchronously.
- `decrypt_file(file_reader, file_writer, user_key, callback = null)`: Decrypts a file asynchronously.
- `change_file_password(file_head, current_key, new_key)`: Changes the password of an encrypted file.

* Note: It is not recommended to change the password in a web browser. Due to the way browsers handle file writing (https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable):
* Any changes made through a writable stream will not be reflected in the file represented by the file handle until the stream is closed. This is typically implemented by writing data to a temporary file and then replacing the file handle's file with the temporary file once the stream is closed.
* This means the old password will always remain on disk, potentially leading to sensitive data leakage.
* Additionally, due to this behavior, operations on large files can become extremely slow.
* Therefore, unless in special circumstances, always use a native application to modify file passwords.

# LICENSE

This project: **MIT License**.

## 3rd-party libraries

[@EtherDream/WebScrypt](https://github.com/EtherDream/WebScrypt) (MIT)
```
## License

[MIT](https://opensource.org/licenses/MIT)
```

