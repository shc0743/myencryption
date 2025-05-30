// Base Exception Class.
export class LibraryError extends Error {
    constructor(message = 'Library Error', additional = undefined) {
        super(message, additional);
        this.name = 'LibraryError';
    }
}

// Level 1

export class EncryptionError extends LibraryError {
    constructor(message = 'Encryption Error', additional = undefined) {
        super(message, additional);
        this.name = 'EncryptionError';
    }
}

export class NetworkError extends LibraryError {
    constructor(message = '(Network Error)', additional = undefined) {
        super(message, additional);
        this.name = 'NetworkError';
    }
}

// Level 2

export class ExpectedError extends EncryptionError {
    constructor(message = '(Expected Error)', additional = undefined) {
        super(message, additional);
        this.name = 'ExpectedError';
    }
}

export class RuntimeException extends EncryptionError {
    constructor(message = '(Runtime Error)', additional = undefined) {
        super(message, additional);
        this.name = 'RuntimeException';
    }
}

export class UnexpectedError extends RuntimeException {
    constructor(message = '(Unexpected Error)', additional = undefined) {
        super(message, additional);
        this.name = 'UnexpectedError';
    }
}

export class InternalError extends UnexpectedError {
    constructor(message = '(Internal Error)', additional = undefined) {
        super(message, additional);
        this.name = 'InternalError';
    }
}

export class InputError extends RuntimeException {
    constructor(message = '(Input Error)', additional = undefined) {
        super(message, additional);
        this.name = 'InputError';
    }
}

export class ParameterError extends InputError {
    constructor(message = '(Data Error)', additional = undefined) {
        super(message, additional);
        this.name = 'ParameterError';
    }
}

export class DataError extends InputError {
    constructor(message = '(Data Error)', additional = undefined) {
        super(message, additional);
        this.name = 'DataError';
    }
}

export class UserException extends RuntimeException {
    constructor(message = '(The end user has a fault that caused the exception. This is not code bug.)', additional = undefined) {
        super(message, additional);
        this.name = 'UserException';
    }
}

// Level 3

export class VersionSystemError extends DataError {
    constructor(message = '(Version System Error)', additional = undefined) {
        super(message, additional);
        this.name = 'VersionSystemError';
    }
}

// Level 4 -- Detailed Errors

export class InvalidParameterException extends ParameterError {
    constructor(message = 'The parameter provided is invalid.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidParameterException';
    }
}

export class BadDataException extends DataError {
    constructor(message = 'The data is bad.', additional = undefined) {
        super(message, additional);
        this.name = 'BadDataException';
    }
}

export class InvalidScryptParameterException extends ParameterError {
    constructor(message = 'The N, r, or p is not valid or out of range.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidScryptParameterException';
    }
}

export class EncryptionVersionMismatchException extends VersionSystemError {
    constructor(message = 'The version of the encryption library doesn\'t match.', additional = undefined) {
        super(message, additional);
        this.name = 'EncryptionVersionMismatchException';
    }
}

export class InvalidFileFormatException extends DataError {
    constructor(message = 'The file format is invalid.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidFileFormatException';
    }
}

export class IVException extends InternalError {
    constructor(message = 'IV Exception.', additional = undefined) {
        super(message, additional);
        this.name = 'IVException';
    }
}

export class FileCorruptedException extends DataError {
    constructor(message = 'File is corrupted.', additional = undefined) {
        super(message, additional);
        this.name = 'FileCorruptedException';
    }
}

export class InvalidEndMarkerException extends DataError {
    constructor(message = 'The end marker is invalid.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidEndMarkerException';
    }
}

export class CannotDecryptException extends UserException {
    constructor(message = 'Cannot decrypt', additional = undefined) {
        super(message, additional);
        this.name = 'CannotDecryptException';
    }
}

export class UnexpectedFailureInChunkDecryptionException extends UnexpectedError {
    constructor(message = 'An unexpected failure occurred while decrypting the chunk. The file may be corrupted.', additional = undefined) {
        super(message, additional);
        this.name = 'UnexpectedFailureInChunkDecryptionException';
    }
}

export class CryptContextReusedException extends ParameterError {
    constructor(message = 'Not allowed to reuse a crypt context.', additional = undefined) {
        super(message, additional);
        this.name = 'CryptContextReusedException';
    }
}

export class NotSupportedException extends InputError {
    constructor(message = 'Operation not supported', additional = undefined) {
        super(message, additional);
        this.name = 'NotSupportedException';
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
    constructor(message = 'Crypt context is not initialized.', additional = undefined) {
        super(message, additional);
        this.name = 'CryptContextNotInitedException';
    }
}

export class InvalidCryptContextTypeException extends ParameterError {
    constructor(message = 'Invalid crypt context type.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidCryptContextTypeException';
    }
}

export class CryptContextReleasedException extends ParameterError {
    constructor(message = 'Crypt context has been released.', additional = undefined) {
        super(message, additional);
        this.name = 'CryptContextReleasedException';
    }
}

export class OperationNotPermittedException extends ParameterError {
    constructor(message = 'Operation not permitted.', additional = undefined) {
        super(message, additional);
        this.name = 'OperationNotPermittedException';
    }
}

export class EncryptionAlgorithmNotSupportedException extends DataError {
    constructor(message = 'The specified encryption algorithm is not supported.', additional = undefined) {
        super(message, additional);
        this.name = 'EncryptionAlgorithmNotSupportedException';
    }
}

export class ChaCha20NotSupportedException extends EncryptionAlgorithmNotSupportedException {
    constructor(message = 'ChaCha20 is not supported yet.', additional = undefined) {
        super(message, additional);
        this.name = 'ChaCha20NotSupportedException';
    }
}

export class DangerousEncryptionAlgorithmException extends EncryptionAlgorithmNotSupportedException {
    constructor(message = 'The specified encryption algorithm is DANGEROUS.', additional = undefined) {
        super(message, additional);
        this.name = 'DangerousEncryptionAlgorithmException';
    }
}
