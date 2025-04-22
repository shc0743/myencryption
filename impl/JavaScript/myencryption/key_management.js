import { str_encode, str_decode } from "./str.js";
import { encrypt_data, decrypt_data } from "./encrypt_data.js";


/**
 * Export the file's master key.
 * @param {Blob} file_head File header. Recommended to provide 2KB. At least provide 1044 bytes.
 * @param {String} current_key current file password
 * @param {String} export_key The password to protect the master key
 * @returns String exported key
 */
export async function export_master_key(file_head, current_key, export_key) {
    if (file_head.size < (1024 + 16 + 4)) throw new Error('Data not enough');

    // Verify file header
    const headerBlob = file_head.slice(0, 16);
    const header = await headerBlob.text();
    if (header !== "MyEncryption/1.1") {
        throw new TypeError("Invalid file format");
    }

    // Read encrypted master key length and ciphertext
    const ekey_len = new DataView(await file_head.slice(16, 20).arrayBuffer()).getUint32(0, true);
    const buffer = await file_head.slice(20, 20 + ekey_len).arrayBuffer();
    const ekey_ciphertext = str_decode(buffer);

    // Decrypt master key with current_key and re-encrypt with export_key
    return await encrypt_data(await decrypt_data(ekey_ciphertext, current_key));
}



/**
 * Change file password
 * note: 不建议在web端更改密码。由于浏览器写入文件的工作原理（https://developer.mozilla.org/zh-CN/docs/Web/API/FileSystemFileHandle/createWritable ）
 * 任何通过写入流造成的更改在写入流被关闭前都不会反映到文件句柄所代表的文件上。这通常是将数据写入到一个临时文件来实现的，然后只有在写入文件流被关闭后才会用临时文件替换掉文件句柄所代表的文件。
 * 也就是说，旧密码将始终存在于磁盘上。这将导致敏感数据泄露。
 * 另外，由于这个特性，大文件相关操作会变得非常非常慢。
 * 所以，除非特殊情况，务必始终使用 native 应用程序来修改文件密码
 * @param {Blob} file_head File header. Recommended to provide 2KB. At least provide 1044 bytes.
 * @param {String} current_key current file password
 * @param {String} new_key The new password
 * @returns Blob The new file header. Note that the size of the new header differs from the original file. Do not use it to construct a new file. Instead, overwrite the original file header directly with the new header without offsetting the file.  
 * @throws {Error} If the file header is invalid or the file size is not enough.
 */
export async function change_file_password(file_head, current_key, new_key) {
    if (file_head.size < (1024 + 16 + 4)) throw new Error('Data not enough');

    // Verify file header
    const headerBlob = file_head.slice(0, 16);
    const header = await headerBlob.text();
    if (header !== "MyEncryption/1.1") {
        throw new TypeError("Invalid file format");
    }

    // Read encrypted master key length and ciphertext
    const ekey_len = new DataView(await file_head.slice(16, 20).arrayBuffer()).getUint32(0, true);
    const ekey_ciphertext = str_decode(await file_head.slice(20, 20 + ekey_len).arrayBuffer());

    // Decrypt master key with current_key and re-encrypt with export_key
    const new_ekey = await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), new_key);
    // Check length
    if (new_ekey.length > 1024) {
        throw new Error("(Internal Error) This should not happen. Contact the application developer.");
    }
    const new_ekey_len = new_ekey.length;
    const new_ekey_len_bytes = new ArrayBuffer(4);
    const new_ekey_len_view = new DataView(new_ekey_len_bytes);
    new_ekey_len_view.setUint32(0, new_ekey_len, true);

    const new_ekey_parts = [headerBlob, new_ekey_len_bytes, str_encode(new_ekey)];
    const padding = new Uint8Array(1024 - new_ekey.length).fill(0);
    new_ekey_parts.push(padding);

    return new Blob(new_ekey_parts);
}