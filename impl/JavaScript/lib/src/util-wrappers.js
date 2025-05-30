import { NetworkError } from "./exceptions.js";
import * as Exceptions from './exceptions.js';


/**
 * Create a file reader for local file.
 * @param {Blob} file The file handle. Can also be a File object from <input type="file">.
 * @returns the file_reader.
 */
export async function createReaderForLocalFile(file) {
    return async (/** @type {number} */ start, /** @type {number} */ end) => {
        return new Uint8Array(await file.slice(start, end).arrayBuffer());
    };
}

/**
 * Create a file reader for FileSystemFileHandle.
 * @param {FileSystemFileHandle} fileSystemHandle The file handle. Can only be a FileSystemFileHandle (using File System Access API like `window.showOpenFilePicker`)
 */
export async function createReaderForFileSystemHandle(fileSystemHandle) {
    const file = await fileSystemHandle.getFile();
    return await createReaderForLocalFile(file);
}


/**
 * Create a file reader for remote object.
 * This function will send a HTTP request to the server to get the file content.
 * @param {string} url
 */
export async function createReaderForRemoteObject(url) {
    return async (/** @type {number} */ start, /** @type {number} */ end) => {
        const resp = await fetch(url, {
            headers: { Range: `bytes=${start}-${end - 1}` }
        });
        if (!resp.ok) throw new NetworkError(`Network Error: HTTP ${resp.status} : ${resp.statusText}`, {
            response: resp
        });
        return new Uint8Array(await resp.arrayBuffer());
    };
}


/**
 * Create a file writer for FileSystemFileHandle.
 * @param {FileSystemFileHandle} fileSystemHandle The file handle. Can only be a FileSystemFileHandle (using File System Access API like `window.showOpenFilePicker`)
 * @deprecated This function is deprecated because it can't close the file handle. Please implement your own writer function. (It is simple!)
 */
export async function createWriterForFileSystemHandle(fileSystemHandle) {
    throw new Exceptions.DeprecationException();
}


/**
 * Create a file writer for memory buffer.
 * @param {Array} bufferOutput The buffer to store the output data.
 * @returns The writer function.
 */
export async function createWriterForMemoryBuffer(bufferOutput) {
    return async (/** @type {Uint8Array} */ data) => {
        bufferOutput.push(data);
    };
}
