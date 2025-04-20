# MyEncryption

A cross-platform encryption library, using AES_256_GCM, with cipher details wrapped so that the user can use it easily

## Features

- Easy-to-use encryption
- Secure encryption method
- AES_256_GCM encryption plus Scrypt, with default N=262144
- Cross-platform (currently: Python and JavaScript)
- Parameter customizable

# How to use

Currently we have finished [Python](./impl/Python/encryption.py) and [JavaScript](./impl/JavaScript/myencryption/main.js) editions.

## Python

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

Encryption a file is also supported.

```python
# yourcode2.py
from encryption import encrypt_file, decrypt_file

encrypt_file('raw_file.png', 'secure.bin', 'your_password')

decrypt_file('secure.bin', 'new_raw_file.png', 'your_password')
```

## JavaScript

**Notice**: The JavaScript edition is functional-limited. Currently it is not able to change a file's password in JavaScript context.

To use the JavaScript version in your project:

1. [Get the module from the releases](https://github.com/shc0743/myencryption/releases/)
2. Import and use the provided functions. Note: The JavaScript version uses `await` for asynchronous operations, so ensure your code is inside an `async` function.

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

File encryption is a little more difficult due to browser limitations. (That is not what we can improve!) To learn more, you can open the [demo](./impl/JavaScript/demo/demo.js) to see a simple demo.

# File format

(待完善)

# API Docs

(待完善)

# LICENSE

This project: **GPL-3.0**.

## 3rd-party libraries

[@EtherDream/WebScrypt](https://github.com/EtherDream/WebScrypt) (MIT)
```
## License

[MIT](https://opensource.org/licenses/MIT)
```

