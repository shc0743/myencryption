[English edition](./api-docs.md)

# JavaScript API 文档

# API 列表

有关更多详细信息，请参阅 [d.ts 文件](../../impl/JavaScript/lib/dist/main.bundle.d.ts)。

## 核心功能

大多数情况下您仅会使用以下功能：

### `encrypt_data(message, key, phrase = null, N = null)`

加密字符串或 Uint8Array。

- **参数**：
  - `message`: `string | Uint8Array` - 要加密的消息。
  - `key`: `string` - 加密密钥。
  - `phrase`: `string` (可选) - 可选的密码短语。
  - `N`: `number` (可选) - scrypt 参数 N。
- **返回值**：`string` - 加密后的消息。

---

### `decrypt_data(message_encrypted, key)`

解密加密字符串。

- **参数**：
  - `message_encrypted`: `string` - 加密的消息。
  - `key`: `string` - 解密密钥。
- **返回值**：`string | ArrayBuffer` - 解密后的消息。

---

### `encrypt_file(file_reader, file_writer, user_key, callback = null, phrase = null, N = null, chunk_size = 32 * 1024 * 1024)`

异步加密文件。

- **参数**：
  - `file_reader`: `(start: number, end: number) => Promise<Uint8Array>` - 文件读取函数。
  - `file_writer`: `(data: Uint8Array) => Promise<void> | void` - 文件写入函数。
  - `user_key`: `string` - 用户密钥。
  - `callback`: `(progress: number, total: number) => void` (可选) - 进度回调。
  - `phrase`: `string | null` (可选) - 可选的密码短语。
  - `N`: `number | null` (可选) - scrypt 参数 N。
  - `chunk_size`: `number` (可选) - 分块大小（默认：32MB）。
- **返回值**：`Promise<boolean>` - 加密是否成功。

---

### `decrypt_file(file_reader, file_writer, user_key, callback = null)`

异步解密文件。

- **参数**：
  - `file_reader`: `(start: number, end: number) => Promise<Uint8Array>` - 文件读取函数。
  - `file_writer`: `(data: Uint8Array) => Promise<void> | void` - 文件写入函数。
  - `user_key`: `string` - 用户解密密钥。
  - `callback`: `(progress: number, total: number) => void` (可选) - 进度回调。
- **返回值**：`Promise<boolean>` - 解密是否成功。

---

### `export_master_key(file_head, current_key, export_key)`

导出文件的主密钥。

- **参数**：
  - `file_head`: `Blob` - 文件头（推荐大小：5KB）。
  - `current_key`: `string` - 当前文件密码。
  - `export_key`: `string` - 用于保护主密钥的密码。
- **返回值**：`Promise<string>` - 导出的密钥。

---

### `change_file_password(file_head, current_key, new_key)`

更改加密文件的密码。

- **参数**：
  - `file_head`: `Blob` - 文件头（推荐大小：5KB）。
  - `current_key`: `string` - 当前文件密码。
  - `new_key`: `string` - 新密码。
- **返回值**：`Promise<Blob>` - 新的文件头。

* 注意: 不建议在web端更改密码。由于浏览器写入文件的工作原理（https://developer.mozilla.org/zh-CN/docs/Web/API/FileSystemFileHandle/createWritable ）
* 任何通过写入流造成的更改在写入流被关闭前都不会反映到文件句柄所代表的文件上。这通常是将数据写入到一个临时文件来实现的，然后只有在写入文件流被关闭后才会用临时文件替换掉文件句柄所代表的文件。
* 也就是说，旧密码将始终存在于磁盘上。这将导致敏感数据泄露。
* 另外，由于这个特性，大文件相关操作会变得非常非常慢。
* 所以，除非特殊情况，务必始终使用 native 应用程序来修改文件密码

---

## 上下文管理

大多数情况下，不需要使用上下文对象。目前仅流解密需要上下文。

### 异步 `crypt_context_create()`

创建新的加密上下文。

- **返回值**：`Promise<CryptContext>`。

---

### 异步 `crypt_context_destroy(ctx)`

销毁加密上下文。

- **参数**：
  - `ctx`: `CryptContext` - 要销毁的上下文。
