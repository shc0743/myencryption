var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/scrypt-js/scrypt.js
var require_scrypt = __commonJS({
  "node_modules/scrypt-js/scrypt.js"(exports, module) {
    "use strict";
    (function(root) {
      const MAX_VALUE = 2147483647;
      function SHA256(m) {
        const K = new Uint32Array([
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298
        ]);
        let h0 = 1779033703, h1 = 3144134277, h2 = 1013904242, h3 = 2773480762;
        let h4 = 1359893119, h5 = 2600822924, h6 = 528734635, h7 = 1541459225;
        const w = new Uint32Array(64);
        function blocks(p2) {
          let off = 0, len = p2.length;
          while (len >= 64) {
            let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7, u, i2, j, t1, t2;
            for (i2 = 0; i2 < 16; i2++) {
              j = off + i2 * 4;
              w[i2] = (p2[j] & 255) << 24 | (p2[j + 1] & 255) << 16 | (p2[j + 2] & 255) << 8 | p2[j + 3] & 255;
            }
            for (i2 = 16; i2 < 64; i2++) {
              u = w[i2 - 2];
              t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
              u = w[i2 - 15];
              t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
              w[i2] = (t1 + w[i2 - 7] | 0) + (t2 + w[i2 - 16] | 0) | 0;
            }
            for (i2 = 0; i2 < 64; i2++) {
              t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i2] + w[i2] | 0) | 0) | 0;
              t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
              h = g;
              g = f;
              f = e;
              e = d + t1 | 0;
              d = c;
              c = b;
              b = a;
              a = t1 + t2 | 0;
            }
            h0 = h0 + a | 0;
            h1 = h1 + b | 0;
            h2 = h2 + c | 0;
            h3 = h3 + d | 0;
            h4 = h4 + e | 0;
            h5 = h5 + f | 0;
            h6 = h6 + g | 0;
            h7 = h7 + h | 0;
            off += 64;
            len -= 64;
          }
        }
        blocks(m);
        let i, bytesLeft = m.length % 64, bitLenHi = m.length / 536870912 | 0, bitLenLo = m.length << 3, numZeros = bytesLeft < 56 ? 56 : 120, p = m.slice(m.length - bytesLeft, m.length);
        p.push(128);
        for (i = bytesLeft + 1; i < numZeros; i++) {
          p.push(0);
        }
        p.push(bitLenHi >>> 24 & 255);
        p.push(bitLenHi >>> 16 & 255);
        p.push(bitLenHi >>> 8 & 255);
        p.push(bitLenHi >>> 0 & 255);
        p.push(bitLenLo >>> 24 & 255);
        p.push(bitLenLo >>> 16 & 255);
        p.push(bitLenLo >>> 8 & 255);
        p.push(bitLenLo >>> 0 & 255);
        blocks(p);
        return [
          h0 >>> 24 & 255,
          h0 >>> 16 & 255,
          h0 >>> 8 & 255,
          h0 >>> 0 & 255,
          h1 >>> 24 & 255,
          h1 >>> 16 & 255,
          h1 >>> 8 & 255,
          h1 >>> 0 & 255,
          h2 >>> 24 & 255,
          h2 >>> 16 & 255,
          h2 >>> 8 & 255,
          h2 >>> 0 & 255,
          h3 >>> 24 & 255,
          h3 >>> 16 & 255,
          h3 >>> 8 & 255,
          h3 >>> 0 & 255,
          h4 >>> 24 & 255,
          h4 >>> 16 & 255,
          h4 >>> 8 & 255,
          h4 >>> 0 & 255,
          h5 >>> 24 & 255,
          h5 >>> 16 & 255,
          h5 >>> 8 & 255,
          h5 >>> 0 & 255,
          h6 >>> 24 & 255,
          h6 >>> 16 & 255,
          h6 >>> 8 & 255,
          h6 >>> 0 & 255,
          h7 >>> 24 & 255,
          h7 >>> 16 & 255,
          h7 >>> 8 & 255,
          h7 >>> 0 & 255
        ];
      }
      function PBKDF2_HMAC_SHA256_OneIter(password, salt, dkLen) {
        password = password.length <= 64 ? password : SHA256(password);
        const innerLen = 64 + salt.length + 4;
        const inner = new Array(innerLen);
        const outerKey = new Array(64);
        let i;
        let dk = [];
        for (i = 0; i < 64; i++) {
          inner[i] = 54;
        }
        for (i = 0; i < password.length; i++) {
          inner[i] ^= password[i];
        }
        for (i = 0; i < salt.length; i++) {
          inner[64 + i] = salt[i];
        }
        for (i = innerLen - 4; i < innerLen; i++) {
          inner[i] = 0;
        }
        for (i = 0; i < 64; i++) outerKey[i] = 92;
        for (i = 0; i < password.length; i++) outerKey[i] ^= password[i];
        function incrementCounter() {
          for (let i2 = innerLen - 1; i2 >= innerLen - 4; i2--) {
            inner[i2]++;
            if (inner[i2] <= 255) return;
            inner[i2] = 0;
          }
        }
        while (dkLen >= 32) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))));
          dkLen -= 32;
        }
        if (dkLen > 0) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))).slice(0, dkLen));
        }
        return dk;
      }
      function blockmix_salsa8(BY, Yi, r, x, _X) {
        let i;
        arraycopy(BY, (2 * r - 1) * 16, _X, 0, 16);
        for (i = 0; i < 2 * r; i++) {
          blockxor(BY, i * 16, _X, 16);
          salsa20_8(_X, x);
          arraycopy(_X, 0, BY, Yi + i * 16, 16);
        }
        for (i = 0; i < r; i++) {
          arraycopy(BY, Yi + i * 2 * 16, BY, i * 16, 16);
        }
        for (i = 0; i < r; i++) {
          arraycopy(BY, Yi + (i * 2 + 1) * 16, BY, (i + r) * 16, 16);
        }
      }
      function R(a, b) {
        return a << b | a >>> 32 - b;
      }
      function salsa20_8(B, x) {
        arraycopy(B, 0, x, 0, 16);
        for (let i = 8; i > 0; i -= 2) {
          x[4] ^= R(x[0] + x[12], 7);
          x[8] ^= R(x[4] + x[0], 9);
          x[12] ^= R(x[8] + x[4], 13);
          x[0] ^= R(x[12] + x[8], 18);
          x[9] ^= R(x[5] + x[1], 7);
          x[13] ^= R(x[9] + x[5], 9);
          x[1] ^= R(x[13] + x[9], 13);
          x[5] ^= R(x[1] + x[13], 18);
          x[14] ^= R(x[10] + x[6], 7);
          x[2] ^= R(x[14] + x[10], 9);
          x[6] ^= R(x[2] + x[14], 13);
          x[10] ^= R(x[6] + x[2], 18);
          x[3] ^= R(x[15] + x[11], 7);
          x[7] ^= R(x[3] + x[15], 9);
          x[11] ^= R(x[7] + x[3], 13);
          x[15] ^= R(x[11] + x[7], 18);
          x[1] ^= R(x[0] + x[3], 7);
          x[2] ^= R(x[1] + x[0], 9);
          x[3] ^= R(x[2] + x[1], 13);
          x[0] ^= R(x[3] + x[2], 18);
          x[6] ^= R(x[5] + x[4], 7);
          x[7] ^= R(x[6] + x[5], 9);
          x[4] ^= R(x[7] + x[6], 13);
          x[5] ^= R(x[4] + x[7], 18);
          x[11] ^= R(x[10] + x[9], 7);
          x[8] ^= R(x[11] + x[10], 9);
          x[9] ^= R(x[8] + x[11], 13);
          x[10] ^= R(x[9] + x[8], 18);
          x[12] ^= R(x[15] + x[14], 7);
          x[13] ^= R(x[12] + x[15], 9);
          x[14] ^= R(x[13] + x[12], 13);
          x[15] ^= R(x[14] + x[13], 18);
        }
        for (let i = 0; i < 16; ++i) {
          B[i] += x[i];
        }
      }
      function blockxor(S, Si, D, len) {
        for (let i = 0; i < len; i++) {
          D[i] ^= S[Si + i];
        }
      }
      function arraycopy(src, srcPos, dest, destPos, length) {
        while (length--) {
          dest[destPos++] = src[srcPos++];
        }
      }
      function checkBufferish(o) {
        if (!o || typeof o.length !== "number") {
          return false;
        }
        for (let i = 0; i < o.length; i++) {
          const v = o[i];
          if (typeof v !== "number" || v % 1 || v < 0 || v >= 256) {
            return false;
          }
        }
        return true;
      }
      function ensureInteger(value, name) {
        if (typeof value !== "number" || value % 1) {
          throw new Error("invalid " + name);
        }
        return value;
      }
      function _scrypt(password, salt, N, r, p, dkLen, callback) {
        N = ensureInteger(N, "N");
        r = ensureInteger(r, "r");
        p = ensureInteger(p, "p");
        dkLen = ensureInteger(dkLen, "dkLen");
        if (N === 0 || (N & N - 1) !== 0) {
          throw new Error("N must be power of 2");
        }
        if (N > MAX_VALUE / 128 / r) {
          throw new Error("N too large");
        }
        if (r > MAX_VALUE / 128 / p) {
          throw new Error("r too large");
        }
        if (!checkBufferish(password)) {
          throw new Error("password must be an array or buffer");
        }
        password = Array.prototype.slice.call(password);
        if (!checkBufferish(salt)) {
          throw new Error("salt must be an array or buffer");
        }
        salt = Array.prototype.slice.call(salt);
        let b = PBKDF2_HMAC_SHA256_OneIter(password, salt, p * 128 * r);
        const B = new Uint32Array(p * 32 * r);
        for (let i = 0; i < B.length; i++) {
          const j = i * 4;
          B[i] = (b[j + 3] & 255) << 24 | (b[j + 2] & 255) << 16 | (b[j + 1] & 255) << 8 | (b[j + 0] & 255) << 0;
        }
        const XY = new Uint32Array(64 * r);
        const V = new Uint32Array(32 * r * N);
        const Yi = 32 * r;
        const x = new Uint32Array(16);
        const _X = new Uint32Array(16);
        const totalOps = p * N * 2;
        let currentOp = 0;
        let lastPercent10 = null;
        let stop = false;
        let state = 0;
        let i0 = 0, i1;
        let Bi;
        const limit = callback ? parseInt(1e3 / r) : 4294967295;
        const nextTick2 = typeof setImmediate !== "undefined" ? setImmediate : setTimeout;
        const incrementalSMix = function() {
          if (stop) {
            return callback(new Error("cancelled"), currentOp / totalOps);
          }
          let steps;
          switch (state) {
            case 0:
              Bi = i0 * 32 * r;
              arraycopy(B, Bi, XY, 0, Yi);
              state = 1;
              i1 = 0;
            // Fall through
            case 1:
              steps = N - i1;
              if (steps > limit) {
                steps = limit;
              }
              for (let i = 0; i < steps; i++) {
                arraycopy(XY, 0, V, (i1 + i) * Yi, Yi);
                blockmix_salsa8(XY, Yi, r, x, _X);
              }
              i1 += steps;
              currentOp += steps;
              if (callback) {
                const percent10 = parseInt(1e3 * currentOp / totalOps);
                if (percent10 !== lastPercent10) {
                  stop = callback(null, currentOp / totalOps);
                  if (stop) {
                    break;
                  }
                  lastPercent10 = percent10;
                }
              }
              if (i1 < N) {
                break;
              }
              i1 = 0;
              state = 2;
            // Fall through
            case 2:
              steps = N - i1;
              if (steps > limit) {
                steps = limit;
              }
              for (let i = 0; i < steps; i++) {
                const offset = (2 * r - 1) * 16;
                const j = XY[offset] & N - 1;
                blockxor(V, j * Yi, XY, Yi);
                blockmix_salsa8(XY, Yi, r, x, _X);
              }
              i1 += steps;
              currentOp += steps;
              if (callback) {
                const percent10 = parseInt(1e3 * currentOp / totalOps);
                if (percent10 !== lastPercent10) {
                  stop = callback(null, currentOp / totalOps);
                  if (stop) {
                    break;
                  }
                  lastPercent10 = percent10;
                }
              }
              if (i1 < N) {
                break;
              }
              arraycopy(XY, 0, B, Bi, Yi);
              i0++;
              if (i0 < p) {
                state = 0;
                break;
              }
              b = [];
              for (let i = 0; i < B.length; i++) {
                b.push(B[i] >> 0 & 255);
                b.push(B[i] >> 8 & 255);
                b.push(B[i] >> 16 & 255);
                b.push(B[i] >> 24 & 255);
              }
              const derivedKey = PBKDF2_HMAC_SHA256_OneIter(password, b, dkLen);
              if (callback) {
                callback(null, 1, derivedKey);
              }
              return derivedKey;
          }
          if (callback) {
            nextTick2(incrementalSMix);
          }
        };
        if (!callback) {
          while (true) {
            const derivedKey = incrementalSMix();
            if (derivedKey != void 0) {
              return derivedKey;
            }
          }
        }
        incrementalSMix();
      }
      const lib = {
        scrypt: function(password, salt, N, r, p, dkLen, progressCallback) {
          return new Promise(function(resolve, reject) {
            let lastProgress = 0;
            if (progressCallback) {
              progressCallback(0);
            }
            _scrypt(password, salt, N, r, p, dkLen, function(error, progress, key) {
              if (error) {
                reject(error);
              } else if (key) {
                if (progressCallback && lastProgress !== 1) {
                  progressCallback(1);
                }
                resolve(new Uint8Array(key));
              } else if (progressCallback && progress !== lastProgress) {
                lastProgress = progress;
                return progressCallback(progress);
              }
            });
          });
        },
        syncScrypt: function(password, salt, N, r, p, dkLen) {
          return new Uint8Array(_scrypt(password, salt, N, r, p, dkLen));
        }
      };
      if (typeof exports !== "undefined") {
        module.exports = lib;
      } else if (typeof define === "function" && define.amd) {
        define(lib);
      } else if (root) {
        if (root.scrypt) {
          root._scrypt = root.scrypt;
        }
        root.scrypt = lib;
      }
    })(exports);
  }
});

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
  EncryptionAlgorithmNotSupportedException: () => EncryptionAlgorithmNotSupportedException,
  EncryptionError: () => EncryptionError,
  EncryptionVersionMismatchException: () => EncryptionVersionMismatchException,
  EndOfFileException: () => EndOfFileException,
  FileCorruptedException: () => FileCorruptedException,
  IVException: () => IVException,
  InternalError: () => InternalError,
  InvalidCryptContextTypeException: () => InvalidCryptContextTypeException,
  InvalidEndMarkerException: () => InvalidEndMarkerException,
  InvalidFileFormatException: () => InvalidFileFormatException,
  InvalidParameterException: () => InvalidParameterException,
  InvalidScryptParameterException: () => InvalidScryptParameterException,
  NotSupportedException: () => NotSupportedException,
  OperationNotPermittedException: () => OperationNotPermittedException
});
var EncryptionError = class extends Error {
  constructor(message = "Encryption Error", additional = void 0) {
    super(message, additional);
    this.name = "EncryptionError";
  }
};
var InternalError = class extends EncryptionError {
  constructor(message = "(Internal Error)", additional = void 0) {
    super(message, additional);
    this.name = "InternalError";
  }
};
var InvalidParameterException = class extends EncryptionError {
  constructor(message = "The parameter provided is invalid.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidParameterException";
  }
};
var BadDataException = class extends EncryptionError {
  constructor(message = "The data is bad.", additional = void 0) {
    super(message, additional);
    this.name = "BadDataException";
  }
};
var InvalidScryptParameterException = class extends EncryptionError {
  constructor(message = "The N, r, or p is not valid or out of range.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidScryptParameterException";
  }
};
var EncryptionVersionMismatchException = class extends EncryptionError {
  constructor(message = "The version of the encryption library doesn't match.", additional = void 0) {
    super(message, additional);
    this.name = "EncryptionVersionMismatchException";
  }
};
var InvalidFileFormatException = class extends EncryptionError {
  constructor(message = "The file format is invalid.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidFileFormatException";
  }
};
var IVException = class extends EncryptionError {
  constructor(message = "IV Exception.", additional = void 0) {
    super(message, additional);
    this.name = "IVException";
  }
};
var FileCorruptedException = class extends EncryptionError {
  constructor(message = "File is corrupted.", additional = void 0) {
    super(message, additional);
    this.name = "FileCorruptedException";
  }
};
var InvalidEndMarkerException = class extends EncryptionError {
  constructor(message = "The end marker is invalid.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidEndMarkerException";
  }
};
var CannotDecryptException = class extends EncryptionError {
  constructor(message = "Cannot decrypt", additional = void 0) {
    super(message, additional);
    this.name = "CannotDecryptException";
  }
};
var CryptContextReusedException = class extends EncryptionError {
  constructor(message = "Not allowed to reuse a crypt context.", additional = void 0) {
    super(message, additional);
    this.name = "CryptContextReusedException";
  }
};
var NotSupportedException = class extends EncryptionError {
  constructor(message = "Operation not supported", additional = void 0) {
    super(message, additional);
    this.name = "NotSupportedException";
  }
};
var EndOfFileException = class extends EncryptionError {
  constructor(message = "End of File", additional = void 0) {
    super(message, additional);
    this.name = "EndOfFileException";
  }
};
var CryptContextNotInitedException = class extends EncryptionError {
  constructor(message = "Crypt context is not initialized.", additional = void 0) {
    super(message, additional);
    this.name = "CryptContextNotInitedException";
  }
};
var InvalidCryptContextTypeException = class extends EncryptionError {
  constructor(message = "Invalid crypt context type.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidCryptContextTypeException";
  }
};
var CryptContextReleasedException = class extends EncryptionError {
  constructor(message = "Crypt context has been released.", additional = void 0) {
    super(message, additional);
    this.name = "CryptContextReleasedException";
  }
};
var OperationNotPermittedException = class extends EncryptionError {
  constructor(message = "Operation not permitted.", additional = void 0) {
    super(message, additional);
    this.name = "OperationNotPermittedException";
  }
};
var EncryptionAlgorithmNotSupportedException = class extends EncryptionError {
  constructor(message = "The specified encryption algorithm is not supported.", additional = void 0) {
    super(message, additional);
    this.name = "EncryptionAlgorithmNotSupportedException";
  }
};
var ChaCha20NotSupportedException = class extends EncryptionAlgorithmNotSupportedException {
  constructor(message = "ChaCha20 is not supported yet.", additional = void 0) {
    super(message, additional);
    this.name = "ChaCha20NotSupportedException";
  }
};
var DangerousEncryptionAlgorithmException = class extends EncryptionAlgorithmNotSupportedException {
  constructor(message = "The specified encryption algorithm is DANGEROUS.", additional = void 0) {
    super(message, additional);
    this.name = "DangerousEncryptionAlgorithmException";
  }
};

