export declare function createReaderForLocalFile(file: Blob): Promise<(start: number, end: number) => Promise<Uint8Array>>;

export declare function createReaderForFileSystemHandle(fileSystemHandle: FileSystemFileHandle): Promise<(start: number, end: number) => Promise<Uint8Array>>;

export declare function createReaderForRemoteObject(url: string): Promise<(start: number, end: number) => Promise<Uint8Array>>;

export declare function createWriterForMemoryBuffer(bufferOutput: Uint8Array[]): Promise<(data: Uint8Array) => Promise<void>>;
