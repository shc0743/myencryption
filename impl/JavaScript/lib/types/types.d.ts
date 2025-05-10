import * as Exceptions from '../src/exceptions.js';

declare module "simple-data-crypto" {
    export function derive_key(
        key: string,
        iv: Uint8Array,
        phrase?: string | null,
        N?: number | null,
        salt?: Uint8Array | null,
        r?: number,
        p?: number,
        dklen?: number
    ): Promise<{
        derived_key: Uint8Array;
        parameter: string;
        N: number;
    }> & {
        throws:
        | Exceptions.InvalidScryptParameterException
        | Exceptions.InvalidParameterException;
    };
    export function scrypt(
        key: Uint8Array,
        salt: Uint8Array,
        N: number,
        r: number,
        p: number,
        dklen: number,
        onprogress?: (progress: number) => void
    ): Promise<Uint8Array>;
    export function scrypt_hex(
        key: string,
        salt: string,
        N: number,
        r: number,
        p: number,
        dklen: number,
        onprogress?: (progress: number) => void
    ): Promise<string>;
    export function hexlify(data: Uint8Array): string & { throws: | TypeError };
    export function unhexlify(hexStr: string): Uint8Array & { throws: | TypeError };
    export function str_encode(input: string, encoding: 'utf-8'): Uint8Array & { throws: | TypeError | Error };
    export function str_decode(input: Uint8Array | ArrayBuffer, encoding: 'utf-8'): string & { throws: | Error };
    export function get_random_bytes(count: number): Uint8Array;
    export function get_random_int8_number(): number;
    export function get_random_uint8_number(): number;
        
    /**
     * Encrypt data.
     * @param message The plaintext.
     * @param key The key to encrypt the message. Must be a string.
     * @param phrase The `phrase` in `parameter`. Can be an empty string. 
     * @param N The scrypt parameter N. Defaults to 262144.
     * @returns The encrypted message.
     */
    export function encrypt_data(
        message: string, key: string, phrase?: string, N?: number
    ): Promise<string> & {
        throws:
        | Exceptions.InvalidScryptParameterException
        | Exceptions.InvalidParameterException
    };
    /**
     * Decrypt data.
     * @param message_encrypted The ciphertext.
     * @param key The key to decrypt the message. If provided as string, it will be automatically derived. If as Uint8Array, it will *not* be derived.
     * @returns The decrypted message.
     */
    export function decrypt_data(
        message_encrypted: string, key: string | Uint8Array
    ): Promise<string> & {
        throws:
        | Exceptions.InvalidParameterException
        | Exceptions.BadDataException
        | Exceptions.InternalError
        | Exceptions.CannotDecryptException
    }
    
    type FileReader = (start: number, end: number) => Promise<Uint8Array>;
    type FileWriter = (data: Uint8Array) => Promise<void> | void;
    type ProgressCallback = (progress: number, total: number) => void;

    /**
     * Encrypt file
     * @param file_reader - File reader object, should implement (start, end) => Promise<Uint8Array>
     * @param file_writer - File writer object, should implement write(Uint8Array) method
     * @param user_key - User key
     * @param callback - Progress callback function
     * @param phrase - Optional phrase for key derivation
     * @param N - scrypt parameter N
     * @param chunk_size - Chunk size, defaults to 32MiB
     * @returns Returns whether encryption was successful or not
     */
    export function encrypt_file(
        file_reader: FileReader,
        file_writer: FileWriter,
        user_key: string,
        callback?: ProgressCallback | null,
        phrase?: string | null,
        N?: number | null,
        chunk_size?: number
    ): Promise<boolean> & {
        throws: 
        | Exceptions.InvalidParameterException
        | Exceptions.InternalError
        | Exceptions.BadDataException
        | Exceptions.IVException
    }

    /**
     * Decrypt file
     * @param file_reader - File reader object, should implement (start, end) => Promise<Uint8Array>
     * @param file_writer - File writer object, should implement write(Uint8Array) method
     * @param user_key - User decryption key. If provided as string, it will be automatically derived. If as Uint8Array, it will *not* be derived.
     * @param callback - Progress callback function
     * @returns Returns whether decryption was successful or not
     */
    export function decrypt_file(
        file_reader: FileReader,
        file_writer: FileWriter,
        user_key: string | Uint8Array,
        callback?: ProgressCallback | null
    ): Promise<boolean> & {
        throws:
        | TypeError
        | Exceptions.FileCorruptedException
        | Exceptions.InvalidEndMarkerException
        | Exceptions.InvalidFileFormatException
        | Exceptions.EncryptionVersionMismatchException
        | Exceptions.InternalError
        | Exceptions.InvalidParameterException
        | Exceptions.CannotDecryptException
    };