// src/scrypt-layer/scrypt-node.js
var import_scrypt_js = __toESM(require_scrypt(), 1);
function scrypt(key, salt, N, r, p, dklen, onprogress = null) {
  return (0, import_scrypt_js.scrypt)(key, salt, N, r, p, dklen, onprogress ? (progress) => {
    onprogress(progress);
  } : void 0);
}

// src/derive_key.js
var deriveKey__phrases = ["Furina", "Neuvillette", "Venti", "Nahida", "Kinich", "Kazuha"];
async function derive_key(key, iv, phrase = null, N = null, salt = null, r = 8, p = 1, dklen = 32) {
  if (N === null) N = 262144;
  if (typeof N !== "number" || N > 2097152) {
    throw new InvalidScryptParameterException();
  }
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
async function scrypt_hex(key, salt, N, r, p, dklen) {
  return hexlify(await scrypt(str_encode(key), str_encode(salt), N, r, p, dklen));
}

// src/encrypt_data.js
function safeparse(json) {
  try {
    return JSON.parse(json);
  } catch {
    throw new InvalidParameterException("The JSON is not valid.");
  }
}
async function encrypt_data(message, key, phrase = null, N = null) {
  const iv = get_random_bytes(12);
  const { derived_key, parameter, N: N2 } = await derive_key(key, iv, phrase, N);
  N = N2;
  const cipher = await crypto.subtle.importKey("raw", derived_key, "AES-GCM", false, ["encrypt"]);
  if (typeof message !== "string") {
    throw new OperationNotPermittedException("The ability to directly encrypt binary data has been removed in the new version. Please use `encrypt_file` instead.");
  }
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    cipher,
    str_encode(message)
  );
  const encrypted_message = new Uint8Array(iv.length + ciphertext.byteLength);
  encrypted_message.set(iv, 0);
  encrypted_message.set(new Uint8Array(ciphertext), iv.length);
  const message_encrypted = hexlify(encrypted_message);
  return JSON.stringify({
    data: message_encrypted,
    parameter,
    N,
    v: 5.6
  });
}
async function decrypt_data(message_encrypted, key) {
  const jsoned = safeparse(message_encrypted);
  const parameter = jsoned.parameter;
  const N = parseInt(jsoned.N);
  const encrypted_data = unhexlify(jsoned.data);
  const [phrase, salt_b64] = parameter.split(":");
  const salt = unhexlify(salt_b64);
  if (isNaN(N) || !parameter || !encrypted_data || !salt) throw new BadDataException("The message or parameters are bad.");
  if (encrypted_data.length < 28) throw new BadDataException("The message was too short.");
  const iv = encrypted_data.slice(0, 12);
  const ciphertext = encrypted_data.slice(12, -16);
  const tag = encrypted_data.slice(-16);
  const derived_key = typeof key === "string" ? (await derive_key(key, iv, phrase, N, salt)).derived_key : key;
  const cipher = await crypto.subtle.importKey("raw", derived_key, "AES-GCM", false, ["decrypt"]);
  try {
    const decrypted_data = await crypto.subtle.decrypt(
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
    if (!e) throw new InternalError(`Internal error.`, { cause: e });
    const name = e.name;
    if (name === "InvalidAccessError") throw new InvalidParameterException("InvalidAccessError.", { cause: e });
    if (name === "OperationError") throw new CannotDecryptException("Cannot decrypt. Did you provide the correct password?", { cause: e });
    if (!e) throw new InternalError(`Unexpected error.`, { cause: e });
  }
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
var timerproc = typeof process === "undefined" ? requestAnimationFrame : (
  // browser
  setTimeout
);
function nextTick() {
  return new Promise((r) => timerproc(r));
}
function normalize_version(major_version, version_marker) {
  if (!major_version) return `Unknown Version`;
  if (String(major_version) === "1.1") version_marker = null;
  if (!version_marker) return `${major_version}/0`;
  return `${major_version}/${version_marker}`;
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
    read_pos += PADDING_SIZE;
    const json_len_bytes = await file_reader(read_pos, read_pos + 4);
    const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
    read_pos += 4;
    read_pos += json_len;
    const chunk_size = Number(new DataView((await file_reader(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
    let nonce_counter = Number(new DataView((await file_reader(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
    return { version, chunk_size, nonce_counter };
  }
  throw new EncryptionVersionMismatchException();
}
async function GetFileChunkSize(file_reader) {
  return (await GetFileInfo(file_reader)).chunk_size;
}

// src/encrypt_file.js
async function encrypt_file(file_reader, file_writer, user_key, callback = null, phrase = null, N = null, chunk_size = 32 * 1024 * 1024) {
  if (!chunk_size) throw new InvalidParameterException("chunk_size must be greater than 0.");
  await file_writer(str_encode("MyEncryption/1.2"));
  const VERSION_MARKER = 10020;
  const versionMarkerBuffer = new ArrayBuffer(4);
  new DataView(versionMarkerBuffer).setUint32(0, VERSION_MARKER, true);
  await file_writer(new Uint8Array(versionMarkerBuffer));
  const key = hexlify(get_random_bytes(64));
  const ekey = await encrypt_data(key, user_key);
  const ekey_bytes = str_encode(ekey);
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
  await nextTick();
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
  let nonce_counter = 1;
  let position = 0;
  const nonce_counter_start = new ArrayBuffer(8);
  new DataView(nonce_counter_start).setBigUint64(0, BigInt(nonce_counter), true);
  await file_writer(new Uint8Array(nonce_counter_start));
  callback?.(0);
  const cryptoKey = await crypto.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["encrypt"]);
  while (true) {
    const chunk = await file_reader(position, position + chunk_size);
    if (!(chunk instanceof Uint8Array)) throw new BadDataException("The file chunk is not a Uint8Array.");
    if (chunk.length === 0) break;
    const isFinalChunk = chunk.length < chunk_size;
    const iv = new ArrayBuffer(12);
    if (nonce_counter >= 2 ** 64 || nonce_counter >= Number.MAX_SAFE_INTEGER) {
      throw new IVException("nonce_counter exceeded the maximum value.");
    }
    new DataView(iv).setBigUint64(4, BigInt(nonce_counter), true);
    nonce_counter++;
    if (isFinalChunk) {
      await file_writer(new Uint8Array(TAIL_BLOCK_MARKER));
      const chunkLengthBuffer = new ArrayBuffer(8);
      new DataView(chunkLengthBuffer).setBigUint64(0, BigInt(chunk.length), true);
      await file_writer(new Uint8Array(chunkLengthBuffer));
    }
    const ivArray = new Uint8Array(iv);
    const ciphertext = await crypto.subtle.encrypt(
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
  await nextTick();
  const { derived_key } = await derive_key(key, iv4key, phrase, N, salt);
  let total_bytes = 0;
  const cryptoKey = await crypto.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["decrypt"]);
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
    const decrypted = await crypto.subtle.decrypt(
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
  const chunk_size = Number(new DataView((await file_reader(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
  let nonce_counter = Number(new DataView((await file_reader(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
  read_pos += 16;
  callback?.(0);
  await nextTick();
  const derived_key = typeof user_key === "string" ? (await derive_key(key, iv4key, phrase, N, salt)).derived_key : user_key;
  let total_bytes = 0, is_final_chunk = false;
  const cryptoKey = await crypto.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["decrypt"]);
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
      const decrypted = await crypto.subtle.decrypt(
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
      if (!e) throw new InternalError(`Internal error.`, { cause: e });
      const name = e.name;
      if (name === "InvalidAccessError") throw new InvalidParameterException("InvalidAccessError.", { cause: e });
      if (name === "OperationError") throw new CannotDecryptException("Cannot decrypt. Did you provide the correct password?", { cause: e });
      if (!e) throw new InternalError(`Unexpected error.`, { cause: e });
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

// src/key_management.js
async function export_master_key(file_head, current_key, export_key) {
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
  if (file_head.size < 1024 + 16 + 4) throw new Error("Data not enough");
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
async function change_file_password(file_head, current_key, new_key) {
  if (file_head.size < 1024 + 16 + 4) throw new Error("Data not enough");
  const version = await GetFileVersion(async (start, end) => {
    return new Uint8Array(await file_head.slice(start, end).arrayBuffer());
  });
  if (version === ENCRYPTION_FILE_VER_1_1_0) return await change_file_password_1_1_0(file_head, current_key, new_key);
  const ekey_len = new DataView(await file_head.slice(20, 24).arrayBuffer()).getUint32(0, true);
  const ekey_ciphertext = str_decode(await file_head.slice(24, 24 + ekey_len).arrayBuffer());
  const new_ekey = await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), new_key);
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
var Stream = class {
  #reader = null;
  #cache = {
    position: null,
    end: null,
    data: null
  };
  #size = null;
  get [Symbol.toStringTag]() {
    return "Stream";
  }
  /**
   * @param {function(number, number, AbortSignal): Promise<Uint8Array>} reader The reader function
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
    if (suggestion_end > this.#size) suggestion_end = this.#size;
    this.#abort_controller = abort;
    if (suggestion_end) {
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
    this.#cache.position = this.#cache.data = this.#cache.end = null;
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
  const cryptoKey = await crypto.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["decrypt"]);
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
      const data = await crypto.subtle.decrypt(
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
      if (!e) throw new InternalError(`Internal error.`, { cause: e });
      const name = e.name;
      if (name === "InvalidAccessError") throw new InvalidParameterException("InvalidAccessError.", { cause: e });
      if (name === "OperationError") throw new CannotDecryptException("Cannot decrypt. Did you provide the correct password?", { cause: e });
      if (!e) throw new InternalError(`Unexpected error.`, { cause: e });
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
  nextTick,
  GetFileVersion,
  GetFileInfo,
  GetFileChunkSize
};

// src/version.js
var VERSION = "Encryption/5.6 FileEncryption/1.2 Patch/5.1";
export {
  ENCRYPTION_FILE_VER_1_1_0,
  ENCRYPTION_FILE_VER_1_2_10020,
  exceptions_exports as Exceptions,
  Internals,
  Stream,
  VERSION,
  change_file_password,
  crypt_context_create,
  crypt_context_destroy,
  decrypt_data,
  decrypt_file,
  decrypt_stream,
  decrypt_stream_init,
  derive_key,
  encrypt_data,
  encrypt_file,
  export_master_key,
  get_random_bytes,
  get_random_int8_number,
  get_random_uint8_number,
  hexlify,
  normalize_version,
  scrypt,
  scrypt_hex,
  str_decode,
  str_encode,
  unhexlify
};
//# sourceMappingURL=main.bundle.node.js.map
