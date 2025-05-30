// Base Exception Class.
export class LibraryError extends Error {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Library Error', additional = undefined) {
        super(message, additional);
        this.name = 'LibraryError';
    }
}

/**
 * @param {any} error
 * @returns {never}
 */
export function raise(error) {
    throw error; 
}

// Level 1

export class EncryptionError extends LibraryError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Encryption Error', additional = undefined) {
        super(message, additional);
        this.name = 'EncryptionError';
    }
}

export class NetworkError extends LibraryError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(Network Error)', additional = undefined) {
        super(message, additional);
        this.name = 'NetworkError';
    }
}

// Level 2

export class ExpectedError extends EncryptionError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(Expected Error)', additional = undefined) {
        super(message, additional);
        this.name = 'ExpectedError';
    }
}

export class RuntimeException extends EncryptionError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(Runtime Error)', additional = undefined) {
        super(message, additional);
        this.name = 'RuntimeException';
    }
}

export class UnexpectedError extends RuntimeException {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(Unexpected Error)', additional = undefined) {
        super(message, additional);
        this.name = 'UnexpectedError';
    }
}

export class InternalError extends UnexpectedError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(Internal Error)', additional = undefined) {
        super(message, additional);
        this.name = 'InternalError';
    }
}

export class InputError extends RuntimeException {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(Input Error)', additional = undefined) {
        super(message, additional);
        this.name = 'InputError';
    }
}

export class ParameterError extends InputError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(Data Error)', additional = undefined) {
        super(message, additional);
        this.name = 'ParameterError';
    }
}

export class DataError extends InputError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(Data Error)', additional = undefined) {
        super(message, additional);
        this.name = 'DataError';
    }
}

export class UserException extends RuntimeException {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(The end user has a fault that caused the exception. This is not code bug.)', additional = undefined) {
        super(message, additional);
        this.name = 'UserException';
    }
}

// Level 3

export class VersionSystemError extends DataError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = '(Version System Error)', additional = undefined) {
        super(message, additional);
        this.name = 'VersionSystemError';
    }
}

// Level 4 -- Detailed Errors

export class InvalidParameterException extends ParameterError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'The parameter provided is invalid.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidParameterException';
    }
}

export class BadDataException extends DataError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'The data is bad.', additional = undefined) {
        super(message, additional);
        this.name = 'BadDataException';
    }
}

export class InvalidScryptParameterException extends ParameterError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'The N, r, or p is not valid or out of range.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidScryptParameterException';
    }
}

export class EncryptionVersionMismatchException extends VersionSystemError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'The version of the encryption library doesn\'t match.', additional = undefined) {
        super(message, additional);
        this.name = 'EncryptionVersionMismatchException';
    }
}

export class InvalidFileFormatException extends DataError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'The file format is invalid.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidFileFormatException';
    }
}

export class IVException extends InternalError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'IV Exception.', additional = undefined) {
        super(message, additional);
        this.name = 'IVException';
    }
}

export class FileCorruptedException extends DataError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'File is corrupted.', additional = undefined) {
        super(message, additional);
        this.name = 'FileCorruptedException';
    }
}

export class InvalidEndMarkerException extends DataError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'The end marker is invalid.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidEndMarkerException';
    }
}

export class CannotDecryptException extends UserException {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Cannot decrypt', additional = undefined) {
        super(message, additional);
        this.name = 'CannotDecryptException';
    }
}

export class UnexpectedFailureInChunkDecryptionException extends UnexpectedError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'An unexpected failure occurred while decrypting the chunk. The file may be corrupted.', additional = undefined) {
        super(message, additional);
        this.name = 'UnexpectedFailureInChunkDecryptionException';
    }
}

export class CryptContextReusedException extends ParameterError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Not allowed to reuse a crypt context.', additional = undefined) {
        super(message, additional);
        this.name = 'CryptContextReusedException';
    }
}

export class NotSupportedException extends InputError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Operation not supported', additional = undefined) {
        super(message, additional);
        this.name = 'NotSupportedException';
    }
}

export class DeprecationException extends InputError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Trying to use a deprecated feature.', additional = undefined) {
        super(message, additional);
        this.name = 'DeprecationException';
    }
}

/**
 * @deprecated No longer use exceptions to change control flow. Now we return empty blob with {eof: true} to indicate the end of file.
 */
export class EndOfFileException extends ExpectedError {
    constructor(message = 'End of File', additional = undefined) {
        super(message, additional);
        this.name = 'EndOfFileException';
        // @ts-ignore
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'production') return;
        globalThis.console.warn('%c[npm::simple-data-crypto] %c[EndOfFileException] %cDEPRECATED!! %cDeprecated and will be removed in the next MAJOR version. See %csrc/exceptions.js%c for more information.\n' +
            '%cNote: %cThis %cdoes not%c indicate the package is deprecated. Instead, it indicates that your code uses the %cdeprecated%c class %cEndOfFileException%c. Fix your code to suppress this warning.',
            'color: #007700', 'color: #570263', 'color: red; font-weight: bold;', '', 'font-weight: bold;', '', 'font-weight: bold; color: #0000ff', '',
            'color: red; font-weight: bold;', '', 'font-style: italic', '', 'color: #570263', '');
    }
}

export class CryptContextNotInitedException extends ParameterError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Crypt context is not initialized.', additional = undefined) {
        super(message, additional);
        this.name = 'CryptContextNotInitedException';
    }
}

export class InvalidCryptContextTypeException extends ParameterError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Invalid crypt context type.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidCryptContextTypeException';
    }
}

export class CryptContextReleasedException extends ParameterError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Crypt context has been released.', additional = undefined) {
        super(message, additional);
        this.name = 'CryptContextReleasedException';
    }
}

export class OperationNotPermittedException extends ParameterError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'Operation not permitted.', additional = undefined) {
        super(message, additional);
        this.name = 'OperationNotPermittedException';
    }
}

export class EncryptionAlgorithmNotSupportedException extends DataError {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'The specified encryption algorithm is not supported.', additional = undefined) {
        super(message, additional);
        this.name = 'EncryptionAlgorithmNotSupportedException';
    }
}

export class ChaCha20NotSupportedException extends EncryptionAlgorithmNotSupportedException {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'ChaCha20 is not supported yet.', additional = undefined) {
        super(message, additional);
        this.name = 'ChaCha20NotSupportedException';
    }
}

export class DangerousEncryptionAlgorithmException extends EncryptionAlgorithmNotSupportedException {
    /**
     * @param {string} message 
     * @param {Object} [additional] 
     */
    constructor(message = 'The specified encryption algorithm is DANGEROUS.', additional = undefined) {
        super(message, additional);
        this.name = 'DangerousEncryptionAlgorithmException';
    }
}
