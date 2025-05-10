// @ts-nocheck

const window2 = {};


! function () {
    const window = window2;
    var util;
    ! function (r) {
        function n(r) {
            return f ? new f(r) : new Array(r)
        }

        function o(r) {
            return f ? new f(r) : r
        }

        function t(r) {
            for (var o = r.length / 2, t = n(o), e = 0; e < o; e++) {
                var a = parseInt(r.substr(2 * e, 2), 16);
                if (isNaN(a)) throw Error("invalid hex data");
                t[e] = a
            }
            return t
        }

        function e(r) {
            for (var n = r.length, o = "", t = 0; t < n; t++) {
                var e = 255 & r[t],
                    a = e.toString(16);
                e < 16 && (a = "0" + a), o += a
            }
            return o
        }

        function a(r) {
            var n = window.TextEncoder;
            if (n) return (new n).encode(r);
            for (var t = [], e = 0, a = 0, i = encodeURI(r), c = i.length; e < c;) {
                var f = i.charCodeAt(e);
                if (37 == f) {
                    var s = i.substr(e + 1, 2);
                    f = parseInt(s, 16), e += 3
                } else e++;
                t[a++] = f
            }
            return o(t)
        }

        function i(r) {
            for (var n = r.length, o = "", t = 0; t < n; t++) {
                var e = r[t],
                    a = e.toString(16);
                e < 16 && (a = "0" + a), o += "%" + a
            }
            return decodeURIComponent(o)
        }

        function c(r) {
            r.style.cssText = "position:absolute;top:-999px"
        }
        var f = window.Uint8Array;
        r.hexToBytes = t, r.bytesToHex = e, r.strToBytes = a, r.bytesToStr = i, r.hideDom = c
    }(util || (util = {}));
    var asmjsLoader;
    ! function (loader) {
        function n() {
            return "Worker" in window
        }

        function load(resPath) {
            factory_object.__asmjs_cb = asmjsCallback;
            // var src = resPath + "asmjs.js",
            //     script = document.createElement("script");
            // script.onerror = function () {
            //     loader.onerror("script load fail")
            // }, script.src = src, document.body.appendChild(script)
            (async function () {
                try {
                    const text =
`
const window = globalThis["SCRYPTLOADERHASHTEXTTEXTTEXT"]
/// START ASM.JS
TEXTTEXTTEXTASMJSTEXTCONTENT
///END ASM.JS
`
                    
                    const blob = new Blob([text], { type: 'text/javascript' });
                    const url = URL.createObjectURL(blob);
                    await import(url); // should work now
                } catch {
                    loader.onerror("script load fail")
                }
            })();
        }

        function hashLoader(r, n, o) {
            scWorker.hash(r, n, o)
        }

        function configLoader(r, n, o, t, e, a, i) {
            scWorker.config.apply(this, arguments)
        }

        function i() {
            scWorker.stop()
        }

        function c() {
            scWorker.free()
        }

        function f() {
            scWorker && (scWorker.unload(), scWorker = null)
        }

        function asmjsCallback(eventName, data) {
            "onload" == eventName && (scWorker = data), loader[eventName](data)
            ; if (eventName === 'onload') delete globalThis["SCRYPTLOADERHASHTEXTTEXTTEXT"];
        }
        var scWorker;
        loader.check = n, loader.load = load, loader.hash = hashLoader, loader.config = configLoader, loader.stop = i, loader.free = c, loader.unload = f
    }(asmjsLoader || (asmjsLoader = {}));
    var flashLoader;
    var factory_object;
    ! function (factory) {
        function e() {
            // for (var r = f(), n = {}, o = 0; o < r.length; o++) n[r[o]] = !0;
            // var t = navigator.userAgent;
            // return /Chrome|Firefox|Edge|Safari/.test(t) && "asmjs" in n ? "asmjs" : "flash" in n ? "flash" : null
            return 'asmjs'
        }

        function a(r, n) {
            if (r) switch (arguments.length) {
                case 1:
                    return r();
                case 2:
                    return r(n)
            }
        }

        function i() {
            k && (clearTimeout(k), k = 0)
        }

        function hashScrypt(r, n, o) {
            if (T < 2) throw Error("scrypt not loaded");
            if (T < 4) throw Error("scrypt not configed");
            if (5 == T) throw Error("scrypt is running");
            if (T = 5, o = o || B, r = r || [], n = n || [], r.length > j) throw Error("pass.length > maxPassLen");
            if (n.length > A) throw Error("salt.length > maxSaltLen");
            if (o > B) throw Error("dkLen > maxDkLen");
            api.hash(r, n, o)
        }

        function f() {
            if (!E) {
                E = [];
                for (var r in b) b[r].check() && E.push(r)
            }
            return E
        }

        function loadScryptApi(r) {
            if (!(T >= 1)) {
                if (!r && (r = e(), !r)) throw Error("no available mod");
                if (api = b[r], !api) throw Error("unsupported mod: " + r);
                api.onload = function () {
                    i(), a(factory.onload)
                }, api.onerror = function (r) {
                    h(), a(factory.onerror, r)
                }, api.onready = function () {
                    T = 4, a(factory.onready)
                }, api.onprogress = function (r) {
                    a(factory.onprogress, r)
                }, api.oncomplete = function (r) {
                    T = 4, a(factory.onprogress, 1), a(factory.oncomplete, r)
                }, i(), k = setTimeout(function () {
                    h(), a(factory.onerror, "load timeout")
                }, L), T = 1, api.load(resPath)
            }
        }

        function stopScrypt() {
            api.stop(), T = 4
        }

        function l() {
            4 == T && (api.free(), T = 2)
        }

        function h() {
            0 != T && (api.unload(), T = 0), i()
        }

        function setScConfig(r, n, o) {
            if (!r) throw Error("config() takes at least 1 argument");
            var t = 0 | r.N;
            if (!(1 < t && t <= 8388608)) throw Error("param N out of range (1 < N <= 2^23)");
            if (t & t - 1) throw Error("param N must be power of 2");
            var e = 0 | r.r;
            if (!(0 < e && e < 256)) throw Error("param r out of range (0 < r < 256)");
            var a = 0 | r.P;
            if (!(0 < a && a < 256)) throw Error("param P out of range (0 < P < 256)");
            var i = t * e * 128;
            if (i > 1073741824) throw Error("memory limit exceeded (N * r * 128 > 1G)");
            if (n) {
                var c = n.maxPassLen;
                if (null == c) c = j;
                else if (c <= 0) throw Error("invalid maxPassLen");
                var f = n.maxSaltLen;
                if (null == f) f = A;
                else if (f <= 0) throw Error("invalid maxSaltLen");
                var s = n.maxDkLen;
                if (null == s) s = B;
                else if (s <= 0) throw Error("invalid maxDkLen");
                var u = n.maxThread;
                if (null == u) u = C;
                else if (u <= 0) throw Error("invalid maxThread");
                o || (j = 0 | c, A = 0 | f, B = 0 | s, C = 0 | u)
            }
            if (!o) {
                var l = Math.ceil(a / C),
                    h = Math.ceil(a / l);
                api.config(t, e, a, h, j, A, B), T = 3
            }
        }

        function v(n) {
            return util.strToBytes(n)
        }

        function m(n) {
            return util.bytesToStr(n)
        }

        function p(n) {
            if (n.length % 2) throw Error("invalid hex length");
            return util.hexToBytes(n)
        }

        function w(n) {
            return util.bytesToHex(n)
        }

        function setResPath(r) {
            /\/$/.test(r) || (r += "/"), resPath = r
        }

        function y(r) {
            L = r
        }
        var api, E, b = {
            asmjs: asmjsLoader,
            flash: flashLoader
        },
            T = 0,
            resPath = "",
            k = 0,
            L = 3e4,
            j = 64,
            A = 64,
            B = 64,
            C = 1;
        factory.hash = hashScrypt, factory.getAvailableMod = f, factory.load = loadScryptApi, factory.stop = stopScrypt, factory.free = l, factory.unload = h, factory.config = setScConfig, factory.strToBin = v, factory.binToStr = m, factory.hexToBin = p, factory.binToHex = w, factory.setResPath = setResPath, factory.setResTimeout = y, window.scrypt = factory
    }(factory_object || (factory_object = {}))
}();


globalThis["SCRYPTLOADERHASHTEXTTEXTTEXT"] = window2;
const scryptAPI = window2.scrypt;
scryptAPI.load();
//#include <scrypt-browser-impl.js>
