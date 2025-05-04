const hexTable = new Array(256);
for (let i = 0; i < 256; i++) {
    hexTable[i] = i.toString(16).padStart(2, '0');
}

/**
 * @param {Uint8Array} data
 * @returns {string}
 */
export function hexlify(data) {
    if (!data || !(data instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array");
    }
    const length = data.length;
    const arr = new Array(length);
    for (let i = 0; i < length; i++) {
        arr[i] = hexTable[data[i]];
    }
    return arr.join('');
}

const throwing = {
    get InvalidHexStringException() {
        throw new TypeError('Invalid hex string');
    },
}

/**
 * @param {string} hexStr
 * @returns {Uint8Array}
 */
export function unhexlify(hexStr) {
    if (typeof hexStr !== 'string') {
        throw new TypeError("Input must be a string");
    }
    const length = hexStr.length;
    if (length % 2 !== 0) {
        throw new TypeError("Hex string must have even length");
    }
    hexStr = hexStr.toLowerCase();
    const bytes = new Uint8Array(length >> 1);
    for (let i = 0; i < length; i += 2) {
        const highCode = hexStr.charCodeAt(i);
        const lowCode = hexStr.charCodeAt(i + 1);

        const high = highCode >= 97 && highCode <= 102 ? highCode - 87 :
            highCode >= 48 && highCode <= 57 ? highCode - 48 : throwing.InvalidHexStringException;
        const low = lowCode >= 97 && lowCode <= 102 ? lowCode - 87 :
            lowCode >= 48 && lowCode <= 57 ? lowCode - 48 : throwing.InvalidHexStringException;

        // @ts-ignore
        bytes[i >> 1] = (high << 4) | low;
    }
    return bytes;
}