- **返回值**：`Promise<true>`。

---

## 流式解密

### `decrypt_stream_init(ctx, stream, password, options)`

准备流解密。

- **参数**：
  - `ctx`: `CryptContext` - 解密上下文。
  - `stream`: `Stream` - 要解密的流。
  - `password`: `string` - 解密密码。
  - `options`: `DecryptStreamInitOptions` (可选) - 初始化选项。
- **返回值**：`Promise<void>`。

---

### `decrypt_stream(ctx, bytes_start, bytes_end, abort)`

解密流的一部分。

- **参数**：
  - `ctx`: `CryptContext` - 解密上下文。
  - `bytes_start`: `number` - 起始字节。
  - `bytes_end`: `number` - 结束字节。
  - `abort`: `AbortController` (可选) - 用于取消操作的中止控制器。
- **返回值**：`Promise<Blob>` - 解密后的数据（Blob）。

---

### `Stream`

表示数据流。

- **构造函数**：
  - `Stream(reader, size)`
    - `reader`: `(start: number, end: number, signal: AbortSignal) => Promise<Uint8Array>` - 读取函数。
    - `size`: `number` - 流的大小。
- **方法**：
  - `read(start, end, suggestion_end = null, abort = null)`：读取流的一部分。
  - `abort()`：中止流。
  - `purge()`：清除流。
  - `close()`：关闭流。
- **属性**：
  - `size`: `number | null` - 流的大小。

---

## 内部 API（高级用户）

### `derive_key(key, iv, phrase = null, N = null, salt = null, r, p, dklen)`

使用 scrypt 算法派生密钥。

- **参数**：
  - `key`: `string | Uint8Array` - 输入密钥。
  - `iv`: `Uint8Array` - 初始化向量。
  - `phrase`: `string | null` (可选) - 可选的密码短语。
  - `N`: `number | null` (可选) - scrypt 参数 N。
  - `salt`: `Uint8Array | null` (可选) - 盐值。
  - `r`: `number` - scrypt 参数 r。
  - `p`: `number` - scrypt 参数 p。
  - `dklen`: `number` - 所需密钥长度。
- **返回值**：一个 Promise，解析为包含以下内容的对象：
  - `derived_key`: `Uint8Array` - 派生的密钥。
  - `parameter`: `string` - 参数字符串。
  - `N`: `number` - scrypt 参数 N。

---

### `scrypt(key, salt, N, r, p, dklen, onprogress)`

执行 scrypt 密钥派生函数。

- **参数**：
  - `key`: `Uint8Array` - 输入密钥。
  - `salt`: `Uint8Array` - 盐值。
  - `N`: `number` - scrypt 参数 N。
  - `r`: `number` - scrypt 参数 r。
  - `p`: `number` - scrypt 参数 p。
  - `dklen`: `number` - 所需密钥长度。
  - `onprogress`: `(progress: number) => void` (可选) - 进度回调。
- **返回值**：一个 Promise，解析为包含派生密钥的 `Uint8Array`。

---

### `scrypt_hex(key, salt, N, r, p, dklen, onprogress)`

执行 scrypt 密钥派生函数。

- **参数**：
  - `key`: `string` - 输入密钥，字符串会自动编码。
  - `salt`: `string` - 盐值，字符串会自动编码。
  - `N`: `number` - scrypt 参数 N。
  - `r`: `number` - scrypt 参数 r。
  - `p`: `number` - scrypt 参数 p。
  - `dklen`: `number` - 所需密钥长度。
  - `onprogress`: `(progress: number) => void` (可选) - 进度回调。
- **返回值**：一个 Promise，解析为包含派生密钥的十六进制字符串。

---

## 未文档的 API

```ts
export function hexlify(data: Uint8Array): string;
export function unhexlify(hexStr: string): Uint8Array;
export function str_encode(input: string, encoding: 'utf-8'): Uint8Array;
export function str_decode(input: Uint8Array | ArrayBuffer, encoding: 'utf-8'): string;
export function get_random_bytes(count: number): Uint8Array;
export function get_random_int8_number(): number;
export function get_random_uint8_number(): number;
```

