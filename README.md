# MyEncryption

A cross-platform encryption tool

# How to use

Currently we have finished [Python](./impl/Python/encryption.py) and [JavaScript](./impl/JavaScript/myencryption/main.js) editions.

## Python

The easiest way to use is to [Get the application based on the module](./impl/Python/encryption_app-v2.py). If you need to use it in your project:

1. [Get the module](./impl/Python/encryption.py)
2. Ensure that `pycryptodome` is installed.
3. It is very easy-to-use.

```python
# yourcode.py
from encryption import encrypt_data, decrypt_data

secure = encrypt_data('raw_text', 'your_password')

text = decrypt_data(secure, 'your_password')
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

1. [Get the module](./impl/JavaScript/myencryption/main.js)
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

File encryption is a little more difficult due to browser limitations. To learn more, you can open the [demo](./impl/JavaScript/demo/demo.js).

# File format

(待完善)

# LICENSE
GPL-3.0

## 3rd-party libraries

[@EtherDream/WebScrypt](https://github.com/EtherDream/WebScrypt) (MIT)
```
## License

[MIT](https://opensource.org/licenses/MIT)
```
