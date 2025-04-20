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
    const decrypted_key = await decrypt_data(ekey_ciphertext, current_key);
    const exported = await encrypt_data(decrypted_key, export_key);

    return exported;
}


// TODO: Change file password (very complex! in js)