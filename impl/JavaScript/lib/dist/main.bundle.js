var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/binascii.js
var hexTable = new Array(256);
for (let i = 0; i < 256; i++) {
  hexTable[i] = i.toString(16).padStart(2, "0");
}
function hexlify(data) {
  if (!data || !(data instanceof Uint8Array)) {
    throw new TypeError("Input must be a Uint8Array");
  }
  const length = data.length;
  const arr = new Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = hexTable[data[i]];
  }
  return arr.join("");
}
var throwing = {
  get InvalidHexStringException() {
    throw new TypeError("Invalid hex string");
  }
};
function unhexlify(hexStr) {
  if (typeof hexStr !== "string") {
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
    const high = highCode >= 97 && highCode <= 102 ? highCode - 87 : highCode >= 48 && highCode <= 57 ? highCode - 48 : throwing.InvalidHexStringException;
    const low = lowCode >= 97 && lowCode <= 102 ? lowCode - 87 : lowCode >= 48 && lowCode <= 57 ? lowCode - 48 : throwing.InvalidHexStringException;
    bytes[i >> 1] = high << 4 | low;
  }
  return bytes;
}

// src/random.js
function get_random_bytes(count) {
  const randomBytes = new Uint8Array(count);
  crypto.getRandomValues(randomBytes);
  return randomBytes;
}
function get_random_int8_number() {
  const randomBytes = get_random_bytes(1);
  return new Int8Array(randomBytes)[0];
}
function get_random_uint8_number() {
  const randomBytes = get_random_bytes(1);
  return new Uint8Array(randomBytes)[0];
}

// src/str.js
function str_encode(input, encoding = "utf-8") {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  if (encoding.toLowerCase() !== "utf-8") {
    throw new Error("Only 'utf-8' encoding is supported");
  }
  return new TextEncoder().encode(input);
}
function str_decode(input, encoding = "utf-8") {
  if (!(input instanceof Uint8Array)) {
    input = new Uint8Array(input);
  }
  if (encoding.toLowerCase() !== "utf-8") {
    throw new Error("Only 'utf-8' encoding is supported");
  }
  return new TextDecoder().decode(input);
}

// src/exceptions.js
var exceptions_exports = {};
__export(exceptions_exports, {
  BadDataException: () => BadDataException,
  CannotDecryptException: () => CannotDecryptException,
  ChaCha20NotSupportedException: () => ChaCha20NotSupportedException,
  CryptContextNotInitedException: () => CryptContextNotInitedException,
  CryptContextReleasedException: () => CryptContextReleasedException,
  CryptContextReusedException: () => CryptContextReusedException,
  DangerousEncryptionAlgorithmException: () => DangerousEncryptionAlgorithmException,
  DataError: () => DataError,
  DeprecationException: () => DeprecationException,
  EncryptionAlgorithmNotSupportedException: () => EncryptionAlgorithmNotSupportedException,
  EncryptionError: () => EncryptionError,
  EncryptionVersionMismatchException: () => EncryptionVersionMismatchException,
  EndOfFileException: () => EndOfFileException,
  ExpectedError: () => ExpectedError,
  FileCorruptedException: () => FileCorruptedException,
  IVException: () => IVException,
  InputError: () => InputError,
  InternalError: () => InternalError,
  InvalidCryptContextTypeException: () => InvalidCryptContextTypeException,
  InvalidEndMarkerException: () => InvalidEndMarkerException,
  InvalidFileFormatException: () => InvalidFileFormatException,
  InvalidParameterException: () => InvalidParameterException,
  InvalidScryptParameterException: () => InvalidScryptParameterException,
  LibraryError: () => LibraryError,
  NetworkError: () => NetworkError,
  NotSupportedException: () => NotSupportedException,
  OperationNotPermittedException: () => OperationNotPermittedException,
  ParameterError: () => ParameterError,
  RuntimeException: () => RuntimeException,
  UnexpectedError: () => UnexpectedError,
  UnexpectedFailureInChunkDecryptionException: () => UnexpectedFailureInChunkDecryptionException,
  UserException: () => UserException,
  VersionSystemError: () => VersionSystemError,
  raise: () => raise
});
var LibraryError = class extends Error {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Library Error", additional = void 0) {
    super(message, additional);
    this.name = "LibraryError";
  }
};
function raise(error) {
  throw error;
}
var EncryptionError = class extends LibraryError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Encryption Error", additional = void 0) {
    super(message, additional);
    this.name = "EncryptionError";
  }
};
var NetworkError = class extends LibraryError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(Network Error)", additional = void 0) {
    super(message, additional);
    this.name = "NetworkError";
  }
};
var ExpectedError = class extends EncryptionError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(Expected Error)", additional = void 0) {
    super(message, additional);
    this.name = "ExpectedError";
  }
};
var RuntimeException = class extends EncryptionError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(Runtime Error)", additional = void 0) {
    super(message, additional);
    this.name = "RuntimeException";
  }
};
var UnexpectedError = class extends RuntimeException {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(Unexpected Error)", additional = void 0) {
    super(message, additional);
    this.name = "UnexpectedError";
  }
};
var InternalError = class extends UnexpectedError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(Internal Error)", additional = void 0) {
    super(message, additional);
    this.name = "InternalError";
  }
};
var InputError = class extends RuntimeException {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(Input Error)", additional = void 0) {
    super(message, additional);
    this.name = "InputError";
  }
};
var ParameterError = class extends InputError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(Data Error)", additional = void 0) {
    super(message, additional);
    this.name = "ParameterError";
  }
};
var DataError = class extends InputError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(Data Error)", additional = void 0) {
    super(message, additional);
    this.name = "DataError";
  }
};
var UserException = class extends RuntimeException {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(The end user has a fault that caused the exception. This is not code bug.)", additional = void 0) {
    super(message, additional);
    this.name = "UserException";
  }
};
var VersionSystemError = class extends DataError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "(Version System Error)", additional = void 0) {
    super(message, additional);
    this.name = "VersionSystemError";
  }
};
var InvalidParameterException = class extends ParameterError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "The parameter provided is invalid.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidParameterException";
  }
};
var BadDataException = class extends DataError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "The data is bad.", additional = void 0) {
    super(message, additional);
    this.name = "BadDataException";
  }
};
var InvalidScryptParameterException = class extends ParameterError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "The N, r, or p is not valid or out of range.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidScryptParameterException";
  }
};
var EncryptionVersionMismatchException = class extends VersionSystemError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "The version of the encryption library doesn't match.", additional = void 0) {
    super(message, additional);
    this.name = "EncryptionVersionMismatchException";
  }
};
var InvalidFileFormatException = class extends DataError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "The file format is invalid.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidFileFormatException";
  }
};
var IVException = class extends InternalError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "IV Exception.", additional = void 0) {
    super(message, additional);
    this.name = "IVException";
  }
};
var FileCorruptedException = class extends DataError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "File is corrupted.", additional = void 0) {
    super(message, additional);
    this.name = "FileCorruptedException";
  }
};
var InvalidEndMarkerException = class extends DataError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "The end marker is invalid.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidEndMarkerException";
  }
};
var CannotDecryptException = class extends UserException {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Cannot decrypt", additional = void 0) {
    super(message, additional);
    this.name = "CannotDecryptException";
  }
};
var UnexpectedFailureInChunkDecryptionException = class extends UnexpectedError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "An unexpected failure occurred while decrypting the chunk. The file may be corrupted.", additional = void 0) {
    super(message, additional);
    this.name = "UnexpectedFailureInChunkDecryptionException";
  }
};
var CryptContextReusedException = class extends ParameterError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Not allowed to reuse a crypt context.", additional = void 0) {
    super(message, additional);
    this.name = "CryptContextReusedException";
  }
};
var NotSupportedException = class extends InputError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Operation not supported", additional = void 0) {
    super(message, additional);
    this.name = "NotSupportedException";
  }
};
var DeprecationException = class extends InputError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Trying to use a deprecated feature.", additional = void 0) {
    super(message, additional);
    this.name = "DeprecationException";
  }
};
var EndOfFileException = class extends ExpectedError {
  constructor(message = "End of File", additional = void 0) {
    super(message, additional);
    this.name = "EndOfFileException";
    if (typeof process !== "undefined" && false) return;
    globalThis.console.warn(
      "%c[npm::simple-data-crypto] %c[EndOfFileException] %cDEPRECATED!! %cDeprecated and will be removed in the next MAJOR version. See %csrc/exceptions.js%c for more information.\n%cNote: %cThis %cdoes not%c indicate the package is deprecated. Instead, it indicates that your code uses the %cdeprecated%c class %cEndOfFileException%c. Fix your code to suppress this warning.",
      "color: #007700",
      "color: #570263",
      "color: red; font-weight: bold;",
      "",
      "font-weight: bold;",
      "",
      "font-weight: bold; color: #0000ff",
      "",
      "color: red; font-weight: bold;",
      "",
      "font-style: italic",
      "",
      "color: #570263",
      ""
    );
  }
};
var CryptContextNotInitedException = class extends ParameterError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Crypt context is not initialized.", additional = void 0) {
    super(message, additional);
    this.name = "CryptContextNotInitedException";
  }
};
var InvalidCryptContextTypeException = class extends ParameterError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Invalid crypt context type.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidCryptContextTypeException";
  }
};
var CryptContextReleasedException = class extends ParameterError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Crypt context has been released.", additional = void 0) {
    super(message, additional);
    this.name = "CryptContextReleasedException";
  }
};
var OperationNotPermittedException = class extends ParameterError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "Operation not permitted.", additional = void 0) {
    super(message, additional);
    this.name = "OperationNotPermittedException";
  }
};
var EncryptionAlgorithmNotSupportedException = class extends DataError {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "The specified encryption algorithm is not supported.", additional = void 0) {
    super(message, additional);
    this.name = "EncryptionAlgorithmNotSupportedException";
  }
};
var ChaCha20NotSupportedException = class extends EncryptionAlgorithmNotSupportedException {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "ChaCha20 is not supported yet.", additional = void 0) {
    super(message, additional);
    this.name = "ChaCha20NotSupportedException";
  }
};
var DangerousEncryptionAlgorithmException = class extends EncryptionAlgorithmNotSupportedException {
  /**
   * @param {string} message 
   * @param {Object} [additional] 
   */
  constructor(message = "The specified encryption algorithm is DANGEROUS.", additional = void 0) {
    super(message, additional);
    this.name = "DangerousEncryptionAlgorithmException";
  }
};

