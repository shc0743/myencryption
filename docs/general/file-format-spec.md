[中文版](./file-format-spec.zh-CN.md)

# File Format Specification (1.2) (current)

The file format is structured as follows:

1. **File Header (20 bytes)**:
   - 16 bytes: Magic string `MyEncryption/1.2` to identify the file format and version.
   - 4 bytes: Version marker (little-endian uint32, value 10020).

2. **Encrypted Primary Key (4096 bytes)**:
   - 4 bytes: Length of the encrypted primary key (little-endian uint32).
   - Variable length: Encrypted primary key.
   - Padding with zeros to fill 4096 bytes, including both the length and the key.

3. **Header JSON**:
   - 4 bytes: Length of the JSON metadata (little-endian uint32).
   - Variable length: JSON metadata containing parameters like:
     - `parameter`: Key derivation parameter
     - `N`: Iteration count
     - `v`: Version number (5.5)
     - `iv`: Initialization vector for key derivation (hex encoded)
     - `a`: Algorithm used for encryption (`AES-GCM`). This field may not exist.
    - Header JSON is **not** variable.
    - To change the primary key, the user has to decrypt and re-encrypt.

4. **Chunk Size Parameter**:
   - 8 bytes: Chunk size in bytes (little-endian uint64). Every chunk's size is equal, except the final chunk.

5. **Initial Nonce Counter**:
   - 8 bytes: Starting nonce counter value (little-endian uint64).

6. **Encrypted Data Blocks**:
   - Each block contains:
     - For final chunk only:
       - 32 bytes: Tail block marker (specific byte pattern) `TAIL_BLOCK_MARKER`
       - 8 bytes: The final chunk's length (little-endian uint64)
     - Encrypted data (same length as original, thanks to the AES-GCM)
     - 16 bytes: Authentication tag (automatically appended by AES-GCM)
   - Each block uses unique IV derived from nonce counter.

7. **Footer**:
   - 32 bytes: End marker (specific byte pattern). `END_MARKER`
   - 8 bytes: Total bytes of the original file (little-endian uint64).
   - 10 bytes: Final marker (0x55, 0xAA). `FILE_END_MARKER`

Notes:
- All numeric values are stored in little-endian format.
- The nonce counter increments for each data block to ensure unique IVs.

## Tech information

JS: [encrypt_file.js](../../impl/JavaScript/myencryption/encrypt_file.js)

```js
export const PADDING_SIZE = 4096; // 4096 bytes
export const END_IDENTIFIER = [
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
];
export const TAIL_BLOCK_MARKER = [
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55,
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55,
];
export const END_MARKER = [
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA,
];
export const FILE_END_MARKER = [0xFF, 0xFD, 0xF0, 0x10, 0x13, 0xD0, 0x12, 0x18, 0x55, 0xAA];

// versions
export const ENCRYPTION_FILE_VER_1_1_0 = normalize_version('1.1');
export const ENCRYPTION_FILE_VER_1_2_10020 = normalize_version('1.2', 10020);
```

---

The following contents are out-dated and will **not** be maintained anymore.

---

# File Format Specification (1.1)

The file format is structured as follows:

1. **Header (16 bytes)**: Contains the string `MyEncryption/1.1` to identify the file format and version.
2. **Encrypted Master Key (1024 bytes)**:
   - 4 bytes: Length of the encrypted master key.
   - Variable length: Encrypted master key.
   - Padding to fill 1024 bytes.
3. **Header JSON**:
   - 4 bytes: Length of the JSON metadata.
   - Variable length: JSON metadata containing parameters like `N`, `iv`, and `parameter`.
4. **Encrypted Data Blocks**:
   - Each block contains:
     - 8 bytes: Original data length.
     - 12 bytes: IV for the block.
     - Variable length: Encrypted data.
     - 16 bytes: Authentication tag.
5. **Footer**:
   - 8 bytes: End marker (`0xFF, 0xFD, 0xF0, 0x10, 0x13, 0xD0, 0x12, 0x18`).
   - 8 bytes: Total bytes of the original file.
   - 2 bytes: Final marker (`0x55, 0xAA`).
