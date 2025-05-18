[中文版](./api-docs.zh-CN.md)

# JavaScript API Docs

# API List

See [the d.ts file](../../impl/JavaScript/lib/dist/main.bundle.d.ts) for more details.

## Recent Breaking Changes

[>=1.5.0] The `Stream` was renamed to `InputStream`. There is no API change, just a re-naming.

## Core Functions

Most of situations you just use these functions

### `encrypt_data(message, key, phrase = null, N = null)`

Encrypts a string or Uint8Array.

- **Parameters**:
  - `message`: `string | Uint8Array` - The message to encrypt.
  - `key`: `string` - Encryption key.
  - `phrase`: `string` (optional) - Optional passphrase.
  - `N`: `number` (optional) - scrypt parameter N.
- **Returns**: `string` - The encrypted message.

---

### `decrypt_data(message_encrypted, key)`

Decrypts an encrypted string.

- **Parameters**:
  - `message_encrypted`: `string` - The encrypted message.
  - `key`: `string` - Decryption key.
- **Returns**: `string | ArrayBuffer` - The decrypted message.

---

### `encrypt_file(file_reader, file_writer, user_key, callback = null, phrase = null, N = null, chunk_size = 32 * 1024 * 1024)`

Encrypts a file asynchronously.

- **Parameters**:
  - `file_reader`: `(start: number, end: number) => Promise<Uint8Array>` - File reader function.
  - `file_writer`: `(data: Uint8Array) => Promise<void> | void` - File writer function.
  - `user_key`: `string` - User key.
  - `callback`: `(progress: number, total: number) => void` (optional) - Progress callback.
  - `phrase`: `string | null` (optional) - Optional passphrase.
  - `N`: `number | null` (optional) - scrypt parameter N.
  - `chunk_size`: `number` (optional) - Chunk size in bytes (default: 32MiB).
- **Returns**: `Promise<boolean>` - Whether the encryption was successful.

---

### `decrypt_file(file_reader, file_writer, user_key, callback = null)`

Decrypts a file asynchronously.

- **Parameters**:
  - `file_reader`: `(start: number, end: number) => Promise<Uint8Array>` - File reader function.
  - `file_writer`: `(data: Uint8Array) => Promise<void> | void` - File writer function.
  - `user_key`: `string` - User decryption key.
  - `callback`: `(progress: number, total: number) => void` (optional) - Progress callback.
- **Returns**: `Promise<boolean>` - Whether the decryption was successful.

---

### `is_encrypted_file(file_reader)`

Checks if a file is encrypted.

- **Parameters**:
  - `file_reader`: `(start: number, end: number) => Promise<Uint8Array>` - File reader function.
- **Returns**: `Promise<boolean>` - Whether the file is encrypted.

---

### `is_encrypted_message(message)`

Checks if a message is encrypted.

- **Parameters**:
  - `message`: `string` - The message to check.
- **Returns**: `boolean` - Whether the message is encrypted.

---

### `export_master_key(file_head, current_key, export_key)`

Exports the file's master key.

- **Parameters**:
  - `file_head`: `Blob` - File header (recommended size: 5KB).
  - `current_key`: `string` - Current file password.
  - `export_key`: `string` - Password to protect the master key.
- **Returns**: `Promise<string>` - The exported key.

---

### `change_file_password(file_head, current_key, new_key)`

Changes the password of an encrypted file.

- **Parameters**:
  - `file_head`: `Blob` - File header (recommended size: 5KB).
  - `current_key`: `string` - Current file password.
  - `new_key`: `string` - New password.
- **Returns**: `Promise<Blob>` - The new file header.

* Note: It is not recommended to change the password in a web browser. Due to the way browsers handle file writing (https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable):
* Any changes made through a writable stream will not be reflected in the file represented by the file handle until the stream is closed. This is typically implemented by writing data to a temporary file and then replacing the file handle's file with the temporary file once the stream is closed.
* This means the old password will always remain on disk, potentially leading to sensitive data leakage.
* Additionally, due to this behavior, operations on large files can become extremely slow.
* Therefore, unless in special circumstances, always use a native application to modify file passwords.

## Context management

For most situations, context is not necessary. Currently only stream decryption requires context.

### async `crypt_context_create()`

Creates a new cryptographic context.

- **Returns**: `Promise<CryptContext>`.

---

### async `crypt_context_destroy(ctx)`