    /**
     * Export the file's master key.
     * @param {Blob} file_head File header. Recommended to provide 5KB.
     * @param {String} current_key current file password
     * @param {String} export_key The password to protect the master key
     * @returns String exported key
     */
    export function export_master_key(
        file_head: Blob,
        current_key: string,
        export_key: string
    ): Promise<string> & {
        throws: 
        | Exceptions.BadDataException
        | Exceptions.InvalidFileFormatException
        | Exceptions.EncryptionVersionMismatchException
    };

    /**
     * Change file password
     * Note: It is not recommended to change passwords in web environments. Due to how browsers write files
     * (https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable),
     * any changes made through write streams are not reflected in the file represented by the file handle
     * until the write stream is closed. This is typically implemented by writing to a temporary file,
     * which only replaces the original file after the write stream is closed.
     * This means the old password will always exist on disk, potentially leading to sensitive data leaks.
     * Additionally, due to this behavior, operations on large files become extremely slow.
     * Therefore, unless under special circumstances, always use native applications to modify file passwords.
     * @param {Blob} file_head File header. Recommended to provide 5KB.
     * @param {String} current_key current file password
     * @param {String} new_key The new password
     * @returns The new file header. Note that the size of the new header differs from the original file. Do not use it to construct a new file. Instead, overwrite the original file header directly with the new header without offsetting the file.  
     */
    export function change_file_password(
        file_head: Blob,
        current_key: string,
        new_key: string
    ): Promise<Blob> & {
        throws:
        | Error
        | TypeError
        | Exceptions.InvalidFileFormatException
        | Exceptions.EncryptionVersionMismatchException;
    };
    
    export function normalize_version(major_version: string, version_marker: number | null): string;

    export interface CryptContext { };
    export function crypt_context_create() : Promise<CryptContext>;
    export function crypt_context_destroy(ctx: CryptContext): Promise<true> & {
        throws:
        | Error | Exceptions.InvalidParameterException
    };

    export interface DecryptStreamInitOptions {
        /**
         * Set if the cache is enabled.
         * @default true
         */
        cache?: boolean;
        /**
         * Set the maximium size of the cache.
         * @default 256 * 1024 * 1024
         */
        cache_max_size?: number;
    }

    /**
     * Prepare for a stream decryption.
     * @param ctx Context
     * @param stream The stream to decrypt.
     * @param password The password.
     * @param options Options.
     */
    export function decrypt_stream_init(
        ctx: CryptContext,
        stream: Stream,
        password: string,
        options?: DecryptStreamInitOptions
    ): Promise<true> & {
        throws:
        | Error
        | Exceptions.CryptContextReusedException
        | Exceptions.InvalidFileFormatException
        | Exceptions.EncryptionVersionMismatchException
        | Exceptions.NotSupportedException
        | Exceptions.InternalError
        | Exceptions.InvalidParameterException
    };

    /**
     * Decrypt a stream.
     * @param ctx Context
     * @param bytes_start The start byte to decrypt
     * @param bytes_end The end byte to decrypt
     * @param abort If provided, the operation will be cancelable.
     * @returns The decrypted data, stored in a Blob object.
     */
    export function decrypt_stream(
        ctx: CryptContext,
        bytes_start: number,
        bytes_end: number,
        abort?: AbortController,
    ): Promise<Blob> & {
        throws:
        | Error
        | Exceptions.CannotDecryptException
        | Exceptions.InvalidParameterException
        | Exceptions.CryptContextNotInitedException
        | Exceptions.InvalidCryptContextTypeException
        | Exceptions.CryptContextReleasedException
        | Exceptions.InternalError
    };
        
    export class Stream {
        constructor(
            reader: (start: number, end: number, signal: AbortSignal) => Promise<Uint8Array>,
            size: number
        );

        get size(): number;

        read(
            start: number,
            end: number,
            suggestion_end?: number | null,
            abort?: AbortController | null
        ): Promise<Uint8Array>;

        abort(): void;
        purge(): void;
        close(): void;

        [Symbol.toStringTag]: 'Stream';
    }
    export * as Exceptions from '../src/exceptions.js';
    export const VERSION: string;
    export const ENCRYPTION_FILE_VER_1_1_0: string;
    export const ENCRYPTION_FILE_VER_1_2_10020: string;

    export declare const Internals: {
        PADDING_SIZE: number;
        END_IDENTIFIER: number[];
        TAIL_BLOCK_MARKER: number[];
        END_MARKER: number[];
        FILE_END_MARKER: number[];
        nextTick: () => Promise<void>;
        GetFileVersion: (file_reader: (start: number, end: number) => Promise<Uint8Array>) => Promise<string>;
        GetFileChunkSize: (file_reader: (start: number, end: number) => Promise<Uint8Array>) => Promise<number>;
    };
}

