import { derive_key, scrypt, scrypt_hex } from "./derive_key.js";
import { encrypt_data, decrypt_data } from "./encrypt_data.js";
import { encrypt_file, decrypt_file, normalize_version, ENCRYPTION_FILE_VER_1_1_0, ENCRYPTION_FILE_VER_1_2_10020 } from "./encrypt_file.js";
import { export_master_key, change_file_password } from "./key_management.js";
import { crypt_context_create, crypt_context_destroy } from "./context.js";
import { Stream, decrypt_stream_init, decrypt_stream } from "./stream.js";
import { hexlify, unhexlify } from "./binascii.js";
import { get_random_bytes, get_random_int8_number, get_random_uint8_number } from "./random.js";
import { str_encode, str_decode } from "./str.js";
import * as Exceptions from './exceptions.js';
import { VERSION } from "./version.js";

export {
    derive_key,
    scrypt,
    scrypt_hex,
    encrypt_data,
    decrypt_data,
    encrypt_file,
    decrypt_file,
    export_master_key,
    change_file_password,
    normalize_version,
    crypt_context_create,
    crypt_context_destroy,
    decrypt_stream_init,
    decrypt_stream,
    hexlify,
    unhexlify,
    str_encode,
    str_decode,
    get_random_bytes,
    get_random_int8_number,
    get_random_uint8_number,
    Stream,
    Exceptions,
    VERSION,
    ENCRYPTION_FILE_VER_1_1_0,
    ENCRYPTION_FILE_VER_1_2_10020,
};