Destroys a cryptographic context.

- **Parameters**:
  - `ctx`: `CryptContext` - The context to destroy.
- **Returns**: `Promise<true>`.

## Streamed decryption

### `decrypt_stream_init(ctx, stream, password, options)`

Prepares for stream decryption.

- **Parameters**:
  - `ctx`: `CryptContext` - Decryption context.
  - `stream`: `InputStream` - The stream to decrypt.
  - `password`: `string` - Decryption password.
  - `options`: `DecryptStreamInitOptions` (optional) - Initialization options.
- **Returns**: `Promise<void>`.

---

### `decrypt_stream(ctx, bytes_start, bytes_end, abort)`

Decrypts a portion of a stream.

- **Parameters**:
  - `ctx`: `CryptContext` - Decryption context.
  - `bytes_start`: `number` - Start byte.
  - `bytes_end`: `number` - End byte.
  - `abort`: `AbortController` (optional) - Abort controller for canceling the operation.
- **Returns**: `Promise<Blob>` - The decrypted data as a Blob.

---

### `InputStream`

Represents a data stream.

- **Constructor**:
  - `InputStream(reader, size)`
    - `reader`: `(start: number, end: number, signal: AbortSignal) => Promise<Uint8Array>` - Reader function.
    - `size`: `number` - InputStream size.
- **Methods**:
  - `read(start, end, suggestion_end = null, abort = null)`: Reads a portion of the stream.
  - `abort()`: Aborts the stream.
  - `purge()`: Purges the stream.
  - `close()`: Closes the stream.
- **Properties**:
  - `size`: `number | null` - The size of the stream.

## Internal API (for advanced users)

### `derive_key(key, iv, phrase = null, N = null, salt = null, r, p, dklen)`

Derives a key using the scrypt algorithm.

- **Parameters**:
  - `key`: `string | Uint8Array` - The input key.
  - `iv`: `Uint8Array` - Initialization vector.
  - `phrase`: `string | null` (optional) - Optional passphrase.
  - `N`: `number | null` (optional) - scrypt parameter N.
  - `salt`: `Uint8Array | null` (optional) - Salt value.
  - `r`: `number` - scrypt parameter r.
  - `p`: `number` - scrypt parameter p.
  - `dklen`: `number` - Desired key length.
- **Returns**: A promise resolving to an object containing:
  - `derived_key`: `Uint8Array` - The derived key.
  - `parameter`: `string` - Parameter string.
  - `N`: `number` - scrypt parameter N.

---

### `scrypt(key, salt, N, r, p, dklen, onprogress)`

Performs the scrypt key derivation function.

- **Parameters**:
  - `key`: `Uint8Array` - Input key.
  - `salt`: `Uint8Array` - Salt value.
  - `N`: `number` - scrypt parameter N.
  - `r`: `number` - scrypt parameter r.
  - `p`: `number` - scrypt parameter p.
  - `dklen`: `number` - Desired key length.
  - `onprogress`: `(progress: number) => void` (optional) - Progress callback.
- **Returns**: A promise resolving to a `Uint8Array` containing the derived key.

---

### `scrypt_hex(key, salt, N, r, p, dklen, onprogress)`

Performs the scrypt key derivation function.

- **Parameters**:
  - `key`: `string` - Input key. The string is automatically encoded.
  - `salt`: `string` - Salt value. The string is automatically encoded.
  - `N`: `number` - scrypt parameter N.
  - `r`: `number` - scrypt parameter r.
  - `p`: `number` - scrypt parameter p.
  - `dklen`: `number` - Desired key length.
  - `onprogress`: `(progress: number) => void` (optional) - Progress callback.
- **Returns**: A promise resolving to a hex string containing the derived key.

---

### `Internals` object

Provides a series of exported functions for accessing internal implementation information. Advanced users can refer to the [implementation](../../impl/JavaScript/lib/src/internal-util.js) for more details. These sections are not documented.

---

## Undocumented APIs

```ts
export function hexlify(data: Uint8Array): string;
export function unhexlify(hexStr: string): Uint8Array;
export function str_encode(input: string, encoding: 'utf-8'): Uint8Array;
export function str_decode(input: Uint8Array | ArrayBuffer, encoding: 'utf-8'): string;
export function get_random_bytes(count: number): Uint8Array;
export function get_random_int8_number(): number;
export function get_random_uint8_number(): number;

```
