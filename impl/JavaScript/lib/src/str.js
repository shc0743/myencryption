/**
 * @param {string} input
 */
export function str_encode(input, encoding = "utf-8") {
    if (typeof input !== "string") {
        throw new TypeError("Input must be a string");
    }
    if (encoding.toLowerCase() !== "utf-8") {
        throw new Error("Only 'utf-8' encoding is supported");
    }
    return new TextEncoder().encode(input);
}
/**
 * @param {Uint8Array|ArrayBuffer} input
 */
export function str_decode(input, encoding = "utf-8") {
    if (!(input instanceof Uint8Array)) {
        input = new Uint8Array(input);
    }
    if (encoding.toLowerCase() !== "utf-8") {
        throw new Error("Only 'utf-8' encoding is supported");
    }
    return new TextDecoder().decode(input);
}