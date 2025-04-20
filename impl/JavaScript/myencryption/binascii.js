export function hexlify(data) {
    if (!data || !(data instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array");
    }
    return Array.from(data)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

export function unhexlify(hexStr) {
    if (typeof hexStr !== 'string') {
        throw new TypeError("Input must be a string");
    }
    if (hexStr.length % 2 !== 0) {
        throw new TypeError("Hex string must have even length");
    }
    if (!/^[0-9a-fA-F]*$/.test(hexStr)) {
        throw new TypeError("Hex string contains invalid characters");
    }

    const bytes = new Uint8Array(hexStr.length / 2);
    for (let i = 0; i < hexStr.length; i += 2) {
        bytes[i / 2] = parseInt(hexStr.substring(i, i + 2), 16);
    }
    return bytes;
}