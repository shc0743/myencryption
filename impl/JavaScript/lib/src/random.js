/**
 * @param {number} count
 */
export function get_random_bytes(count) {
    const randomBytes = new Uint8Array(count);
    crypto.getRandomValues(randomBytes);
    return randomBytes;
}
export function get_random_int8_number() {
    const randomBytes = get_random_bytes(1);
    return new Int8Array(randomBytes)[0];
}
export function get_random_uint8_number() {
    const randomBytes = get_random_bytes(1);
    return new Uint8Array(randomBytes)[0];
}