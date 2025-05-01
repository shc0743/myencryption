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

export function raise(message, additional) {
    throw new InternalError(message, additional);
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