// src/loader.js
function load_script(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(script);
    script.onerror = (e) => reject(e);
    document.head.append(script);
  });
}
function load_deps_es5(deps_name, deps_src) {
  if (Reflect.has(globalThis, deps_name)) return Promise.resolve(Reflect.get(globalThis, deps_name));
  return load_script(deps_src).then(() => {
    return Reflect.get(globalThis, deps_name);
  });
}

// src/scrypt-layer/dynamic-compile.js
var scryptAPI = await load_deps_es5("scrypt", import.meta.resolve("./WebScrypt/scrypt.js"));
scryptAPI.setResPath(import.meta.resolve("./WebScrypt/asset/"));
scryptAPI.load();
var scrypt = /* @__PURE__ */ function() {
  const queue = [];
  let running = false;
  const work = (task) => new Promise(async (resolve, reject) => {
    scryptAPI.onprogress = (p) => {
      if (task.onprogress) task.onprogress(p);
    };
    scryptAPI.oncomplete = (dk) => {
      task.resolve(dk);
      resolve(true);
    };
    scryptAPI.onerror = (e) => {
      task.reject(e);
      resolve(false);
    };
    try {
      scryptAPI.config({ N: task.N, r: task.r, P: task.p }, { maxPassLen: 8192, maxSaltLen: 2048, maxDkLen: 1024, maxThread: 1 });
      await new Promise((r) => scryptAPI.onready = r);
      scryptAPI.hash(task.key, task.salt, task.dklen);
    } catch (e) {
      reject(e);
    }
  });
  async function thread() {
    let task = null;
    while (queue.length) try {
      task = queue.splice(0, 1)[0];
      await work(task);
      await nextTick();
    } catch (e) {
      task?.reject(e);
    }
    running = false;
  }
  return function scrypt2(key, salt, N, r, p, dklen, onprogress = null) {
    return new Promise((resolve, reject) => {
      queue.push({
        key,
        salt,
        N,
        r,
        p,
        dklen,
        resolve,
        reject,
        onprogress
      });
      if (!running) {
        running = true;
        setTimeout(thread);
      }
    });
  };
}();
function nextTick() {
  return new Promise((r) => setTimeout(r));
}

