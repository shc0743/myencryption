import { END_IDENTIFIER, END_MARKER, FILE_END_MARKER, nextTick, PADDING_SIZE, TAIL_BLOCK_MARKER } from "./internal-util.js";
import { GetFileVersion, GetFileInfo, GetFileChunkSize } from "./internal-util.js";

const Internals = {
    PADDING_SIZE,
    END_IDENTIFIER,
    TAIL_BLOCK_MARKER,
    END_MARKER,
    FILE_END_MARKER,
    nextTick,
    GetFileVersion,
    GetFileInfo,
    GetFileChunkSize,
};

export { Internals };