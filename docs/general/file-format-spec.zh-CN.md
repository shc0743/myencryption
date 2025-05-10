[English edition](./file-format-spec.md)

# 文件格式规范 (1.2) (当前版本)

文件结构如下：

1. **文件头 (20字节)**:
   - 16字节：字符串 `MyEncryption/1.2`，用于标识文件格式和版本
   - 4字节：版本标记（小端序uint32，值`10020`）

2. **加密主密钥 (4096字节)**:
   - 4字节：加密主密钥长度（小端序，uint32）
   - 可变长度：加密的主密钥
   - 用零填充至4096字节（包含长度和密钥）

3. **头部JSON**:
   - 4字节：JSON元数据长度（小端序，uint32）
   - 可变长度：包含以下参数的JSON元数据：
     - `parameter`：密钥派生参数
     - `N`：迭代次数
     - `v`：版本号（5.5）
     - `iv`：密钥派生的初始化向量（十六进制编码）
     - `a`: 加密算法 （目前固定为`AES-GCM`，以后可能修改）。此字段可能不存在。
   - 头部JSON不可变
   - 要更改主密钥，用户需解密后重新加密

4. **数据块大小参数**:
   - 8字节：数据块大小（字节单位，小端序uint64）。除最后一块外，所有数据块大小相同

5. **初始Nonce计数器**:
   - 8字节：起始nonce计数器值（小端序uint64）

6. **加密数据块**:
   - 每个数据块包含：
     - 仅最后一块包含：
       - 32字节：尾部块标记（特定字节模式）`TAIL_BLOCK_MARKER`
       - 8字节：最后一块的长度（小端序uint64）
     - 加密数据（与原始数据等长，由AES-GCM保证）
     - 16字节：认证标签（由AES-GCM自动追加）
   - 每个数据块使用从nonce计数器派生的唯一IV

7. **文件尾**:
   - 32字节：结束标记（特定字节模式）`END_MARKER`
   - 8字节：原始文件总字节数（小端序uint64）
   - 10字节：最终标记（0x55, 0xAA）`FILE_END_MARKER`

注意事项：
- 所有数值均以小端序格式存储
- nonce计数器为每个数据块递增以确保唯一IV

## 技术信息

JS实现：[encrypt_file.js](../../impl/JavaScript/myencryption/encrypt_file.js)

```js
export const PADDING_SIZE = 4096;
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

export const ENCRYPTION_FILE_VER_1_1_0 = normalize_version('1.1');
export const ENCRYPTION_FILE_VER_1_2_10020 = normalize_version('1.2', 10020);
```

---

以下内容已过时且不再维护

---

# 文件格式 (1.1)

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