// src/internal-util.js
var PADDING_SIZE = 4096;
var END_IDENTIFIER = [
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170
];
var TAIL_BLOCK_MARKER = [
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85
];
var END_MARKER = [
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170
];
var FILE_END_MARKER = [255, 253, 240, 16, 19, 208, 18, 24, 85, 170];
var POWER_2_64 = 2n ** 64n;
if (POWER_2_64 !== BigInt("18446744073709551616")) {
  throw new UnexpectedError("POWER_2_64 is not 2^64");
}
var timerproc = typeof process === "undefined" ? requestAnimationFrame : (
  // browser
  setTimeout
);
function nextTick2() {
  return new Promise((r) => timerproc(r));
}
function normalize_version(major_version, version_marker = null) {
  if (!major_version) return `Unknown Version`;
  let vm = String(version_marker);
  if (String(major_version) === "1.1") vm = "null";
  if (!version_marker) return `${major_version}/0`;
  return `${major_version}/${vm}`;
}
var ENCRYPTION_FILE_VER_1_1_0 = normalize_version("1.1");
var ENCRYPTION_FILE_VER_1_2_10020 = normalize_version("1.2", 10020);
async function GetFileVersion(file_reader) {
  const header = await file_reader(0, 13);
  if (str_decode(header) !== "MyEncryption/") {
    throw new InvalidFileFormatException();
  }
  const top_header_version = str_decode(await file_reader(13, 16));
  if (!["1.1", "1.2"].includes(top_header_version)) {
    throw new EncryptionVersionMismatchException();
  }
  const version_marker = new DataView((await file_reader(16, 20)).buffer).getUint32(0, true);
  const version = normalize_version(top_header_version, version_marker);
  return version;
}
async function GetFileInfo(file_reader) {
  const version = await GetFileVersion(file_reader);
  if (version === ENCRYPTION_FILE_VER_1_1_0) {
    throw new OperationNotPermittedException("The chunk size is volatile and we cannot get a fixed value.");
  }
  if (version === ENCRYPTION_FILE_VER_1_2_10020) {
    let read_pos = 16 + 4;
    const ekey_len = new DataView((await file_reader(read_pos, read_pos + 4)).buffer).getUint32(0, true);
    const ekey = str_decode(await file_reader(read_pos + 4, read_pos + 4 + ekey_len));
    read_pos += PADDING_SIZE;
    const json_len_bytes = await file_reader(read_pos, read_pos + 4);
    const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
    read_pos += 4;
    read_pos += json_len;
    const chunk_size = Number(new DataView((await file_reader(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
    let nonce_counter = Number(new DataView((await file_reader(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
    return { version, chunk_size, nonce_counter, ekey };
  }
  throw new EncryptionVersionMismatchException();
}
async function GetFileChunkSize(file_reader) {
  return (await GetFileInfo(file_reader)).chunk_size;
}
function CheckAlgorithm(algorithm) {
  if (!!algorithm && algorithm !== "AES-GCM") {
    if (algorithm === "ChaCha20" || algorithm === "ChaCha20-Poly1305") {
      throw new ChaCha20NotSupportedException();
    }
    if (algorithm === "DES" || algorithm === "RC4") {
      throw new DangerousEncryptionAlgorithmException();
    }
    if (algorithm === "XTS-AES") {
      throw new EncryptionAlgorithmNotSupportedException("XTS-AES Not supported yet");
    }
    throw new EncryptionAlgorithmNotSupportedException(void 0, {
      cause: new Error(String(algorithm))
    });
  }
}
async function is_encrypted_message(message) {
  if (typeof message !== "string") return false;
  if (message.charAt(0) === ":") {
    const arr = message.split(":");
    if (arr.length === 8) {
      const [, data, phrase, salt, N, v, a] = arr;
      return !!(data && phrase && salt && N && v && a);
    }
    return false;
  }
  if (message.charAt(0) !== "{") return false;
  try {
    const json = JSON.parse(message);
    return json.data && json.parameter && json.N && json.v;
  } catch {
    return false;
  }
}
async function is_encrypted_file(file_reader) {
  try {
    const info = await GetFileInfo(file_reader);
    return !!info.version;
  } catch {
    return false;
  }
}

// src/encrypt_data.js
var crypto2 = globalThis.crypto;
function safeparse(json) {
  try {
    const r = JSON.parse(json);
    if (!r || !r.data || !r.parameter || !r.N || !r.v) throw new BadDataException("The message is bad since the JSON is not complete.");
    return r;
  } catch {
    throw new BadDataException("The message is bad since it is neither a JSON or a new-format ciphertext.");
  }
}
async function encrypt_data(message, key, phrase = null, N = null) {
  const iv = get_random_bytes(12);
  const { derived_key, parameter, N: N2 } = await derive_key(key, iv, phrase, N);
  N = N2;
  const cipher = await crypto2.subtle.importKey("raw", derived_key, "AES-GCM", false, ["encrypt"]);
  if (typeof message !== "string") {
    throw new OperationNotPermittedException("The ability to directly encrypt binary data has been removed in the new version. Please use `encrypt_file` instead.");
  }
  const alg = "AES-GCM";
  const ciphertext = await crypto2.subtle.encrypt(
    {
      name: alg,
      iv
    },
    cipher,
    str_encode(message)
  );
  const encrypted_message = new Uint8Array(iv.length + ciphertext.byteLength);
  encrypted_message.set(iv, 0);
  encrypted_message.set(new Uint8Array(ciphertext), iv.length);
  const message_encrypted = hexlify(encrypted_message);
  const v = 5.6;
  return `:${message_encrypted}:${parameter}:${N}:${v}:${alg}:`;
}
async function parse_ciphertext(message_encrypted) {
  let jsoned;
  if (message_encrypted.charAt(0) === ":") {
    const arr = message_encrypted.split(":");
    if (arr.length !== 8) throw new BadDataException("The message is bad.");
    const [, data, phrase2, salt2, N2, v, a] = arr;
    jsoned = { data, phrase: phrase2, salt: salt2, N: +N2, v: +v, a };
  } else {
    jsoned = safeparse(message_encrypted);
  }
  const N = parseInt(jsoned.N);
  const alg = jsoned.a;
  CheckAlgorithm(alg);
  const encrypted_data = unhexlify(jsoned.data);
  let phrase, salt_b64;
  if (jsoned.parameter) [phrase, salt_b64] = jsoned.parameter.split(":");
  else {
    phrase = jsoned.phrase;
    salt_b64 = jsoned.salt;
  }
  const salt = unhexlify(salt_b64);
  if (isNaN(N) || !phrase || "string" !== typeof phrase || !encrypted_data || !salt)
    throw new BadDataException("The message or parameters are bad.");
  if (encrypted_data.length < 28)
    throw new BadDataException("The message was too short.");
  const iv = encrypted_data.slice(0, 12);
  const ciphertext = encrypted_data.slice(12, -16);
  const tag = encrypted_data.slice(-16);
  return { iv, ciphertext, tag, phrase, salt, N };
}
async function decrypt_data(message_encrypted, key) {
  const { iv, ciphertext, tag, phrase, salt, N } = await parse_ciphertext(message_encrypted);
  const derived_key = typeof key === "string" ? (await derive_key(key, iv, phrase, N, salt)).derived_key : key;
  if (!(derived_key instanceof Uint8Array)) throw new InvalidParameterException("The key is not valid.");
  const cipher = await crypto2.subtle.importKey("raw", derived_key, "AES-GCM", false, ["decrypt"]);
  try {
    const decrypted_data = await crypto2.subtle.decrypt(
      {
        name: "AES-GCM",
        iv
      },
      cipher,
      new Uint8Array([...ciphertext, ...tag])
    );
    try {
      return str_decode(decrypted_data);
    } catch {
      throw new OperationNotPermittedException("The ability to directly decrypt binary data has been removed in the new version. If you have encrypted binary data, please recover it using the old version.");
    }
  } catch (e) {
    if (!e || !(e instanceof DOMException)) throw new InternalError(`Internal error.`, { cause: e });
    const name = e.name;
    if (name === "InvalidAccessError") throw new InvalidParameterException("InvalidAccessError.", { cause: e });
    if (name === "OperationError") throw new CannotDecryptException("Cannot decrypt. Did you provide the correct password?", { cause: e });
    throw new InternalError(`Unexpected error.`, { cause: e });
  }
}

// src/derive_key.js
var deriveKey__phrases = ["Furina", "Neuvillette", "Venti", "Nahida", "Kinich", "Kazuha"];
async function derive_key(key, iv, phrase = null, N = null, salt = null, r = 8, p = 1, dklen = 32) {
  if (N === null) N = 262144;
  if (typeof N !== "number" || N > 2097152 || r < 1 || p < 1 || typeof r !== "number" || typeof p !== "number" || typeof dklen !== "number") {
    throw new InvalidScryptParameterException();
  }
  if (typeof key !== "string") throw new InvalidParameterException("key must be a string");
  if (!(iv instanceof Uint8Array)) throw new InvalidParameterException("iv must be a Uint8Array");
  if (phrase !== null && typeof phrase !== "string") throw new InvalidParameterException("phrase must be a string");
  if (!salt) {
    salt = get_random_bytes(64);
  }
  if (!phrase) {
    phrase = deriveKey__phrases[get_random_uint8_number() % deriveKey__phrases.length];
  }
  if (phrase.includes(":")) {
    throw new InvalidParameterException('phrase MUST NOT contain ":"');
  }
  const parameter = `${phrase}:${hexlify(salt)}`;
  const keyInput = `MyEncryption/1.1 Fontaine/4.2 Iv/${hexlify(iv)} user_parameter=${parameter} user_key=${key}`;
  const derived_key = await scrypt(str_encode(keyInput), salt, N, r, p, dklen);
  return { derived_key, parameter, N };
}
async function derive_key_for_file(file_reader, user_key) {
  let read_pos = 16 + 4;
  const version = await GetFileVersion(file_reader);
  if (version === ENCRYPTION_FILE_VER_1_1_0) {
    throw new NotSupportedException("Deriving a key for V1.1 files is not supported");
  }
  if (version !== ENCRYPTION_FILE_VER_1_2_10020) {
    throw new EncryptionVersionMismatchException();
  }
  const ekey_len = new DataView((await file_reader(read_pos, read_pos + 4)).buffer).getUint32(0, true);
  const ekey = str_decode(await file_reader(read_pos + 4, read_pos + 4 + ekey_len));
  read_pos += PADDING_SIZE;
  if (ekey_len > PADDING_SIZE) {
    throw new InternalError("(Internal Error) This should not happen. Contact the application developer.");
  }
  const key = await decrypt_data(ekey, user_key);
  const json_len_bytes = await file_reader(read_pos, read_pos + 4);
  const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const header_json = JSON.parse(
    str_decode(await file_reader(read_pos, read_pos + json_len))
  );
  read_pos += json_len;
  const header_version = header_json.v;
  if (![5.5].includes(header_version)) throw new EncryptionVersionMismatchException();
  const [phrase, salt_hex] = header_json.parameter.split(":");
  const salt = unhexlify(salt_hex);
  const iv4key = unhexlify(header_json.iv);
  const N = header_json.N;
  const algorithm = header_json.a;
  CheckAlgorithm(algorithm);
  return (await derive_key(key, iv4key, phrase, N, salt)).derived_key;
}
async function scrypt_hex(key, salt, N, r, p, dklen) {
  return hexlify(await scrypt(str_encode(key), str_encode(salt), N, r, p, dklen));
}

// src/encrypt_file.js
var crypto3 = globalThis.crypto;
async function encrypt_file(file_reader, file_writer, user_key, callback = null, phrase = null, N = null, chunk_size = 32 * 1024 * 1024) {
  if (!chunk_size) throw new InvalidParameterException("chunk_size must be greater than 0.");
  await file_writer(str_encode("MyEncryption/1.2"));
  const VERSION_MARKER = 10020;
  const versionMarkerBuffer = new ArrayBuffer(4);
  new DataView(versionMarkerBuffer).setUint32(0, VERSION_MARKER, true);
  await file_writer(new Uint8Array(versionMarkerBuffer));
  const key = hexlify(get_random_bytes(64));
  const ekey = await encrypt_data(key, user_key, phrase, N);
  const ekey_bytes = str_encode(ekey);
  N = 8192;
  if (ekey_bytes.length > PADDING_SIZE) {
    throw new InternalError("(Internal Error) This should not happen. Contact the application developer.");
  }
  const lengthBuffer = new ArrayBuffer(4);
  new DataView(lengthBuffer).setUint32(0, ekey_bytes.length, true);
  await file_writer(new Uint8Array(lengthBuffer));
  await file_writer(ekey_bytes);
  const padding = new Uint8Array(PADDING_SIZE - ekey_bytes.length - 4).fill(0);
  await file_writer(padding);
  callback?.(0);
  await nextTick2();
  const iv_for_key = get_random_bytes(12);
  const { derived_key, parameter, N: N2 } = await derive_key(key, iv_for_key, phrase, N);
  N = N2;
  const header_data = {
    "parameter": parameter,
    "N": N,
    "v": 5.5,
    "a": "AES-GCM",
    "iv": hexlify(iv_for_key)
  };
  const header_json = str_encode(JSON.stringify(header_data));
  const headerLengthBuffer = new ArrayBuffer(4);
  new DataView(headerLengthBuffer).setUint32(0, header_json.length, true);
  await file_writer(new Uint8Array(headerLengthBuffer));
  await file_writer(header_json);
  const chunkSizeBuffer = new ArrayBuffer(8);
  new DataView(chunkSizeBuffer).setBigUint64(0, BigInt(chunk_size), true);
  await file_writer(new Uint8Array(chunkSizeBuffer));
  let total_bytes = 0;
  let nonce_counter = BigInt(1);
  let position = 0;
  const nonce_counter_start = new ArrayBuffer(8);
  new DataView(nonce_counter_start).setBigUint64(0, nonce_counter, true);
  await file_writer(new Uint8Array(nonce_counter_start));
  callback?.(0);
  const cryptoKey = await crypto3.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["encrypt"]);
  while (true) {
    const chunk = await file_reader(position, position + chunk_size);
    if (!(chunk instanceof Uint8Array)) throw new BadDataException("The file chunk is not a Uint8Array.");
    if (chunk.length === 0) break;
    const isFinalChunk = chunk.length < chunk_size;
    const iv = new ArrayBuffer(12);
    if (nonce_counter >= POWER_2_64) {
      throw new IVException("nonce_counter exceeded the maximum value.");
    }
    new DataView(iv).setBigUint64(4, nonce_counter, true);
    nonce_counter++;
    if (isFinalChunk) {
      await file_writer(new Uint8Array(TAIL_BLOCK_MARKER));
      const chunkLengthBuffer = new ArrayBuffer(8);
      new DataView(chunkLengthBuffer).setBigUint64(0, BigInt(chunk.length), true);
      await file_writer(new Uint8Array(chunkLengthBuffer));
    }
    const ivArray = new Uint8Array(iv);
    const ciphertext = await crypto3.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: ivArray
      },
      cryptoKey,
      chunk
    );
    const ciphertextArray = new Uint8Array(ciphertext);
    await file_writer(ciphertextArray);
    total_bytes += chunk.length;
    position += chunk.length;
    callback?.(total_bytes);
  }
  await file_writer(new Uint8Array(END_MARKER));
  const totalBytesBuffer = new ArrayBuffer(8);
  new DataView(totalBytesBuffer).setBigUint64(0, BigInt(total_bytes), true);
  await file_writer(new Uint8Array(totalBytesBuffer));
  await file_writer(new Uint8Array(FILE_END_MARKER));
  return true;
}
async function decrypt_file_V_1_1_0(file_reader, file_writer, user_key, callback = null) {
  const header = await file_reader(0, 16);
  if (str_decode(header) !== "MyEncryption/1.1") {
    throw new TypeError("Invalid file format");
  }
  let read_pos = 16;
  const ekey_len_bytes = await file_reader(read_pos, read_pos + 4);
  const ekey_len = new DataView(ekey_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const ekey = str_decode(await file_reader(read_pos, read_pos + ekey_len));
  read_pos += 1024;
  const key = await decrypt_data(ekey, user_key);
  const json_len_bytes = await file_reader(read_pos, read_pos + 4);
  const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const header_json = JSON.parse(
    str_decode(await file_reader(read_pos, read_pos + json_len))
  );
  read_pos += json_len;
  const [phrase, salt_hex] = header_json.parameter.split(":");
  const salt = unhexlify(salt_hex);
  const iv4key = unhexlify(header_json.iv);
  const N = header_json.N;
  callback?.(0);
  await nextTick2();
  const { derived_key } = await derive_key(key, iv4key, phrase, N, salt);
  let total_bytes = 0;
  const cryptoKey = await crypto3.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["decrypt"]);
  while (true) {
    const chunk_len_bytes = await file_reader(read_pos, read_pos + 8);
    read_pos += 8;
    if (chunk_len_bytes.every(
      (v, i) => v === [255, 253, 240, 16, 19, 208, 18, 24][i]
    )) break;
    const chunk_len = Number(
      new DataView(chunk_len_bytes.buffer).getBigUint64(0, true)
    );
    const iv = await file_reader(read_pos, read_pos + 12);
    read_pos += 12;
    const ciphertext = await file_reader(read_pos, read_pos + chunk_len + 16);
    read_pos += chunk_len + 16;
    const full_ciphertext = ciphertext;
    const decrypted = await crypto3.subtle.decrypt(
      {
        name: "AES-GCM",
        iv
      },
      cryptoKey,
      full_ciphertext
    );
    await file_writer(new Uint8Array(decrypted));
    total_bytes += decrypted.byteLength;
    if (callback) callback(total_bytes);
  }
  const total_bytes_bytes = await file_reader(read_pos, read_pos + 8);
  const total_bytes_decrypted = Number(
    new DataView(total_bytes_bytes.buffer).getBigUint64(0, true)
  );
  read_pos += 8;
  const end_marker = await file_reader(read_pos, read_pos + 2);
  if (total_bytes !== total_bytes_decrypted) throw new FileCorruptedException("File corrupted: total bytes mismatch");
  if (!end_marker.every((v, i) => v === [85, 170][i])) throw new InvalidEndMarkerException("Invalid end marker");
  return true;
}
async function decrypt_file(file_reader, file_writer, user_key, callback = null) {
  let read_pos = 16 + 4;
  const version = await GetFileVersion(file_reader);
  if (version === ENCRYPTION_FILE_VER_1_1_0) {
    if (typeof user_key !== "string") throw new NotSupportedException("operation not supported");
    return await decrypt_file_V_1_1_0(file_reader, file_writer, user_key, callback);
  }
  const ekey_len = new DataView((await file_reader(read_pos, read_pos + 4)).buffer).getUint32(0, true);
  const ekey = str_decode(await file_reader(read_pos + 4, read_pos + 4 + ekey_len));
  read_pos += PADDING_SIZE;
  if (ekey_len > PADDING_SIZE) {
    throw new InternalError("(Internal Error) This should not happen. Contact the application developer.");
  }
  const key = typeof user_key === "string" ? await decrypt_data(ekey, user_key) : null;
  const json_len_bytes = await file_reader(read_pos, read_pos + 4);
  const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const header_json = JSON.parse(
    str_decode(await file_reader(read_pos, read_pos + json_len))
  );
  read_pos += json_len;
  const header_version = header_json.v;
  if (![5.5].includes(header_version)) throw new EncryptionVersionMismatchException();
  const [phrase, salt_hex] = header_json.parameter.split(":");
  const salt = unhexlify(salt_hex);
  const iv4key = unhexlify(header_json.iv);
  const N = header_json.N;
  const algorithm = header_json.a;
  CheckAlgorithm(algorithm);
  const chunk_size = Number(new DataView((await file_reader(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
  let nonce_counter = BigInt(new DataView((await file_reader(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
  read_pos += 16;
  callback?.(0);
  await nextTick2();
  const derived_key = typeof user_key === "string" ? key ? (await derive_key(key, iv4key, phrase, N, salt)).derived_key : raise(new InternalError()) : user_key;
  let total_bytes = 0, is_final_chunk = false;
  const cryptoKey = await crypto3.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["decrypt"]);
  while (true) {
    const chunk_tag = await file_reader(read_pos, read_pos + 8);
    let real_size = 0;
    if (chunk_tag.every((v, i) => v === END_IDENTIFIER[i])) {
      const full_bytes = await file_reader(read_pos, read_pos + 32);
      if (full_bytes.every((v, i) => v === END_MARKER[i])) {
        read_pos += 32;
        break;
      }
      if (full_bytes.every((v, i) => v === TAIL_BLOCK_MARKER[i])) {
        is_final_chunk = true;
        read_pos += 32;
        const chunk_len_bytes = await file_reader(read_pos, read_pos + 8);
        read_pos += 8;
        real_size = Number(new DataView(chunk_len_bytes.buffer).getBigUint64(0, true));
        if (real_size === 0) break;
      }
    }
    const ciphertext_length = is_final_chunk ? real_size : chunk_size;
    const iv_array = new ArrayBuffer(12);
    new DataView(iv_array).setBigUint64(4, BigInt(nonce_counter), true);
    nonce_counter++;
    const ciphertext = await file_reader(read_pos, read_pos + ciphertext_length + 16);
    read_pos += ciphertext_length + 16;
    const full_ciphertext = ciphertext;
    try {
      const decrypted = await crypto3.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(iv_array)
        },
        cryptoKey,
        full_ciphertext
      );
      await file_writer(new Uint8Array(decrypted));
      total_bytes += decrypted.byteLength;
    } catch (e) {
      if (!e || !(e instanceof DOMException)) throw new InternalError(`Internal error.`, { cause: e });
      const name = e.name;
      if (name === "InvalidAccessError") throw new InvalidParameterException("InvalidAccessError.", { cause: e });
      if (name === "OperationError") throw new UnexpectedFailureInChunkDecryptionException(void 0, { cause: e });
      throw new InternalError(`Unexpected error.`, { cause: e });
    }
    if (callback) callback(total_bytes);
  }
  const total_bytes_bytes = await file_reader(read_pos, read_pos + 8);
  const total_bytes_decrypted = Number(
    new DataView(total_bytes_bytes.buffer).getBigUint64(0, true)
  );
  read_pos += 8;
  const end_marker = await file_reader(read_pos, read_pos + FILE_END_MARKER.length);
  if (total_bytes !== total_bytes_decrypted) throw new FileCorruptedException("total bytes mismatch");
  if (!end_marker.every((v, i) => v === FILE_END_MARKER[i])) throw new InvalidEndMarkerException();
  return true;
}
async function encrypt_blob(blob, password) {
  if (!(blob instanceof Blob)) throw new InvalidParameterException("blob must be a Blob");
  const buffer = [];
  const file_reader = async (start, end) => new Uint8Array(await blob.slice(start, end).arrayBuffer());
  const file_writer = async (data) => {
    buffer.push(data);
  };
  if (!await encrypt_file(file_reader, file_writer, password)) throw new UnexpectedError();
  return new Blob(buffer);
}
async function decrypt_blob(blob, password) {
  if (!(blob instanceof Blob)) throw new InvalidParameterException("blob must be a Blob");
  const buffer = [];
  const file_reader = async (start, end) => new Uint8Array(await blob.slice(start, end).arrayBuffer());
  const file_writer = async (data) => {
    buffer.push(data);
  };
  if (!await decrypt_file(file_reader, file_writer, password)) throw new UnexpectedError();
  return new Blob(buffer);
}

// src/key_management.js
async function export_master_key(file_head, current_key, export_key) {
  if (!(file_head instanceof Blob)) throw new InvalidParameterException();
  if (typeof current_key !== "string" || typeof export_key !== "string") throw new InvalidParameterException();
  if (file_head.size < 1024 + 16 + 4) throw new BadDataException("Data not enough");
  const version = await GetFileVersion(async (start, end) => {
    return new Uint8Array(await file_head.slice(start, end).arrayBuffer());
  });
  if (version === ENCRYPTION_FILE_VER_1_1_0) {
    const ekey_len = new DataView(await file_head.slice(16, 20).arrayBuffer()).getUint32(0, true);
    const buffer = await file_head.slice(20, 20 + ekey_len).arrayBuffer();
    const ekey_ciphertext = str_decode(buffer);
    return await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), export_key);
  }
  if (version === ENCRYPTION_FILE_VER_1_2_10020) {
    if (file_head.size < 16 + PADDING_SIZE) throw new BadDataException("Data not enough");
    const ekey_len = new DataView(await file_head.slice(20, 24).arrayBuffer()).getUint32(0, true);
    const buffer = await file_head.slice(24, 24 + ekey_len).arrayBuffer();
    const ekey_ciphertext = str_decode(buffer);
    return await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), export_key);
  }
  throw new EncryptionVersionMismatchException();
}
async function change_file_password_1_1_0(file_head, current_key, new_key) {
  if (!(file_head instanceof Blob)) throw new InvalidParameterException();
  if (typeof current_key !== "string" || typeof new_key !== "string") throw new InvalidParameterException();
  if (file_head.size < 1024 + 16 + 4) throw new BadDataException("Data not enough");
  const headerBlob = file_head.slice(0, 16);
  const header = await headerBlob.text();
  if (header !== "MyEncryption/1.1") {
    throw new TypeError("Invalid file format");
  }
  const ekey_len = new DataView(await file_head.slice(16, 20).arrayBuffer()).getUint32(0, true);
  const ekey_ciphertext = str_decode(await file_head.slice(20, 20 + ekey_len).arrayBuffer());
  const new_ekey = await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), new_key);
  if (new_ekey.length > 1024) {
    throw new Error("(Internal Error) This should not happen. Contact the application developer.");
  }
  const new_ekey_len = new_ekey.length;
  const new_ekey_len_bytes = new ArrayBuffer(4);
  const new_ekey_len_view = new DataView(new_ekey_len_bytes);
  new_ekey_len_view.setUint32(0, new_ekey_len, true);
  const new_ekey_parts = [headerBlob, new_ekey_len_bytes, str_encode(new_ekey)];
  const padding = new Uint8Array(1024 - new_ekey.length).fill(0);
  new_ekey_parts.push(padding);
  return new Blob(new_ekey_parts);
}
async function change_file_password(file_head, current_key, new_key, phrase = null, N = null) {
  if (!(file_head instanceof Blob)) throw new InvalidParameterException();
  if (typeof current_key !== "string" || typeof new_key !== "string") throw new InvalidParameterException();
  if (file_head.size < 1024 + 16 + 4) throw new BadDataException("Data not enough");
  const version = await GetFileVersion(async (start, end) => {
    return new Uint8Array(await file_head.slice(start, end).arrayBuffer());
  });
  if (version === ENCRYPTION_FILE_VER_1_1_0) return await change_file_password_1_1_0(file_head, current_key, new_key);
  const ekey_len = new DataView(await file_head.slice(20, 24).arrayBuffer()).getUint32(0, true);
  const ekey_ciphertext = str_decode(await file_head.slice(24, 24 + ekey_len).arrayBuffer());
  if (!N || !phrase) {
    const { N: _1, phrase: _2 } = await parse_ciphertext(ekey_ciphertext);
    if (!N) N = _1;
    if (!phrase) phrase = _2;
  }
  const new_ekey = await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), new_key, phrase, N);
  if (new_ekey.length > 1024) {
    throw new Error("(Internal Error) This should not happen. Contact the application developer.");
  }
  const new_ekey_len = new_ekey.length;
  const new_ekey_len_bytes = new ArrayBuffer(4);
  const new_ekey_len_view = new DataView(new_ekey_len_bytes);
  new_ekey_len_view.setUint32(0, new_ekey_len, true);
  const new_ekey_parts = [file_head.slice(0, 20), new_ekey_len_bytes, str_encode(new_ekey)];
  const padding = new Uint8Array(PADDING_SIZE - new_ekey.length - 4).fill(0);
  new_ekey_parts.push(padding);
  return new Blob(new_ekey_parts);
}

// src/context.js
var CRYPT_CONTEXT = /* @__PURE__ */ Object.create(null);
CRYPT_CONTEXT[Symbol.toStringTag] = "CryptContext";
CRYPT_CONTEXT["toString"] = function() {
  return `${this[Symbol.toStringTag]} Object`;
};
async function _await(PromiseLike) {
  if (PromiseLike instanceof Promise) return await PromiseLike;
  return PromiseLike;
}
async function crypt_context_create() {
  const ctx = Object.create(CRYPT_CONTEXT);
  Object.defineProperty(ctx, "_created", { value: true });
  return ctx;
}
async function crypt_context_destroy(ctx) {
  if (!ctx || ctx._released) throw new InvalidParameterException("Invalid context");
  for (const i of Reflect.ownKeys(ctx)) {
    if (typeof i === "symbol") {
      Reflect.deleteProperty(ctx, i);
      continue;
    }
    const o = Reflect.get(ctx, i);
    if (o) {
      if (o.release) await _await(o.release());
      else if (o.free) await _await(o.free());
      else if (o.reset) await _await(o.reset());
      else if (o.clear) await _await(o.clear());
    }
    if (!i.startsWith("_")) Reflect.deleteProperty(ctx, i);
  }
  Object.defineProperty(ctx, "_released", { value: true });
  return true;
}

// src/stream.js
var crypto4 = globalThis.crypto;
var InputStream = class {
  /** @type {((start: number, end: number, signal?: AbortSignal) => Promise<Uint8Array>) | null} */
  #reader;
  #cache = {
    position: 0,
    end: 0,
    /** @type {?Uint8Array} */
    data: null
  };
  #size;
  get [Symbol.toStringTag]() {
    return "Stream";
  }
  /**
   * @param {(start: number, end: number, signal?: AbortSignal) => Promise<Uint8Array>} reader The reader function
   * @param {number} size The size of the stream
   */
  constructor(reader, size) {
    if (typeof reader !== "function") throw new InvalidParameterException("Stream: Invalid reader");
    this.#reader = reader;
    if (typeof size !== "number") throw new InvalidParameterException("Stream: Invalid size");
    this.#size = size;
  }
  get size() {
    return this.#size;
  }
  /** @type {AbortController|null} */
  #abort_controller = null;
  /**
   * Read a stream
   * @param {Number} start start pos
   * @param {Number} end end pos
   * @param {Number|null} suggestion_end The suggested end. Used for caching.
   * @param {AbortController|null} abort The abort controller. Used for aborting the read.
   * @returns {Promise<Uint8Array>}
   */
  async read(start, end, suggestion_end = null, abort = null) {
    if (!this.#reader) throw new Error("Stream: The stream has been closed.");
    if (this.#cache.position != null && this.#cache.end && this.#cache.data && (start >= this.#cache.position && end <= this.#cache.end)) {
      return this.#cache.data.slice(start - this.#cache.position, end - this.#cache.position);
    }
    if (start < 0) throw new InvalidParameterException("Stream: Invalid start position");
    if (end > this.#size) end = this.#size;
    if (suggestion_end != null && suggestion_end > this.#size) suggestion_end = this.#size;
    this.#abort_controller = abort;
    if (suggestion_end != null && suggestion_end !== 0) {
      const data2 = await this.#reader(start, suggestion_end, abort?.signal);
      this.#abort_controller = null;
      this.#cache.position = start;
      this.#cache.end = start + data2.length;
      this.#cache.data = data2;
      return data2.slice(0, end - start);
    }
    const data = await this.#reader(start, end, abort?.signal);
    this.#abort_controller = null;
    return data;
  }
  abort() {
    this.#abort_controller?.abort();
  }
  purge() {
    this.#cache.position = this.#cache.end = 0;
    this.#cache.data = null;
  }
  close() {
    this.#reader = null;
    this.purge();
  }
};
async function decrypt_stream_init(ctx, stream, password, {
  cache = true,
  cache_max_size = 256 * 1024 * 1024
} = {}) {
  if (ctx._inited) throw new CryptContextReusedException();
  Object.defineProperty(ctx, "_inited", { value: true });
  ctx._type = "@decrypt_stream";
  ctx.stream = {
    stream,
    release: () => ctx.stream.stream.close()
  };
  const header = await stream.read(0, 13, 5e3);
  if (str_decode(header) !== "MyEncryption/") {
    throw new InvalidFileFormatException();
  }
  const top_header_version = str_decode(await stream.read(13, 16));
  if (!["1.1", "1.2"].includes(top_header_version)) {
    throw new EncryptionVersionMismatchException();
  }
  const version_marker = new DataView((await stream.read(16, 20)).buffer).getUint32(0, true);
  const version = normalize_version(top_header_version, version_marker);
  let read_pos = 16 + 4;
  if (version !== ENCRYPTION_FILE_VER_1_2_10020) {
    throw new NotSupportedException("Cannot perform a streamed decryption on V1.1 files");
  }
  const ekey_len = new DataView((await stream.read(read_pos, read_pos + 4)).buffer).getUint32(0, true);
  const ekey = str_decode(await stream.read(read_pos + 4, read_pos + 4 + ekey_len));
  read_pos += PADDING_SIZE;
  if (ekey_len > PADDING_SIZE) {
    throw new InternalError("(Internal Error) This should not happen. Contact the application developer.");
  }
  const key = await decrypt_data(ekey, password);
  const json_len_bytes = await stream.read(read_pos, read_pos + 4);
  const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const header_json = JSON.parse(
    str_decode(await stream.read(read_pos, read_pos + json_len))
  );
  read_pos += json_len;
  const header_version = header_json.v;
  if (![5.5].includes(header_version)) throw new EncryptionVersionMismatchException();
  const [phrase, salt_hex] = header_json.parameter.split(":");
  const salt = unhexlify(salt_hex);
  const iv4key = unhexlify(header_json.iv);
  const N = header_json.N;
  const chunk_size = Number(new DataView((await stream.read(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
  let nonce_counter = Number(new DataView((await stream.read(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
  read_pos += 16;
  const { derived_key } = await derive_key(key, iv4key, phrase, N, salt);
  const cryptoKey = await crypto4.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["decrypt"]);
  ctx.key = cryptoKey;
  ctx.chunk_size = chunk_size;
  ctx.nonce_counter = nonce_counter;
  ctx.header_json_length = json_len;
  ctx.cache_enabled = !!cache;
  ctx.cached_chunks = /* @__PURE__ */ new Map();
  ctx.cached_chunks_add_order = new Array();
  ctx.cached_size = 0;
  ctx.cache_max_size = cache_max_size;
  return true;
}
async function decrypt_stream(ctx, bytes_start, bytes_end, abort) {
  if (!ctx._inited) throw new CryptContextNotInitedException();
  if (ctx._type !== "@decrypt_stream") throw new InvalidCryptContextTypeException(ctx._type);
  if (ctx._released) throw new CryptContextReleasedException();
  const stream = ctx.stream.stream;
  const chunk_size = ctx.chunk_size;
  const nonce_counter_start = ctx.nonce_counter;
  const result = [];
  const chunks_start = 16 + 4 + PADDING_SIZE + 4 + ctx.header_json_length + 8 + 8;
  const size_per_chunk = chunk_size + 16;
  const max_chunk = Math.floor((stream.size - chunks_start - (32 + 8 + 32 + 8 + FILE_END_MARKER.length)) / size_per_chunk);
  const start_chunk = Math.max(0, Math.floor(bytes_start / chunk_size));
  const end_chunk = Math.min(max_chunk, Math.floor(bytes_end / chunk_size));
  if (end_chunk < 0 || start_chunk > max_chunk) throw new InvalidParameterException("Out of range");
  const read_chunk = async (chunk) => {
    if (ctx.cache_enabled && ctx.cached_chunks.has(chunk)) {
      return ctx.cached_chunks.get(chunk);
    }
    let pos = chunks_start + chunk * size_per_chunk;
    const eight_bytes = await stream.read(pos, pos + 8, pos + 2 * size_per_chunk, abort);
    let real_size = 0;
    if (eight_bytes.every((v, i) => v === END_IDENTIFIER[i])) {
      const full_bytes = await stream.read(pos, pos + 32, null, abort);
      pos += 32;
      if (full_bytes.every((v, i) => v === END_MARKER[i])) {
        return false;
      }
      if (full_bytes.every((v, i) => v === TAIL_BLOCK_MARKER[i])) {
        const chunk_len_bytes = await stream.read(pos, pos + 8, null, abort);
        pos += 8;
        real_size = Number(new DataView(chunk_len_bytes.buffer).getBigUint64(0, true));
        if (real_size === 0) return false;
      }
    }
    const ciphertext_length = real_size ? real_size : chunk_size;
    const ciphertext = await stream.read(pos, pos + ciphertext_length + 16, null, abort);
    const nonce_counter = nonce_counter_start + chunk;
    const iv_array = new ArrayBuffer(12);
    new DataView(iv_array).setBigUint64(4, BigInt(nonce_counter), true);
    try {
      const data = await crypto4.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(iv_array)
        },
        ctx.key,
        ciphertext
      );
      if (ctx.cache_enabled) {
        if (data.byteLength < ctx.cache_max_size) {
          ctx.cached_chunks_add_order.push(chunk);
          ctx.cached_chunks.set(chunk, data);
          ctx.cached_size += data.byteLength;
        }
        while (ctx.cached_size > ctx.cache_max_size) {
          const oldest_chunk = ctx.cached_chunks_add_order.shift();
          ctx.cached_size -= ctx.cached_chunks.get(oldest_chunk).byteLength;
          ctx.cached_chunks.delete(oldest_chunk);
        }
      }
      return data;
    } catch (e) {
      if (!e || !(e instanceof DOMException)) throw new InternalError(`Internal error.`, { cause: e });
      const name = e.name;
      if (name === "InvalidAccessError") throw new InvalidParameterException("InvalidAccessError.", { cause: e });
      if (name === "OperationError") throw new CannotDecryptException("Cannot decrypt. Did you provide the correct password?", { cause: e });
      throw new InternalError(`Unexpected error.`, { cause: e });
    }
  };
  let EOFbit = false;
  for (let i = start_chunk; i <= end_chunk; i++) {
    const decrypted_chunk = await read_chunk(i);
    if (!decrypted_chunk) {
      EOFbit = true;
      break;
    }
    result.push(decrypted_chunk);
  }
  const blob_full = new Blob(result);
  const startpos = start_chunk * chunk_size;
  const blob = blob_full.slice(bytes_start - startpos, bytes_end - startpos);
  if (EOFbit) blob.eof = true;
  return blob;
}

// src/internal-expose.js
var Internals = {
  PADDING_SIZE,
  END_IDENTIFIER,
  TAIL_BLOCK_MARKER,
  END_MARKER,
  FILE_END_MARKER,
  nextTick: nextTick2,
  GetFileVersion,
  GetFileInfo,
  GetFileChunkSize,
  derive_key_default_phrases_list: deriveKey__phrases,
  POWER_2_64
};

// src/util-wrappers.js
var util_wrappers_exports = {};
__export(util_wrappers_exports, {
  createReaderForFileSystemHandle: () => createReaderForFileSystemHandle,
  createReaderForLocalFile: () => createReaderForLocalFile,
  createReaderForRemoteObject: () => createReaderForRemoteObject,
  createWriterForFileSystemHandle: () => createWriterForFileSystemHandle,
  createWriterForMemoryBuffer: () => createWriterForMemoryBuffer
});
async function createReaderForLocalFile(file) {
  return async (start, end) => {
    return new Uint8Array(await file.slice(start, end).arrayBuffer());
  };
}
async function createReaderForFileSystemHandle(fileSystemHandle) {
  const file = await fileSystemHandle.getFile();
  return await createReaderForLocalFile(file);
}
async function createReaderForRemoteObject(url) {
  return async (start, end) => {
    const resp = await fetch(url, {
      headers: { Range: `bytes=${start}-${end - 1}` }
    });
    if (!resp.ok) throw new NetworkError(`Network Error: HTTP ${resp.status} : ${resp.statusText}`, {
      response: resp
    });
    return new Uint8Array(await resp.arrayBuffer());
  };
}
async function createWriterForFileSystemHandle(fileSystemHandle) {
  throw new DeprecationException();
}
async function createWriterForMemoryBuffer(bufferOutput) {
  return async (data) => {
    bufferOutput.push(data);
  };
}

// src/version.js
var VERSION = "Encryption/5.6 FileEncryption/1.2 Patch/56.6 Package/1.56.6";
export {
  CRYPT_CONTEXT as CryptContext,
  ENCRYPTION_FILE_VER_1_1_0,
  ENCRYPTION_FILE_VER_1_2_10020,
  exceptions_exports as Exceptions,
  InputStream,
  Internals,
  VERSION,
  util_wrappers_exports as Wrappers,
  change_file_password,
  crypt_context_create,
  crypt_context_destroy,
  decrypt_blob,
  decrypt_data,
  decrypt_file,
  decrypt_stream,
  decrypt_stream_init,
  derive_key,
  derive_key_for_file,
  encrypt_blob,
  encrypt_data,
  encrypt_file,
  export_master_key,
  get_random_bytes,
  get_random_int8_number,
  get_random_uint8_number,
  hexlify,
  is_encrypted_file,
  is_encrypted_message,
  normalize_version,
  parse_ciphertext,
  scrypt,
  scrypt_hex,
  str_decode,
  str_encode,
  unhexlify
};
//# sourceMappingURL=main.bundle.js.map
