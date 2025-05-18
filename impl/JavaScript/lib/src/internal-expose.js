import { deriveKey__phrases } from "./derive_key.js";
import {
    END_IDENTIFIER, END_MARKER, FILE_END_MARKER,
    nextTick, PADDING_SIZE, TAIL_BLOCK_MARKER,
    GetFileVersion, GetFileInfo, GetFileChunkSize,
} from "./internal-util.js";

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
    derive_key_default_phrases_list: deriveKey__phrases,
};

export { Internals };