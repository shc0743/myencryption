export class EncryptionError extends Error {
    constructor(message = 'Encryption Error', additional = undefined) {
        super(message, additional);
        this.name = 'EncryptionError';
    }
}

export class InternalError extends EncryptionError {
    constructor(message = '(Internal Error)', additional = undefined) {
        super(message, additional);
        this.name = 'InternalError';
    }
}

export class InvalidParameterException extends EncryptionError {
    constructor(message = 'The parameter provided is invalid.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidParameterException';
    }
}

export class BadDataException extends EncryptionError {
    constructor(message = 'The data is bad.', additional = undefined) {
        super(message, additional);
        this.name = 'BadDataException';
    }
}

export class InvalidScryptParameterException extends EncryptionError {
    constructor(message = 'The N, r, or p is not valid or out of range.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidScryptParameterException';
    }
}

export class EncryptionVersionMismatchException extends EncryptionError {
    constructor(message = 'The version of the encryption library doesn\'t match.', additional = undefined) {
        super(message, additional);
        this.name = 'EncryptionVersionMismatchException';
    }
}

export class InvalidFileFormatException extends EncryptionError {
    constructor(message = 'The file format is invalid.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidFileFormatException';
    }
}

export class IVException extends EncryptionError {
    constructor(message = 'IV Exception.', additional = undefined) {
        super(message, additional);
        this.name = 'IVException';
    }
}

export class FileCorruptedException extends EncryptionError {
    constructor(message = 'File is corrupted.', additional = undefined) {
        super(message, additional);
        this.name = 'FileCorruptedException';
    }
}

export class InvalidEndMarkerException extends EncryptionError {
    constructor(message = 'The end marker is invalid.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidEndMarkerException';
    }
}

export class CannotDecryptException extends EncryptionError {
    constructor(message = 'Cannot decrypt', additional = undefined) {
        super(message, additional);
        this.name = 'CannotDecryptException';
    }
}

export class UnexpectedFailureInChunkDecryptionException extends EncryptionError {
    constructor(message = 'An unexpected failure occurred while decrypting the chunk. The file may be corrupted.', additional = undefined) {
        super(message, additional);
        this.name = 'UnexpectedFailureInChunkDecryptionException';
    }
}

export class CryptContextReusedException extends EncryptionError {
    constructor(message = 'Not allowed to reuse a crypt context.', additional = undefined) {
        super(message, additional);
        this.name = 'CryptContextReusedException';
    }
}

export class NotSupportedException extends EncryptionError {
    constructor(message = 'Operation not supported', additional = undefined) {
        super(message, additional);
        this.name = 'NotSupportedException';
    }
}

export class EndOfFileException extends EncryptionError {
    constructor(message = 'End of File', additional = undefined) {
        super(message, additional);
        this.name = 'EndOfFileException';
    }
}

export class CryptContextNotInitedException extends EncryptionError {
    constructor(message = 'Crypt context is not initialized.', additional = undefined) {
        super(message, additional);
        this.name = 'CryptContextNotInitedException';
    }
}

export class InvalidCryptContextTypeException extends EncryptionError {
    constructor(message = 'Invalid crypt context type.', additional = undefined) {
        super(message, additional);
        this.name = 'InvalidCryptContextTypeException';
    }
}

export class CryptContextReleasedException extends EncryptionError {
    constructor(message = 'Crypt context has been released.', additional = undefined) {
        super(message, additional);
        this.name = 'CryptContextReleasedException';
    }
}

export class OperationNotPermittedException extends EncryptionError {
    constructor(message = 'Operation not permitted.', additional = undefined) {
        super(message, additional);
        this.name = 'OperationNotPermittedException';
    }
}

export class EncryptionAlgorithmNotSupportedException extends EncryptionError {
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
