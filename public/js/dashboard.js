! function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = { exports: {} };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s
}({
    1: [function() {}, {}],
    2: [function(require, module, exports) {
        (function(global) {
            "use strict";

            function typedArraySupport() {
                function Bar() {}
                try {
                    var arr = new Uint8Array(1);
                    return arr.foo = function() {
                        return 42
                    }, arr.constructor = Bar, 42 === arr.foo() && arr.constructor === Bar && "function" == typeof arr.subarray && 0 === arr.subarray(1, 1).byteLength
                } catch (e) {
                    return !1
                }
            }

            function kMaxLength() {
                return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
            }

            function Buffer(arg) {
                return this instanceof Buffer ? (Buffer.TYPED_ARRAY_SUPPORT || (this.length = 0, this.parent = void 0), "number" == typeof arg ? fromNumber(this, arg) : "string" == typeof arg ? fromString(this, arg, arguments.length > 1 ? arguments[1] : "utf8") : fromObject(this, arg)) : arguments.length > 1 ? new Buffer(arg, arguments[1]) : new Buffer(arg)
            }

            function fromNumber(that, length) {
                if (that = allocate(that, 0 > length ? 0 : 0 | checked(length)), !Buffer.TYPED_ARRAY_SUPPORT)
                    for (var i = 0; length > i; i++) that[i] = 0;
                return that
            }

            function fromString(that, string, encoding) {
                ("string" != typeof encoding || "" === encoding) && (encoding = "utf8");
                var length = 0 | byteLength(string, encoding);
                return that = allocate(that, length), that.write(string, encoding), that
            }

            function fromObject(that, object) {
                if (Buffer.isBuffer(object)) return fromBuffer(that, object);
                if (isArray(object)) return fromArray(that, object);
                if (null == object) throw new TypeError("must start with number, buffer, array or string");
                if ("undefined" != typeof ArrayBuffer) {
                    if (object.buffer instanceof ArrayBuffer) return fromTypedArray(that, object);
                    if (object instanceof ArrayBuffer) return fromArrayBuffer(that, object)
                }
                return object.length ? fromArrayLike(that, object) : fromJsonObject(that, object)
            }

            function fromBuffer(that, buffer) {
                var length = 0 | checked(buffer.length);
                return that = allocate(that, length), buffer.copy(that, 0, 0, length), that
            }

            function fromArray(that, array) {
                var length = 0 | checked(array.length);
                that = allocate(that, length);
                for (var i = 0; length > i; i += 1) that[i] = 255 & array[i];
                return that
            }

            function fromTypedArray(that, array) {
                var length = 0 | checked(array.length);
                that = allocate(that, length);
                for (var i = 0; length > i; i += 1) that[i] = 255 & array[i];
                return that
            }

            function fromArrayBuffer(that, array) {
                return Buffer.TYPED_ARRAY_SUPPORT ? (array.byteLength, that = Buffer._augment(new Uint8Array(array))) : that = fromTypedArray(that, new Uint8Array(array)), that
            }

            function fromArrayLike(that, array) {
                var length = 0 | checked(array.length);
                that = allocate(that, length);
                for (var i = 0; length > i; i += 1) that[i] = 255 & array[i];
                return that
            }

            function fromJsonObject(that, object) {
                var array, length = 0;
                "Buffer" === object.type && isArray(object.data) && (array = object.data, length = 0 | checked(array.length)), that = allocate(that, length);
                for (var i = 0; length > i; i += 1) that[i] = 255 & array[i];
                return that
            }

            function allocate(that, length) {
                Buffer.TYPED_ARRAY_SUPPORT ? (that = Buffer._augment(new Uint8Array(length)), that.__proto__ = Buffer.prototype) : (that.length = length, that._isBuffer = !0);
                var fromPool = 0 !== length && length <= Buffer.poolSize >>> 1;
                return fromPool && (that.parent = rootParent), that
            }

            function checked(length) {
                if (length >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
                return 0 | length
            }

            function SlowBuffer(subject, encoding) {
                if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);
                var buf = new Buffer(subject, encoding);
                return delete buf.parent, buf
            }

            function byteLength(string, encoding) {
                "string" != typeof string && (string = "" + string);
                var len = string.length;
                if (0 === len) return 0;
                for (var loweredCase = !1;;) switch (encoding) {
                    case "ascii":
                    case "binary":
                    case "raw":
                    case "raws":
                        return len;
                    case "utf8":
                    case "utf-8":
                        return utf8ToBytes(string).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * len;
                    case "hex":
                        return len >>> 1;
                    case "base64":
                        return base64ToBytes(string).length;
                    default:
                        if (loweredCase) return utf8ToBytes(string).length;
                        encoding = ("" + encoding).toLowerCase(), loweredCase = !0
                }
            }

            function slowToString(encoding, start, end) {
                var loweredCase = !1;
                if (start = 0 | start, end = void 0 === end || end === 1 / 0 ? this.length : 0 | end, encoding || (encoding = "utf8"), 0 > start && (start = 0), end > this.length && (end = this.length), start >= end) return "";
                for (;;) switch (encoding) {
                    case "hex":
                        return hexSlice(this, start, end);
                    case "utf8":
                    case "utf-8":
                        return utf8Slice(this, start, end);
                    case "ascii":
                        return asciiSlice(this, start, end);
                    case "binary":
                        return binarySlice(this, start, end);
                    case "base64":
                        return base64Slice(this, start, end);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return utf16leSlice(this, start, end);
                    default:
                        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
                        encoding = (encoding + "").toLowerCase(), loweredCase = !0
                }
            }

            function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0;
                var remaining = buf.length - offset;
                length ? (length = Number(length), length > remaining && (length = remaining)) : length = remaining;
                var strLen = string.length;
                if (strLen % 2 !== 0) throw new Error("Invalid hex string");
                length > strLen / 2 && (length = strLen / 2);
                for (var i = 0; length > i; i++) {
                    var parsed = parseInt(string.substr(2 * i, 2), 16);
                    if (isNaN(parsed)) throw new Error("Invalid hex string");
                    buf[offset + i] = parsed
                }
                return i
            }

            function utf8Write(buf, string, offset, length) {
                return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
            }

            function asciiWrite(buf, string, offset, length) {
                return blitBuffer(asciiToBytes(string), buf, offset, length)
            }

            function binaryWrite(buf, string, offset, length) {
                return asciiWrite(buf, string, offset, length)
            }

            function base64Write(buf, string, offset, length) {
                return blitBuffer(base64ToBytes(string), buf, offset, length)
            }

            function ucs2Write(buf, string, offset, length) {
                return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
            }

            function base64Slice(buf, start, end) {
                return base64.fromByteArray(0 === start && end === buf.length ? buf : buf.slice(start, end))
            }

            function utf8Slice(buf, start, end) {
                end = Math.min(buf.length, end);
                for (var res = [], i = start; end > i;) {
                    var firstByte = buf[i],
                        codePoint = null,
                        bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
                    if (end >= i + bytesPerSequence) {
                        var secondByte, thirdByte, fourthByte, tempCodePoint;
                        switch (bytesPerSequence) {
                            case 1:
                                128 > firstByte && (codePoint = firstByte);
                                break;
                            case 2:
                                secondByte = buf[i + 1], 128 === (192 & secondByte) && (tempCodePoint = (31 & firstByte) << 6 | 63 & secondByte, tempCodePoint > 127 && (codePoint = tempCodePoint));
                                break;
                            case 3:
                                secondByte = buf[i + 1], thirdByte = buf[i + 2], 128 === (192 & secondByte) && 128 === (192 & thirdByte) && (tempCodePoint = (15 & firstByte) << 12 | (63 & secondByte) << 6 | 63 & thirdByte, tempCodePoint > 2047 && (55296 > tempCodePoint || tempCodePoint > 57343) && (codePoint = tempCodePoint));
                                break;
                            case 4:
                                secondByte = buf[i + 1], thirdByte = buf[i + 2], fourthByte = buf[i + 3], 128 === (192 & secondByte) && 128 === (192 & thirdByte) && 128 === (192 & fourthByte) && (tempCodePoint = (15 & firstByte) << 18 | (63 & secondByte) << 12 | (63 & thirdByte) << 6 | 63 & fourthByte, tempCodePoint > 65535 && 1114112 > tempCodePoint && (codePoint = tempCodePoint))
                        }
                    }
                    null === codePoint ? (codePoint = 65533, bytesPerSequence = 1) : codePoint > 65535 && (codePoint -= 65536, res.push(codePoint >>> 10 & 1023 | 55296), codePoint = 56320 | 1023 & codePoint), res.push(codePoint), i += bytesPerSequence
                }
                return decodeCodePointsArray(res)
            }

            function decodeCodePointsArray(codePoints) {
                var len = codePoints.length;
                if (MAX_ARGUMENTS_LENGTH >= len) return String.fromCharCode.apply(String, codePoints);
                for (var res = "", i = 0; len > i;) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
                return res
            }

            function asciiSlice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for (var i = start; end > i; i++) ret += String.fromCharCode(127 & buf[i]);
                return ret
            }

            function binarySlice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for (var i = start; end > i; i++) ret += String.fromCharCode(buf[i]);
                return ret
            }

            function hexSlice(buf, start, end) {
                var len = buf.length;
                (!start || 0 > start) && (start = 0), (!end || 0 > end || end > len) && (end = len);
                for (var out = "", i = start; end > i; i++) out += toHex(buf[i]);
                return out
            }

            function utf16leSlice(buf, start, end) {
                for (var bytes = buf.slice(start, end), res = "", i = 0; i < bytes.length; i += 2) res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
                return res
            }

            function checkOffset(offset, ext, length) {
                if (offset % 1 !== 0 || 0 > offset) throw new RangeError("offset is not uint");
                if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length")
            }

            function checkInt(buf, value, offset, ext, max, min) {
                if (!Buffer.isBuffer(buf)) throw new TypeError("buffer must be a Buffer instance");
                if (value > max || min > value) throw new RangeError("value is out of bounds");
                if (offset + ext > buf.length) throw new RangeError("index out of range")
            }

            function objectWriteUInt16(buf, value, offset, littleEndian) {
                0 > value && (value = 65535 + value + 1);
                for (var i = 0, j = Math.min(buf.length - offset, 2); j > i; i++) buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> 8 * (littleEndian ? i : 1 - i)
            }

            function objectWriteUInt32(buf, value, offset, littleEndian) {
                0 > value && (value = 4294967295 + value + 1);
                for (var i = 0, j = Math.min(buf.length - offset, 4); j > i; i++) buf[offset + i] = value >>> 8 * (littleEndian ? i : 3 - i) & 255
            }

            function checkIEEE754(buf, value, offset, ext, max, min) {
                if (value > max || min > value) throw new RangeError("value is out of bounds");
                if (offset + ext > buf.length) throw new RangeError("index out of range");
                if (0 > offset) throw new RangeError("index out of range")
            }

            function writeFloat(buf, value, offset, littleEndian, noAssert) {
                return noAssert || checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -3.4028234663852886e38), ieee754.write(buf, value, offset, littleEndian, 23, 4), offset + 4
            }

            function writeDouble(buf, value, offset, littleEndian, noAssert) {
                return noAssert || checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -1.7976931348623157e308), ieee754.write(buf, value, offset, littleEndian, 52, 8), offset + 8
            }

            function base64clean(str) {
                if (str = stringtrim(str).replace(INVALID_BASE64_RE, ""), str.length < 2) return "";
                for (; str.length % 4 !== 0;) str += "=";
                return str
            }

            function stringtrim(str) {
                return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "")
            }

            function toHex(n) {
                return 16 > n ? "0" + n.toString(16) : n.toString(16)
            }

            function utf8ToBytes(string, units) {
                units = units || 1 / 0;
                for (var codePoint, length = string.length, leadSurrogate = null, bytes = [], i = 0; length > i; i++) {
                    if (codePoint = string.charCodeAt(i), codePoint > 55295 && 57344 > codePoint) {
                        if (!leadSurrogate) {
                            if (codePoint > 56319) {
                                (units -= 3) > -1 && bytes.push(239, 191, 189);
                                continue
                            }
                            if (i + 1 === length) {
                                (units -= 3) > -1 && bytes.push(239, 191, 189);
                                continue
                            }
                            leadSurrogate = codePoint;
                            continue
                        }
                        if (56320 > codePoint) {
                            (units -= 3) > -1 && bytes.push(239, 191, 189), leadSurrogate = codePoint;
                            continue
                        }
                        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536
                    } else leadSurrogate && (units -= 3) > -1 && bytes.push(239, 191, 189);
                    if (leadSurrogate = null, 128 > codePoint) {
                        if ((units -= 1) < 0) break;
                        bytes.push(codePoint)
                    } else if (2048 > codePoint) {
                        if ((units -= 2) < 0) break;
                        bytes.push(codePoint >> 6 | 192, 63 & codePoint | 128)
                    } else if (65536 > codePoint) {
                        if ((units -= 3) < 0) break;
                        bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, 63 & codePoint | 128)
                    } else {
                        if (!(1114112 > codePoint)) throw new Error("Invalid code point");
                        if ((units -= 4) < 0) break;
                        bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, 63 & codePoint | 128)
                    }
                }
                return bytes
            }

            function asciiToBytes(str) {
                for (var byteArray = [], i = 0; i < str.length; i++) byteArray.push(255 & str.charCodeAt(i));
                return byteArray
            }

            function utf16leToBytes(str, units) {
                for (var c, hi, lo, byteArray = [], i = 0; i < str.length && !((units -= 2) < 0); i++) c = str.charCodeAt(i), hi = c >> 8, lo = c % 256, byteArray.push(lo), byteArray.push(hi);
                return byteArray
            }

            function base64ToBytes(str) {
                return base64.toByteArray(base64clean(str))
            }

            function blitBuffer(src, dst, offset, length) {
                for (var i = 0; length > i && !(i + offset >= dst.length || i >= src.length); i++) dst[i + offset] = src[i];
                return i
            }
            var base64 = require("base64-js"),
                ieee754 = require("ieee754"),
                isArray = require("isarray");
            exports.Buffer = Buffer, exports.SlowBuffer = SlowBuffer, exports.INSPECT_MAX_BYTES = 50, Buffer.poolSize = 8192;
            var rootParent = {};
            Buffer.TYPED_ARRAY_SUPPORT = void 0 !== global.TYPED_ARRAY_SUPPORT ? global.TYPED_ARRAY_SUPPORT : typedArraySupport(), Buffer.TYPED_ARRAY_SUPPORT ? (Buffer.prototype.__proto__ = Uint8Array.prototype, Buffer.__proto__ = Uint8Array) : (Buffer.prototype.length = void 0, Buffer.prototype.parent = void 0), Buffer.isBuffer = function(b) {
                return !(null == b || !b._isBuffer)
            }, Buffer.compare = function(a, b) {
                if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("Arguments must be Buffers");
                if (a === b) return 0;
                for (var x = a.length, y = b.length, i = 0, len = Math.min(x, y); len > i && a[i] === b[i];) ++i;
                return i !== len && (x = a[i], y = b[i]), y > x ? -1 : x > y ? 1 : 0
            }, Buffer.isEncoding = function(encoding) {
                switch (String(encoding).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "raw":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return !0;
                    default:
                        return !1
                }
            }, Buffer.concat = function(list, length) {
                if (!isArray(list)) throw new TypeError("list argument must be an Array of Buffers.");
                if (0 === list.length) return new Buffer(0);
                var i;
                if (void 0 === length)
                    for (length = 0, i = 0; i < list.length; i++) length += list[i].length;
                var buf = new Buffer(length),
                    pos = 0;
                for (i = 0; i < list.length; i++) {
                    var item = list[i];
                    item.copy(buf, pos), pos += item.length
                }
                return buf
            }, Buffer.byteLength = byteLength, Buffer.prototype.toString = function() {
                var length = 0 | this.length;
                return 0 === length ? "" : 0 === arguments.length ? utf8Slice(this, 0, length) : slowToString.apply(this, arguments)
            }, Buffer.prototype.equals = function(b) {
                if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
                return this === b ? !0 : 0 === Buffer.compare(this, b)
            }, Buffer.prototype.inspect = function() {
                var str = "",
                    max = exports.INSPECT_MAX_BYTES;
                return this.length > 0 && (str = this.toString("hex", 0, max).match(/.{2}/g).join(" "), this.length > max && (str += " ... ")), "<Buffer " + str + ">"
            }, Buffer.prototype.compare = function(b) {
                if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
                return this === b ? 0 : Buffer.compare(this, b)
            }, Buffer.prototype.indexOf = function(val, byteOffset) {
                function arrayIndexOf(arr, val, byteOffset) {
                    for (var foundIndex = -1, i = 0; byteOffset + i < arr.length; i++)
                        if (arr[byteOffset + i] === val[-1 === foundIndex ? 0 : i - foundIndex]) {
                            if (-1 === foundIndex && (foundIndex = i), i - foundIndex + 1 === val.length) return byteOffset + foundIndex
                        } else foundIndex = -1;
                    return -1
                }
                if (byteOffset > 2147483647 ? byteOffset = 2147483647 : -2147483648 > byteOffset && (byteOffset = -2147483648), byteOffset >>= 0, 0 === this.length) return -1;
                if (byteOffset >= this.length) return -1;
                if (0 > byteOffset && (byteOffset = Math.max(this.length + byteOffset, 0)), "string" == typeof val) return 0 === val.length ? -1 : String.prototype.indexOf.call(this, val, byteOffset);
                if (Buffer.isBuffer(val)) return arrayIndexOf(this, val, byteOffset);
                if ("number" == typeof val) return Buffer.TYPED_ARRAY_SUPPORT && "function" === Uint8Array.prototype.indexOf ? Uint8Array.prototype.indexOf.call(this, val, byteOffset) : arrayIndexOf(this, [val], byteOffset);
                throw new TypeError("val must be string, number or Buffer")
            }, Buffer.prototype.get = function(offset) {
                return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(offset)
            }, Buffer.prototype.set = function(v, offset) {
                return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(v, offset)
            }, Buffer.prototype.write = function(string, offset, length, encoding) {
                if (void 0 === offset) encoding = "utf8", length = this.length, offset = 0;
                else if (void 0 === length && "string" == typeof offset) encoding = offset, length = this.length, offset = 0;
                else if (isFinite(offset)) offset = 0 | offset, isFinite(length) ? (length = 0 | length, void 0 === encoding && (encoding = "utf8")) : (encoding = length, length = void 0);
                else {
                    var swap = encoding;
                    encoding = offset, offset = 0 | length, length = swap
                }
                var remaining = this.length - offset;
                if ((void 0 === length || length > remaining) && (length = remaining), string.length > 0 && (0 > length || 0 > offset) || offset > this.length) throw new RangeError("attempt to write outside buffer bounds");
                encoding || (encoding = "utf8");
                for (var loweredCase = !1;;) switch (encoding) {
                    case "hex":
                        return hexWrite(this, string, offset, length);
                    case "utf8":
                    case "utf-8":
                        return utf8Write(this, string, offset, length);
                    case "ascii":
                        return asciiWrite(this, string, offset, length);
                    case "binary":
                        return binaryWrite(this, string, offset, length);
                    case "base64":
                        return base64Write(this, string, offset, length);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return ucs2Write(this, string, offset, length);
                    default:
                        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
                        encoding = ("" + encoding).toLowerCase(), loweredCase = !0
                }
            }, Buffer.prototype.toJSON = function() {
                return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) }
            };
            var MAX_ARGUMENTS_LENGTH = 4096;
            Buffer.prototype.slice = function(start, end) {
                var len = this.length;
                start = ~~start, end = void 0 === end ? len : ~~end, 0 > start ? (start += len, 0 > start && (start = 0)) : start > len && (start = len), 0 > end ? (end += len, 0 > end && (end = 0)) : end > len && (end = len), start > end && (end = start);
                var newBuf;
                if (Buffer.TYPED_ARRAY_SUPPORT) newBuf = Buffer._augment(this.subarray(start, end));
                else {
                    var sliceLen = end - start;
                    newBuf = new Buffer(sliceLen, void 0);
                    for (var i = 0; sliceLen > i; i++) newBuf[i] = this[i + start]
                }
                return newBuf.length && (newBuf.parent = this.parent || this), newBuf
            }, Buffer.prototype.readUIntLE = function(offset, byteLength, noAssert) {
                offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkOffset(offset, byteLength, this.length);
                for (var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 256);) val += this[offset + i] * mul;
                return val
            }, Buffer.prototype.readUIntBE = function(offset, byteLength, noAssert) {
                offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkOffset(offset, byteLength, this.length);
                for (var val = this[offset + --byteLength], mul = 1; byteLength > 0 && (mul *= 256);) val += this[offset + --byteLength] * mul;
                return val
            }, Buffer.prototype.readUInt8 = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 1, this.length), this[offset]
            }, Buffer.prototype.readUInt16LE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 2, this.length), this[offset] | this[offset + 1] << 8
            }, Buffer.prototype.readUInt16BE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 2, this.length), this[offset] << 8 | this[offset + 1]
            }, Buffer.prototype.readUInt32LE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 16777216 * this[offset + 3]
            }, Buffer.prototype.readUInt32BE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), 16777216 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3])
            }, Buffer.prototype.readIntLE = function(offset, byteLength, noAssert) {
                offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkOffset(offset, byteLength, this.length);
                for (var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 256);) val += this[offset + i] * mul;
                return mul *= 128, val >= mul && (val -= Math.pow(2, 8 * byteLength)), val
            }, Buffer.prototype.readIntBE = function(offset, byteLength, noAssert) {
                offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkOffset(offset, byteLength, this.length);
                for (var i = byteLength, mul = 1, val = this[offset + --i]; i > 0 && (mul *= 256);) val += this[offset + --i] * mul;
                return mul *= 128, val >= mul && (val -= Math.pow(2, 8 * byteLength)), val
            }, Buffer.prototype.readInt8 = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 1, this.length), 128 & this[offset] ? -1 * (255 - this[offset] + 1) : this[offset]
            }, Buffer.prototype.readInt16LE = function(offset, noAssert) {
                noAssert || checkOffset(offset, 2, this.length);
                var val = this[offset] | this[offset + 1] << 8;
                return 32768 & val ? 4294901760 | val : val
            }, Buffer.prototype.readInt16BE = function(offset, noAssert) {
                noAssert || checkOffset(offset, 2, this.length);
                var val = this[offset + 1] | this[offset] << 8;
                return 32768 & val ? 4294901760 | val : val
            }, Buffer.prototype.readInt32LE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24
            }, Buffer.prototype.readInt32BE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]
            }, Buffer.prototype.readFloatLE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), ieee754.read(this, offset, !0, 23, 4)
            }, Buffer.prototype.readFloatBE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), ieee754.read(this, offset, !1, 23, 4)
            }, Buffer.prototype.readDoubleLE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 8, this.length), ieee754.read(this, offset, !0, 52, 8)
            }, Buffer.prototype.readDoubleBE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 8, this.length), ieee754.read(this, offset, !1, 52, 8)
            }, Buffer.prototype.writeUIntLE = function(value, offset, byteLength, noAssert) {
                value = +value, offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
                var mul = 1,
                    i = 0;
                for (this[offset] = 255 & value; ++i < byteLength && (mul *= 256);) this[offset + i] = value / mul & 255;
                return offset + byteLength
            }, Buffer.prototype.writeUIntBE = function(value, offset, byteLength, noAssert) {
                value = +value, offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
                var i = byteLength - 1,
                    mul = 1;
                for (this[offset + i] = 255 & value; --i >= 0 && (mul *= 256);) this[offset + i] = value / mul & 255;
                return offset + byteLength
            }, Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 1, 255, 0), Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value)), this[offset] = 255 & value, offset + 1
            }, Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = 255 & value, this[offset + 1] = value >>> 8) : objectWriteUInt16(this, value, offset, !0), offset + 2
            }, Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 8, this[offset + 1] = 255 & value) : objectWriteUInt16(this, value, offset, !1), offset + 2
            }, Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset + 3] = value >>> 24, this[offset + 2] = value >>> 16, this[offset + 1] = value >>> 8, this[offset] = 255 & value) : objectWriteUInt32(this, value, offset, !0), offset + 4
            }, Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 255 & value) : objectWriteUInt32(this, value, offset, !1), offset + 4
            }, Buffer.prototype.writeIntLE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset = 0 | offset, !noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit)
                }
                var i = 0,
                    mul = 1,
                    sub = 0 > value ? 1 : 0;
                for (this[offset] = 255 & value; ++i < byteLength && (mul *= 256);) this[offset + i] = (value / mul >> 0) - sub & 255;
                return offset + byteLength
            }, Buffer.prototype.writeIntBE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset = 0 | offset, !noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit)
                }
                var i = byteLength - 1,
                    mul = 1,
                    sub = 0 > value ? 1 : 0;
                for (this[offset + i] = 255 & value; --i >= 0 && (mul *= 256);) this[offset + i] = (value / mul >> 0) - sub & 255;
                return offset + byteLength
            }, Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 1, 127, -128), Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value)), 0 > value && (value = 255 + value + 1), this[offset] = 255 & value, offset + 1
            }, Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = 255 & value, this[offset + 1] = value >>> 8) : objectWriteUInt16(this, value, offset, !0), offset + 2
            }, Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 8, this[offset + 1] = 255 & value) : objectWriteUInt16(this, value, offset, !1), offset + 2
            }, Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = 255 & value, this[offset + 1] = value >>> 8, this[offset + 2] = value >>> 16, this[offset + 3] = value >>> 24) : objectWriteUInt32(this, value, offset, !0), offset + 4
            }, Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648), 0 > value && (value = 4294967295 + value + 1), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 255 & value) : objectWriteUInt32(this, value, offset, !1), offset + 4
            }, Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
                return writeFloat(this, value, offset, !0, noAssert)
            }, Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
                return writeFloat(this, value, offset, !1, noAssert)
            }, Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
                return writeDouble(this, value, offset, !0, noAssert)
            }, Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
                return writeDouble(this, value, offset, !1, noAssert)
            }, Buffer.prototype.copy = function(target, targetStart, start, end) {
                if (start || (start = 0), end || 0 === end || (end = this.length), targetStart >= target.length && (targetStart = target.length), targetStart || (targetStart = 0), end > 0 && start > end && (end = start), end === start) return 0;
                if (0 === target.length || 0 === this.length) return 0;
                if (0 > targetStart) throw new RangeError("targetStart out of bounds");
                if (0 > start || start >= this.length) throw new RangeError("sourceStart out of bounds");
                if (0 > end) throw new RangeError("sourceEnd out of bounds");
                end > this.length && (end = this.length), target.length - targetStart < end - start && (end = target.length - targetStart + start);
                var i, len = end - start;
                if (this === target && targetStart > start && end > targetStart)
                    for (i = len - 1; i >= 0; i--) target[i + targetStart] = this[i + start];
                else if (1e3 > len || !Buffer.TYPED_ARRAY_SUPPORT)
                    for (i = 0; len > i; i++) target[i + targetStart] = this[i + start];
                else target._set(this.subarray(start, start + len), targetStart);
                return len
            }, Buffer.prototype.fill = function(value, start, end) {
                if (value || (value = 0), start || (start = 0), end || (end = this.length), start > end) throw new RangeError("end < start");
                if (end !== start && 0 !== this.length) {
                    if (0 > start || start >= this.length) throw new RangeError("start out of bounds");
                    if (0 > end || end > this.length) throw new RangeError("end out of bounds");
                    var i;
                    if ("number" == typeof value)
                        for (i = start; end > i; i++) this[i] = value;
                    else {
                        var bytes = utf8ToBytes(value.toString()),
                            len = bytes.length;
                        for (i = start; end > i; i++) this[i] = bytes[i % len]
                    }
                    return this
                }
            }, Buffer.prototype.toArrayBuffer = function() {
                if ("undefined" != typeof Uint8Array) {
                    if (Buffer.TYPED_ARRAY_SUPPORT) return new Buffer(this).buffer;
                    for (var buf = new Uint8Array(this.length), i = 0, len = buf.length; len > i; i += 1) buf[i] = this[i];
                    return buf.buffer
                }
                throw new TypeError("Buffer.toArrayBuffer not supported in this browser")
            };
            var BP = Buffer.prototype;
            Buffer._augment = function(arr) {
                return arr.constructor = Buffer, arr._isBuffer = !0, arr._set = arr.set, arr.get = BP.get, arr.set = BP.set, arr.write = BP.write, arr.toString = BP.toString, arr.toLocaleString = BP.toString, arr.toJSON = BP.toJSON, arr.equals = BP.equals, arr.compare = BP.compare, arr.indexOf = BP.indexOf, arr.copy = BP.copy, arr.slice = BP.slice, arr.readUIntLE = BP.readUIntLE, arr.readUIntBE = BP.readUIntBE, arr.readUInt8 = BP.readUInt8, arr.readUInt16LE = BP.readUInt16LE, arr.readUInt16BE = BP.readUInt16BE, arr.readUInt32LE = BP.readUInt32LE, arr.readUInt32BE = BP.readUInt32BE, arr.readIntLE = BP.readIntLE, arr.readIntBE = BP.readIntBE, arr.readInt8 = BP.readInt8, arr.readInt16LE = BP.readInt16LE, arr.readInt16BE = BP.readInt16BE, arr.readInt32LE = BP.readInt32LE, arr.readInt32BE = BP.readInt32BE, arr.readFloatLE = BP.readFloatLE, arr.readFloatBE = BP.readFloatBE, arr.readDoubleLE = BP.readDoubleLE, arr.readDoubleBE = BP.readDoubleBE, arr.writeUInt8 = BP.writeUInt8, arr.writeUIntLE = BP.writeUIntLE, arr.writeUIntBE = BP.writeUIntBE, arr.writeUInt16LE = BP.writeUInt16LE, arr.writeUInt16BE = BP.writeUInt16BE, arr.writeUInt32LE = BP.writeUInt32LE, arr.writeUInt32BE = BP.writeUInt32BE, arr.writeIntLE = BP.writeIntLE, arr.writeIntBE = BP.writeIntBE, arr.writeInt8 = BP.writeInt8, arr.writeInt16LE = BP.writeInt16LE, arr.writeInt16BE = BP.writeInt16BE, arr.writeInt32LE = BP.writeInt32LE, arr.writeInt32BE = BP.writeInt32BE, arr.writeFloatLE = BP.writeFloatLE, arr.writeFloatBE = BP.writeFloatBE, arr.writeDoubleLE = BP.writeDoubleLE, arr.writeDoubleBE = BP.writeDoubleBE, arr.fill = BP.fill, arr.inspect = BP.inspect, arr.toArrayBuffer = BP.toArrayBuffer, arr
            };
            var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, { "base64-js": 3, ieee754: 4, isarray: 5 }],
    3: [function(require, module, exports) {
        var lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        ! function(exports) {
            "use strict";

            function decode(elt) {
                var code = elt.charCodeAt(0);
                return code === PLUS || code === PLUS_URL_SAFE ? 62 : code === SLASH || code === SLASH_URL_SAFE ? 63 : NUMBER > code ? -1 : NUMBER + 10 > code ? code - NUMBER + 26 + 26 : UPPER + 26 > code ? code - UPPER : LOWER + 26 > code ? code - LOWER + 26 : void 0
            }

            function b64ToByteArray(b64) {
                function push(v) { arr[L++] = v }
                var i, j, l, tmp, placeHolders, arr;
                if (b64.length % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                var len = b64.length;
                placeHolders = "=" === b64.charAt(len - 2) ? 2 : "=" === b64.charAt(len - 1) ? 1 : 0, arr = new Arr(3 * b64.length / 4 - placeHolders), l = placeHolders > 0 ? b64.length - 4 : b64.length;
                var L = 0;
                for (i = 0, j = 0; l > i; i += 4, j += 3) tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3)), push((16711680 & tmp) >> 16), push((65280 & tmp) >> 8), push(255 & tmp);
                return 2 === placeHolders ? (tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4, push(255 & tmp)) : 1 === placeHolders && (tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2, push(tmp >> 8 & 255), push(255 & tmp)), arr
            }

            function uint8ToBase64(uint8) {
                function encode(num) {
                    return lookup.charAt(num)
                }

                function tripletToBase64(num) {
                    return encode(num >> 18 & 63) + encode(num >> 12 & 63) + encode(num >> 6 & 63) + encode(63 & num)
                }
                var i, temp, length, extraBytes = uint8.length % 3,
                    output = "";
                for (i = 0, length = uint8.length - extraBytes; length > i; i += 3) temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2], output += tripletToBase64(temp);
                switch (extraBytes) {
                    case 1:
                        temp = uint8[uint8.length - 1], output += encode(temp >> 2), output += encode(temp << 4 & 63), output += "==";
                        break;
                    case 2:
                        temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1], output += encode(temp >> 10), output += encode(temp >> 4 & 63), output += encode(temp << 2 & 63), output += "="
                }
                return output
            }
            var Arr = "undefined" != typeof Uint8Array ? Uint8Array : Array,
                PLUS = "+".charCodeAt(0),
                SLASH = "/".charCodeAt(0),
                NUMBER = "0".charCodeAt(0),
                LOWER = "a".charCodeAt(0),
                UPPER = "A".charCodeAt(0),
                PLUS_URL_SAFE = "-".charCodeAt(0),
                SLASH_URL_SAFE = "_".charCodeAt(0);
            exports.toByteArray = b64ToByteArray, exports.fromByteArray = uint8ToBase64
        }("undefined" == typeof exports ? this.base64js = {} : exports)
    }, {}],
    4: [function(require, module, exports) {
        exports.read = function(buffer, offset, isLE, mLen, nBytes) {
            var e, m, eLen = 8 * nBytes - mLen - 1,
                eMax = (1 << eLen) - 1,
                eBias = eMax >> 1,
                nBits = -7,
                i = isLE ? nBytes - 1 : 0,
                d = isLE ? -1 : 1,
                s = buffer[offset + i];
            for (i += d, e = s & (1 << -nBits) - 1, s >>= -nBits, nBits += eLen; nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8);
            for (m = e & (1 << -nBits) - 1, e >>= -nBits, nBits += mLen; nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8);
            if (0 === e) e = 1 - eBias;
            else {
                if (e === eMax) return m ? 0 / 0 : (s ? -1 : 1) * (1 / 0);
                m += Math.pow(2, mLen), e -= eBias
            }
            return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
        }, exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
            var e, m, c, eLen = 8 * nBytes - mLen - 1,
                eMax = (1 << eLen) - 1,
                eBias = eMax >> 1,
                rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                i = isLE ? 0 : nBytes - 1,
                d = isLE ? 1 : -1,
                s = 0 > value || 0 === value && 0 > 1 / value ? 1 : 0;
            for (value = Math.abs(value), isNaN(value) || value === 1 / 0 ? (m = isNaN(value) ? 1 : 0, e = eMax) : (e = Math.floor(Math.log(value) / Math.LN2), value * (c = Math.pow(2, -e)) < 1 && (e--, c *= 2), value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias), value * c >= 2 && (e++, c /= 2), e + eBias >= eMax ? (m = 0, e = eMax) : e + eBias >= 1 ? (m = (value * c - 1) * Math.pow(2, mLen), e += eBias) : (m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen), e = 0)); mLen >= 8; buffer[offset + i] = 255 & m, i += d, m /= 256, mLen -= 8);
            for (e = e << mLen | m, eLen += mLen; eLen > 0; buffer[offset + i] = 255 & e,
                i += d, e /= 256, eLen -= 8);
            buffer[offset + i - d] |= 128 * s
        }
    }, {}],
    5: [function(require, module) {
        var toString = {}.toString;
        module.exports = Array.isArray || function(arr) {
            return "[object Array]" == toString.call(arr)
        }
    }, {}],
    6: [function(require, module) {
        function EventEmitter() { this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0 }

        function isFunction(arg) {
            return "function" == typeof arg
        }

        function isNumber(arg) {
            return "number" == typeof arg
        }

        function isObject(arg) {
            return "object" == typeof arg && null !== arg
        }

        function isUndefined(arg) {
            return void 0 === arg
        }
        module.exports = EventEmitter, EventEmitter.EventEmitter = EventEmitter, EventEmitter.prototype._events = void 0, EventEmitter.prototype._maxListeners = void 0, EventEmitter.defaultMaxListeners = 10, EventEmitter.prototype.setMaxListeners = function(n) {
            if (!isNumber(n) || 0 > n || isNaN(n)) throw TypeError("n must be a positive number");
            return this._maxListeners = n, this
        }, EventEmitter.prototype.emit = function(type) {
            var er, handler, len, args, i, listeners;
            if (this._events || (this._events = {}), "error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
                if (er = arguments[1], er instanceof Error) throw er;
                var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
                throw err.context = er, err
            }
            if (handler = this._events[type], isUndefined(handler)) return !1;
            if (isFunction(handler)) switch (arguments.length) {
                    case 1:
                        handler.call(this);
                        break;
                    case 2:
                        handler.call(this, arguments[1]);
                        break;
                    case 3:
                        handler.call(this, arguments[1], arguments[2]);
                        break;
                    default:
                        args = Array.prototype.slice.call(arguments, 1), handler.apply(this, args)
                } else if (isObject(handler))
                    for (args = Array.prototype.slice.call(arguments, 1), listeners = handler.slice(), len = listeners.length, i = 0; len > i; i++) listeners[i].apply(this, args);
            return !0
        }, EventEmitter.prototype.addListener = function(type, listener) {
            var m;
            if (!isFunction(listener)) throw TypeError("listener must be a function");
            return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener), this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [this._events[type], listener] : this._events[type] = listener, isObject(this._events[type]) && !this._events[type].warned && (m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners, m && m > 0 && this._events[type].length > m && (this._events[type].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length), "function" == typeof console.trace && console.trace())), this
        }, EventEmitter.prototype.on = EventEmitter.prototype.addListener, EventEmitter.prototype.once = function(type, listener) {
            function g() { this.removeListener(type, g), fired || (fired = !0, listener.apply(this, arguments)) }
            if (!isFunction(listener)) throw TypeError("listener must be a function");
            var fired = !1;
            return g.listener = listener, this.on(type, g), this
        }, EventEmitter.prototype.removeListener = function(type, listener) {
            var list, position, length, i;
            if (!isFunction(listener)) throw TypeError("listener must be a function");
            if (!this._events || !this._events[type]) return this;
            if (list = this._events[type], length = list.length, position = -1, list === listener || isFunction(list.listener) && list.listener === listener) delete this._events[type], this._events.removeListener && this.emit("removeListener", type, listener);
            else if (isObject(list)) {
                for (i = length; i-- > 0;)
                    if (list[i] === listener || list[i].listener && list[i].listener === listener) {
                        position = i;
                        break
                    }
                if (0 > position) return this;
                1 === list.length ? (list.length = 0, delete this._events[type]) : list.splice(position, 1), this._events.removeListener && this.emit("removeListener", type, listener)
            }
            return this
        }, EventEmitter.prototype.removeAllListeners = function(type) {
            var key, listeners;
            if (!this._events) return this;
            if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type], this;
            if (0 === arguments.length) {
                for (key in this._events) "removeListener" !== key && this.removeAllListeners(key);
                return this.removeAllListeners("removeListener"), this._events = {}, this
            }
            if (listeners = this._events[type], isFunction(listeners)) this.removeListener(type, listeners);
            else if (listeners)
                for (; listeners.length;) this.removeListener(type, listeners[listeners.length - 1]);
            return delete this._events[type], this
        }, EventEmitter.prototype.listeners = function(type) {
            var ret;
            return ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [this._events[type]] : this._events[type].slice() : []
        }, EventEmitter.prototype.listenerCount = function(type) {
            if (this._events) {
                var evlistener = this._events[type];
                if (isFunction(evlistener)) return 1;
                if (evlistener) return evlistener.length
            }
            return 0
        }, EventEmitter.listenerCount = function(emitter, type) {
            return emitter.listenerCount(type)
        }
    }, {}],
    7: [function(require, module) {
        module.exports = "function" == typeof Object.create ? function(ctor, superCtor) { ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, { constructor: { value: ctor, enumerable: !1, writable: !0, configurable: !0 } }) } : function(ctor, superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {};
            TempCtor.prototype = superCtor.prototype, ctor.prototype = new TempCtor, ctor.prototype.constructor = ctor
        }
    }, {}],
    8: [function(require, module) {
        function isBuffer(obj) {
            return !!obj.constructor && "function" == typeof obj.constructor.isBuffer && obj.constructor.isBuffer(obj)
        }

        function isSlowBuffer(obj) {
            return "function" == typeof obj.readFloatLE && "function" == typeof obj.slice && isBuffer(obj.slice(0, 0))
        }
        module.exports = function(obj) {
            return null != obj && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
        }
    }, {}],
    9: [function(require, module) {
        function defaultSetTimout() {
            throw new Error("setTimeout has not been defined")
        }

        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined")
        }

        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, setTimeout(fun, 0);
            try {
                return cachedSetTimeout(fun, 0)
            } catch (e) {
                try {
                    return cachedSetTimeout.call(null, fun, 0)
                } catch (e) {
                    return cachedSetTimeout.call(this, fun, 0)
                }
            }
        }

        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, clearTimeout(marker);
            try {
                return cachedClearTimeout(marker)
            } catch (e) {
                try {
                    return cachedClearTimeout.call(null, marker)
                } catch (e) {
                    return cachedClearTimeout.call(this, marker)
                }
            }
        }

        function cleanUpNextTick() { draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue()) }

        function drainQueue() {
            if (!draining) {
                var timeout = runTimeout(cleanUpNextTick);
                draining = !0;
                for (var len = queue.length; len;) {
                    for (currentQueue = queue, queue = []; ++queueIndex < len;) currentQueue && currentQueue[queueIndex].run();
                    queueIndex = -1, len = queue.length
                }
                currentQueue = null, draining = !1, runClearTimeout(timeout)
            }
        }

        function Item(fun, array) { this.fun = fun, this.array = array }

        function noop() {}
        var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
        ! function() {
            try { cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout } catch (e) { cachedSetTimeout = defaultSetTimout }
            try { cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout } catch (e) { cachedClearTimeout = defaultClearTimeout }
        }();
        var currentQueue, queue = [],
            draining = !1,
            queueIndex = -1;
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
            queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue)
        }, Item.prototype.run = function() { this.fun.apply(null, this.array) }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, process.binding = function() {
            throw new Error("process.binding is not supported")
        }, process.cwd = function() {
            return "/"
        }, process.chdir = function() {
            throw new Error("process.chdir is not supported")
        }, process.umask = function() {
            return 0
        }
    }, {}],
    10: [function(require, module) { module.exports = require("./lib/_stream_duplex.js") }, { "./lib/_stream_duplex.js": 11 }],
    11: [function(require, module) {
        "use strict";

        function Duplex(options) {
            return this instanceof Duplex ? (Readable.call(this, options), Writable.call(this, options), options && options.readable === !1 && (this.readable = !1), options && options.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, options && options.allowHalfOpen === !1 && (this.allowHalfOpen = !1), void this.once("end", onend)) : new Duplex(options)
        }

        function onend() { this.allowHalfOpen || this._writableState.ended || processNextTick(onEndNT, this) }

        function onEndNT(self) { self.end() }
        var objectKeys = Object.keys || function(obj) {
            var keys = [];
            for (var key in obj) keys.push(key);
            return keys
        };
        module.exports = Duplex;
        var processNextTick = require("process-nextick-args"),
            util = require("core-util-is");
        util.inherits = require("inherits");
        var Readable = require("./_stream_readable"),
            Writable = require("./_stream_writable");
        util.inherits(Duplex, Readable);
        for (var keys = objectKeys(Writable.prototype), v = 0; v < keys.length; v++) {
            var method = keys[v];
            Duplex.prototype[method] || (Duplex.prototype[method] = Writable.prototype[method])
        }
    }, { "./_stream_readable": 13, "./_stream_writable": 15, "core-util-is": 18, inherits: 7, "process-nextick-args": 20 }],
    12: [function(require, module) {
        "use strict";

        function PassThrough(options) {
            return this instanceof PassThrough ? void Transform.call(this, options) : new PassThrough(options)
        }
        module.exports = PassThrough;
        var Transform = require("./_stream_transform"),
            util = require("core-util-is");
        util.inherits = require("inherits"), util.inherits(PassThrough, Transform), PassThrough.prototype._transform = function(chunk, encoding, cb) { cb(null, chunk) }
    }, { "./_stream_transform": 14, "core-util-is": 18, inherits: 7 }],
    13: [function(require, module) {
        (function(process) {
            "use strict";

            function prependListener(emitter, event, fn) {
                return "function" == typeof emitter.prependListener ? emitter.prependListener(event, fn) : void(emitter._events && emitter._events[event] ? isArray(emitter._events[event]) ? emitter._events[event].unshift(fn) : emitter._events[event] = [fn, emitter._events[event]] : emitter.on(event, fn))
            }

            function ReadableState(options, stream) {
                Duplex = Duplex || require("./_stream_duplex"), options = options || {}, this.objectMode = !!options.objectMode, stream instanceof Duplex && (this.objectMode = this.objectMode || !!options.readableObjectMode);
                var hwm = options.highWaterMark,
                    defaultHwm = this.objectMode ? 16 : 16384;
                this.highWaterMark = hwm || 0 === hwm ? hwm : defaultHwm, this.highWaterMark = ~~this.highWaterMark, this.buffer = new BufferList, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = options.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, options.encoding && (StringDecoder || (StringDecoder = require("string_decoder/").StringDecoder), this.decoder = new StringDecoder(options.encoding), this.encoding = options.encoding)
            }

            function Readable(options) {
                return Duplex = Duplex || require("./_stream_duplex"), this instanceof Readable ? (this._readableState = new ReadableState(options, this), this.readable = !0, options && "function" == typeof options.read && (this._read = options.read), void Stream.call(this)) : new Readable(options)
            }

            function readableAddChunk(stream, state, chunk, encoding, addToFront) {
                var er = chunkInvalid(state, chunk);
                if (er) stream.emit("error", er);
                else if (null === chunk) state.reading = !1, onEofChunk(stream, state);
                else if (state.objectMode || chunk && chunk.length > 0)
                    if (state.ended && !addToFront) {
                        var e = new Error("stream.push() after EOF");
                        stream.emit("error", e)
                    } else if (state.endEmitted && addToFront) {
                    var _e = new Error("stream.unshift() after end event");
                    stream.emit("error", _e)
                } else {
                    var skipAdd;
                    !state.decoder || addToFront || encoding || (chunk = state.decoder.write(chunk), skipAdd = !state.objectMode && 0 === chunk.length), addToFront || (state.reading = !1), skipAdd || (state.flowing && 0 === state.length && !state.sync ? (stream.emit("data", chunk), stream.read(0)) : (state.length += state.objectMode ? 1 : chunk.length, addToFront ? state.buffer.unshift(chunk) : state.buffer.push(chunk), state.needReadable && emitReadable(stream))), maybeReadMore(stream, state)
                } else addToFront || (state.reading = !1);
                return needMoreData(state)
            }

            function needMoreData(state) {
                return !state.ended && (state.needReadable || state.length < state.highWaterMark || 0 === state.length)
            }

            function computeNewHighWaterMark(n) {
                return n >= MAX_HWM ? n = MAX_HWM : (n--, n |= n >>> 1, n |= n >>> 2, n |= n >>> 4, n |= n >>> 8, n |= n >>> 16, n++), n
            }

            function howMuchToRead(n, state) {
                return 0 >= n || 0 === state.length && state.ended ? 0 : state.objectMode ? 1 : n !== n ? state.flowing && state.length ? state.buffer.head.data.length : state.length : (n > state.highWaterMark && (state.highWaterMark = computeNewHighWaterMark(n)), n <= state.length ? n : state.ended ? state.length : (state.needReadable = !0, 0))
            }

            function chunkInvalid(state, chunk) {
                var er = null;
                return Buffer.isBuffer(chunk) || "string" == typeof chunk || null === chunk || void 0 === chunk || state.objectMode || (er = new TypeError("Invalid non-string/buffer chunk")), er
            }

            function onEofChunk(stream, state) {
                if (!state.ended) {
                    if (state.decoder) {
                        var chunk = state.decoder.end();
                        chunk && chunk.length && (state.buffer.push(chunk), state.length += state.objectMode ? 1 : chunk.length)
                    }
                    state.ended = !0, emitReadable(stream)
                }
            }

            function emitReadable(stream) {
                var state = stream._readableState;
                state.needReadable = !1, state.emittedReadable || (debug("emitReadable", state.flowing), state.emittedReadable = !0, state.sync ? processNextTick(emitReadable_, stream) : emitReadable_(stream))
            }

            function emitReadable_(stream) { debug("emit readable"), stream.emit("readable"), flow(stream) }

            function maybeReadMore(stream, state) { state.readingMore || (state.readingMore = !0, processNextTick(maybeReadMore_, stream, state)) }

            function maybeReadMore_(stream, state) {
                for (var len = state.length; !state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark && (debug("maybeReadMore read 0"), stream.read(0), len !== state.length);) len = state.length;
                state.readingMore = !1
            }

            function pipeOnDrain(src) {
                return function() {
                    var state = src._readableState;
                    debug("pipeOnDrain", state.awaitDrain), state.awaitDrain && state.awaitDrain--, 0 === state.awaitDrain && EElistenerCount(src, "data") && (state.flowing = !0, flow(src))
                }
            }

            function nReadingNextTick(self) { debug("readable nexttick read 0"), self.read(0) }

            function resume(stream, state) { state.resumeScheduled || (state.resumeScheduled = !0, processNextTick(resume_, stream, state)) }

            function resume_(stream, state) { state.reading || (debug("resume read 0"), stream.read(0)), state.resumeScheduled = !1, state.awaitDrain = 0, stream.emit("resume"), flow(stream), state.flowing && !state.reading && stream.read(0) }

            function flow(stream) {
                var state = stream._readableState;
                for (debug("flow", state.flowing); state.flowing && null !== stream.read(););
            }

            function fromList(n, state) {
                if (0 === state.length) return null;
                var ret;
                return state.objectMode ? ret = state.buffer.shift() : !n || n >= state.length ? (ret = state.decoder ? state.buffer.join("") : 1 === state.buffer.length ? state.buffer.head.data : state.buffer.concat(state.length), state.buffer.clear()) : ret = fromListPartial(n, state.buffer, state.decoder), ret
            }

            function fromListPartial(n, list, hasStrings) {
                var ret;
                return n < list.head.data.length ? (ret = list.head.data.slice(0, n), list.head.data = list.head.data.slice(n)) : ret = n === list.head.data.length ? list.shift() : hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list), ret
            }

            function copyFromBufferString(n, list) {
                var p = list.head,
                    c = 1,
                    ret = p.data;
                for (n -= ret.length; p = p.next;) {
                    var str = p.data,
                        nb = n > str.length ? str.length : n;
                    if (ret += nb === str.length ? str : str.slice(0, n), n -= nb, 0 === n) {
                        nb === str.length ? (++c, list.head = p.next ? p.next : list.tail = null) : (list.head = p, p.data = str.slice(nb));
                        break
                    }++c
                }
                return list.length -= c, ret
            }

            function copyFromBuffer(n, list) {
                var ret = bufferShim.allocUnsafe(n),
                    p = list.head,
                    c = 1;
                for (p.data.copy(ret), n -= p.data.length; p = p.next;) {
                    var buf = p.data,
                        nb = n > buf.length ? buf.length : n;
                    if (buf.copy(ret, ret.length - n, 0, nb), n -= nb, 0 === n) {
                        nb === buf.length ? (++c, list.head = p.next ? p.next : list.tail = null) : (list.head = p, p.data = buf.slice(nb));
                        break
                    }++c
                }
                return list.length -= c, ret
            }

            function endReadable(stream) {
                var state = stream._readableState;
                if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
                state.endEmitted || (state.ended = !0, processNextTick(endReadableNT, state, stream))
            }

            function endReadableNT(state, stream) { state.endEmitted || 0 !== state.length || (state.endEmitted = !0, stream.readable = !1, stream.emit("end")) }

            function forEach(xs, f) {
                for (var i = 0, l = xs.length; l > i; i++) f(xs[i], i)
            }

            function indexOf(xs, x) {
                for (var i = 0, l = xs.length; l > i; i++)
                    if (xs[i] === x) return i;
                return -1
            }
            module.exports = Readable;
            var processNextTick = require("process-nextick-args"),
                isArray = require("isarray");
            Readable.ReadableState = ReadableState;
            var Stream, EElistenerCount = (require("events").EventEmitter, function(emitter, type) {
                return emitter.listeners(type).length
            });
            ! function() {
                try { Stream = require("stream") } catch (_) {} finally { Stream || (Stream = require("events").EventEmitter) }
            }();
            var Buffer = require("buffer").Buffer,
                bufferShim = require("buffer-shims"),
                util = require("core-util-is");
            util.inherits = require("inherits");
            var debugUtil = require("util"),
                debug = void 0;
            debug = debugUtil && debugUtil.debuglog ? debugUtil.debuglog("stream") : function() {};
            var StringDecoder, BufferList = require("./internal/streams/BufferList");
            util.inherits(Readable, Stream);
            var Duplex, Duplex;
            Readable.prototype.push = function(chunk, encoding) {
                var state = this._readableState;
                return state.objectMode || "string" != typeof chunk || (encoding = encoding || state.defaultEncoding, encoding !== state.encoding && (chunk = bufferShim.from(chunk, encoding), encoding = "")), readableAddChunk(this, state, chunk, encoding, !1)
            }, Readable.prototype.unshift = function(chunk) {
                var state = this._readableState;
                return readableAddChunk(this, state, chunk, "", !0)
            }, Readable.prototype.isPaused = function() {
                return this._readableState.flowing === !1
            }, Readable.prototype.setEncoding = function(enc) {
                return StringDecoder || (StringDecoder = require("string_decoder/").StringDecoder), this._readableState.decoder = new StringDecoder(enc), this._readableState.encoding = enc, this
            };
            var MAX_HWM = 8388608;
            Readable.prototype.read = function(n) {
                debug("read", n), n = parseInt(n, 10);
                var state = this._readableState,
                    nOrig = n;
                if (0 !== n && (state.emittedReadable = !1), 0 === n && state.needReadable && (state.length >= state.highWaterMark || state.ended)) return debug("read: emitReadable", state.length, state.ended), 0 === state.length && state.ended ? endReadable(this) : emitReadable(this), null;
                if (n = howMuchToRead(n, state), 0 === n && state.ended) return 0 === state.length && endReadable(this), null;
                var doRead = state.needReadable;
                debug("need readable", doRead), (0 === state.length || state.length - n < state.highWaterMark) && (doRead = !0, debug("length less than watermark", doRead)), state.ended || state.reading ? (doRead = !1, debug("reading or ended", doRead)) : doRead && (debug("do read"), state.reading = !0, state.sync = !0, 0 === state.length && (state.needReadable = !0), this._read(state.highWaterMark), state.sync = !1, state.reading || (n = howMuchToRead(nOrig, state)));
                var ret;
                return ret = n > 0 ? fromList(n, state) : null, null === ret ? (state.needReadable = !0, n = 0) : state.length -= n, 0 === state.length && (state.ended || (state.needReadable = !0), nOrig !== n && state.ended && endReadable(this)), null !== ret && this.emit("data", ret), ret
            }, Readable.prototype._read = function() { this.emit("error", new Error("not implemented")) }, Readable.prototype.pipe = function(dest, pipeOpts) {
                function onunpipe(readable) { debug("onunpipe"), readable === src && cleanup() }

                function onend() { debug("onend"), dest.end() }

                function cleanup() { debug("cleanup"), dest.removeListener("close", onclose), dest.removeListener("finish", onfinish), dest.removeListener("drain", ondrain), dest.removeListener("error", onerror), dest.removeListener("unpipe", onunpipe), src.removeListener("end", onend), src.removeListener("end", cleanup), src.removeListener("data", ondata), cleanedUp = !0, !state.awaitDrain || dest._writableState && !dest._writableState.needDrain || ondrain() }

                function ondata(chunk) {
                    debug("ondata"), increasedAwaitDrain = !1;
                    var ret = dest.write(chunk);
                    !1 !== ret || increasedAwaitDrain || ((1 === state.pipesCount && state.pipes === dest || state.pipesCount > 1 && -1 !== indexOf(state.pipes, dest)) && !cleanedUp && (debug("false write response, pause", src._readableState.awaitDrain), src._readableState.awaitDrain++, increasedAwaitDrain = !0), src.pause())
                }

                function onerror(er) { debug("onerror", er), unpipe(), dest.removeListener("error", onerror), 0 === EElistenerCount(dest, "error") && dest.emit("error", er) }

                function onclose() { dest.removeListener("finish", onfinish), unpipe() }

                function onfinish() { debug("onfinish"), dest.removeListener("close", onclose), unpipe() }

                function unpipe() { debug("unpipe"), src.unpipe(dest) }
                var src = this,
                    state = this._readableState;
                switch (state.pipesCount) {
                    case 0:
                        state.pipes = dest;
                        break;
                    case 1:
                        state.pipes = [state.pipes, dest];
                        break;
                    default:
                        state.pipes.push(dest)
                }
                state.pipesCount += 1, debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
                var doEnd = (!pipeOpts || pipeOpts.end !== !1) && dest !== process.stdout && dest !== process.stderr,
                    endFn = doEnd ? onend : cleanup;
                state.endEmitted ? processNextTick(endFn) : src.once("end", endFn), dest.on("unpipe", onunpipe);
                var ondrain = pipeOnDrain(src);
                dest.on("drain", ondrain);
                var cleanedUp = !1,
                    increasedAwaitDrain = !1;
                return src.on("data", ondata), prependListener(dest, "error", onerror), dest.once("close", onclose), dest.once("finish", onfinish), dest.emit("pipe", src), state.flowing || (debug("pipe resume"), src.resume()), dest
            }, Readable.prototype.unpipe = function(dest) {
                var state = this._readableState;
                if (0 === state.pipesCount) return this;
                if (1 === state.pipesCount) return dest && dest !== state.pipes ? this : (dest || (dest = state.pipes), state.pipes = null, state.pipesCount = 0, state.flowing = !1, dest && dest.emit("unpipe", this), this);
                if (!dest) {
                    var dests = state.pipes,
                        len = state.pipesCount;
                    state.pipes = null, state.pipesCount = 0, state.flowing = !1;
                    for (var _i = 0; len > _i; _i++) dests[_i].emit("unpipe", this);
                    return this
                }
                var i = indexOf(state.pipes, dest);
                return -1 === i ? this : (state.pipes.splice(i, 1), state.pipesCount -= 1, 1 === state.pipesCount && (state.pipes = state.pipes[0]), dest.emit("unpipe", this), this)
            }, Readable.prototype.on = function(ev, fn) {
                var res = Stream.prototype.on.call(this, ev, fn);
                if ("data" === ev) this._readableState.flowing !== !1 && this.resume();
                else if ("readable" === ev) {
                    var state = this._readableState;
                    state.endEmitted || state.readableListening || (state.readableListening = state.needReadable = !0, state.emittedReadable = !1, state.reading ? state.length && emitReadable(this, state) : processNextTick(nReadingNextTick, this))
                }
                return res
            }, Readable.prototype.addListener = Readable.prototype.on, Readable.prototype.resume = function() {
                var state = this._readableState;
                return state.flowing || (debug("resume"), state.flowing = !0, resume(this, state)), this
            }, Readable.prototype.pause = function() {
                return debug("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (debug("pause"), this._readableState.flowing = !1, this.emit("pause")), this
            }, Readable.prototype.wrap = function(stream) {
                var state = this._readableState,
                    paused = !1,
                    self = this;
                stream.on("end", function() {
                    if (debug("wrapped end"), state.decoder && !state.ended) {
                        var chunk = state.decoder.end();
                        chunk && chunk.length && self.push(chunk)
                    }
                    self.push(null)
                }), stream.on("data", function(chunk) {
                    if (debug("wrapped data"), state.decoder && (chunk = state.decoder.write(chunk)), (!state.objectMode || null !== chunk && void 0 !== chunk) && (state.objectMode || chunk && chunk.length)) {
                        var ret = self.push(chunk);
                        ret || (paused = !0, stream.pause())
                    }
                });
                for (var i in stream) void 0 === this[i] && "function" == typeof stream[i] && (this[i] = function(method) {
                    return function() {
                        return stream[method].apply(stream, arguments)
                    }
                }(i));
                var events = ["error", "close", "destroy", "pause", "resume"];
                return forEach(events, function(ev) { stream.on(ev, self.emit.bind(self, ev)) }), self._read = function(n) { debug("wrapped _read", n), paused && (paused = !1, stream.resume()) }, self
            }, Readable._fromList = fromList
        }).call(this, require("_process"))
    }, { "./_stream_duplex": 11, "./internal/streams/BufferList": 16, _process: 9, buffer: 2, "buffer-shims": 17, "core-util-is": 18, events: 6, inherits: 7, isarray: 19, "process-nextick-args": 20, "string_decoder/": 27, util: 1 }],
    14: [function(require, module) {
        "use strict";

        function TransformState(stream) {
            this.afterTransform = function(er, data) {
                return afterTransform(stream, er, data)
            }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null
        }

        function afterTransform(stream, er, data) {
            var ts = stream._transformState;
            ts.transforming = !1;
            var cb = ts.writecb;
            if (!cb) return stream.emit("error", new Error("no writecb in Transform class"));
            ts.writechunk = null, ts.writecb = null, null !== data && void 0 !== data && stream.push(data), cb(er);
            var rs = stream._readableState;
            rs.reading = !1, (rs.needReadable || rs.length < rs.highWaterMark) && stream._read(rs.highWaterMark)
        }

        function Transform(options) {
            if (!(this instanceof Transform)) return new Transform(options);
            Duplex.call(this, options), this._transformState = new TransformState(this);
            var stream = this;
            this._readableState.needReadable = !0, this._readableState.sync = !1, options && ("function" == typeof options.transform && (this._transform = options.transform), "function" == typeof options.flush && (this._flush = options.flush)), this.once("prefinish", function() { "function" == typeof this._flush ? this._flush(function(er) { done(stream, er) }) : done(stream) })
        }

        function done(stream, er) {
            if (er) return stream.emit("error", er);
            var ws = stream._writableState,
                ts = stream._transformState;
            if (ws.length) throw new Error("Calling transform done when ws.length != 0");
            if (ts.transforming) throw new Error("Calling transform done when still transforming");
            return stream.push(null)
        }
        module.exports = Transform;
        var Duplex = require("./_stream_duplex"),
            util = require("core-util-is");
        util.inherits = require("inherits"), util.inherits(Transform, Duplex), Transform.prototype.push = function(chunk, encoding) {
            return this._transformState.needTransform = !1, Duplex.prototype.push.call(this, chunk, encoding)
        }, Transform.prototype._transform = function() {
            throw new Error("Not implemented")
        }, Transform.prototype._write = function(chunk, encoding, cb) {
            var ts = this._transformState;
            if (ts.writecb = cb, ts.writechunk = chunk, ts.writeencoding = encoding, !ts.transforming) {
                var rs = this._readableState;
                (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) && this._read(rs.highWaterMark)
            }
        }, Transform.prototype._read = function() {
            var ts = this._transformState;
            null !== ts.writechunk && ts.writecb && !ts.transforming ? (ts.transforming = !0, this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)) : ts.needTransform = !0
        }
    }, { "./_stream_duplex": 11, "core-util-is": 18, inherits: 7 }],
    15: [function(require, module) {
        (function(process) {
            "use strict";

            function nop() {}

            function WriteReq(chunk, encoding, cb) { this.chunk = chunk, this.encoding = encoding, this.callback = cb, this.next = null }

            function WritableState(options, stream) {
                Duplex = Duplex || require("./_stream_duplex"), options = options || {}, this.objectMode = !!options.objectMode, stream instanceof Duplex && (this.objectMode = this.objectMode || !!options.writableObjectMode);
                var hwm = options.highWaterMark,
                    defaultHwm = this.objectMode ? 16 : 16384;
                this.highWaterMark = hwm || 0 === hwm ? hwm : defaultHwm, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
                var noDecode = options.decodeStrings === !1;
                this.decodeStrings = !noDecode, this.defaultEncoding = options.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(er) { onwrite(stream, er) }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new CorkedRequest(this)
            }

            function Writable(options) {
                return Duplex = Duplex || require("./_stream_duplex"), this instanceof Writable || this instanceof Duplex ? (this._writableState = new WritableState(options, this), this.writable = !0, options && ("function" == typeof options.write && (this._write = options.write), "function" == typeof options.writev && (this._writev = options.writev)), void Stream.call(this)) : new Writable(options)
            }

            function writeAfterEnd(stream, cb) {
                var er = new Error("write after end");
                stream.emit("error", er), processNextTick(cb, er)
            }

            function validChunk(stream, state, chunk, cb) {
                var valid = !0,
                    er = !1;
                return null === chunk ? er = new TypeError("May not write null values to stream") : Buffer.isBuffer(chunk) || "string" == typeof chunk || void 0 === chunk || state.objectMode || (er = new TypeError("Invalid non-string/buffer chunk")), er && (stream.emit("error", er), processNextTick(cb, er), valid = !1), valid
            }

            function decodeChunk(state, chunk, encoding) {
                return state.objectMode || state.decodeStrings === !1 || "string" != typeof chunk || (chunk = bufferShim.from(chunk, encoding)), chunk
            }

            function writeOrBuffer(stream, state, chunk, encoding, cb) {
                chunk = decodeChunk(state, chunk, encoding), Buffer.isBuffer(chunk) && (encoding = "buffer");
                var len = state.objectMode ? 1 : chunk.length;
                state.length += len;
                var ret = state.length < state.highWaterMark;
                if (ret || (state.needDrain = !0), state.writing || state.corked) {
                    var last = state.lastBufferedRequest;
                    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb), last ? last.next = state.lastBufferedRequest : state.bufferedRequest = state.lastBufferedRequest, state.bufferedRequestCount += 1
                } else doWrite(stream, state, !1, len, chunk, encoding, cb);
                return ret
            }

            function doWrite(stream, state, writev, len, chunk, encoding, cb) { state.writelen = len, state.writecb = cb, state.writing = !0, state.sync = !0, writev ? stream._writev(chunk, state.onwrite) : stream._write(chunk, encoding, state.onwrite), state.sync = !1 }

            function onwriteError(stream, state, sync, er, cb) {--state.pendingcb, sync ? processNextTick(cb, er) : cb(er), stream._writableState.errorEmitted = !0, stream.emit("error", er) }

            function onwriteStateUpdate(state) { state.writing = !1, state.writecb = null, state.length -= state.writelen, state.writelen = 0 }

            function onwrite(stream, er) {
                var state = stream._writableState,
                    sync = state.sync,
                    cb = state.writecb;
                if (onwriteStateUpdate(state), er) onwriteError(stream, state, sync, er, cb);
                else {
                    var finished = needFinish(state);
                    finished || state.corked || state.bufferProcessing || !state.bufferedRequest || clearBuffer(stream, state), sync ? asyncWrite(afterWrite, stream, state, finished, cb) : afterWrite(stream, state, finished, cb)
                }
            }

            function afterWrite(stream, state, finished, cb) { finished || onwriteDrain(stream, state), state.pendingcb--, cb(), finishMaybe(stream, state) }

            function onwriteDrain(stream, state) { 0 === state.length && state.needDrain && (state.needDrain = !1, stream.emit("drain")) }

            function clearBuffer(stream, state) {
                state.bufferProcessing = !0;
                var entry = state.bufferedRequest;
                if (stream._writev && entry && entry.next) {
                    var l = state.bufferedRequestCount,
                        buffer = new Array(l),
                        holder = state.corkedRequestsFree;
                    holder.entry = entry;
                    for (var count = 0; entry;) buffer[count] = entry, entry = entry.next, count += 1;
                    doWrite(stream, state, !0, state.length, buffer, "", holder.finish), state.pendingcb++, state.lastBufferedRequest = null, holder.next ? (state.corkedRequestsFree = holder.next, holder.next = null) : state.corkedRequestsFree = new CorkedRequest(state)
                } else {
                    for (; entry;) {
                        var chunk = entry.chunk,
                            encoding = entry.encoding,
                            cb = entry.callback,
                            len = state.objectMode ? 1 : chunk.length;
                        if (doWrite(stream, state, !1, len, chunk, encoding, cb), entry = entry.next, state.writing) break
                    }
                    null === entry && (state.lastBufferedRequest = null)
                }
                state.bufferedRequestCount = 0, state.bufferedRequest = entry, state.bufferProcessing = !1
            }

            function needFinish(state) {
                return state.ending && 0 === state.length && null === state.bufferedRequest && !state.finished && !state.writing
            }

            function prefinish(stream, state) { state.prefinished || (state.prefinished = !0, stream.emit("prefinish")) }

            function finishMaybe(stream, state) {
                var need = needFinish(state);
                return need && (0 === state.pendingcb ? (prefinish(stream, state), state.finished = !0, stream.emit("finish")) : prefinish(stream, state)), need
            }

            function endWritable(stream, state, cb) { state.ending = !0, finishMaybe(stream, state), cb && (state.finished ? processNextTick(cb) : stream.once("finish", cb)), state.ended = !0, stream.writable = !1 }

            function CorkedRequest(state) {
                var _this = this;
                this.next = null, this.entry = null, this.finish = function(err) {
                    var entry = _this.entry;
                    for (_this.entry = null; entry;) {
                        var cb = entry.callback;
                        state.pendingcb--, cb(err), entry = entry.next
                    }
                    state.corkedRequestsFree ? state.corkedRequestsFree.next = _this : state.corkedRequestsFree = _this
                }
            }
            module.exports = Writable;
            var processNextTick = require("process-nextick-args"),
                asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
            Writable.WritableState = WritableState;
            var util = require("core-util-is");
            util.inherits = require("inherits");
            var Stream, internalUtil = { deprecate: require("util-deprecate") };
            ! function() {
                try { Stream = require("stream") } catch (_) {} finally { Stream || (Stream = require("events").EventEmitter) }
            }();
            var Buffer = require("buffer").Buffer,
                bufferShim = require("buffer-shims");
            util.inherits(Writable, Stream);
            var Duplex;
            WritableState.prototype.getBuffer = function() {
                    for (var current = this.bufferedRequest, out = []; current;) out.push(current), current = current.next;
                    return out
                },
                function() {
                    try {
                        Object.defineProperty(WritableState.prototype, "buffer", {
                            get: internalUtil.deprecate(function() {
                                return this.getBuffer()
                            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
                        })
                    } catch (_) {}
                }();
            var Duplex;
            Writable.prototype.pipe = function() { this.emit("error", new Error("Cannot pipe, not readable")) }, Writable.prototype.write = function(chunk, encoding, cb) {
                var state = this._writableState,
                    ret = !1;
                return "function" == typeof encoding && (cb = encoding, encoding = null), Buffer.isBuffer(chunk) ? encoding = "buffer" : encoding || (encoding = state.defaultEncoding), "function" != typeof cb && (cb = nop), state.ended ? writeAfterEnd(this, cb) : validChunk(this, state, chunk, cb) && (state.pendingcb++, ret = writeOrBuffer(this, state, chunk, encoding, cb)), ret
            }, Writable.prototype.cork = function() {
                var state = this._writableState;
                state.corked++
            }, Writable.prototype.uncork = function() {
                var state = this._writableState;
                state.corked && (state.corked--, state.writing || state.corked || state.finished || state.bufferProcessing || !state.bufferedRequest || clearBuffer(this, state))
            }, Writable.prototype.setDefaultEncoding = function(encoding) {
                if ("string" == typeof encoding && (encoding = encoding.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
                return this._writableState.defaultEncoding = encoding, this
            }, Writable.prototype._write = function(chunk, encoding, cb) { cb(new Error("not implemented")) }, Writable.prototype._writev = null, Writable.prototype.end = function(chunk, encoding, cb) {
                var state = this._writableState;
                "function" == typeof chunk ? (cb = chunk, chunk = null, encoding = null) : "function" == typeof encoding && (cb = encoding, encoding = null), null !== chunk && void 0 !== chunk && this.write(chunk, encoding), state.corked && (state.corked = 1, this.uncork()), state.ending || state.finished || endWritable(this, state, cb)
            }
        }).call(this, require("_process"))
    }, { "./_stream_duplex": 11, _process: 9, buffer: 2, "buffer-shims": 17, "core-util-is": 18, events: 6, inherits: 7, "process-nextick-args": 20, "util-deprecate": 21 }],
    16: [function(require, module) {
        "use strict";

        function BufferList() { this.head = null, this.tail = null, this.length = 0 }
        var bufferShim = (require("buffer").Buffer, require("buffer-shims"));
        module.exports = BufferList, BufferList.prototype.push = function(v) {
            var entry = { data: v, next: null };
            this.length > 0 ? this.tail.next = entry : this.head = entry, this.tail = entry, ++this.length
        }, BufferList.prototype.unshift = function(v) {
            var entry = { data: v, next: this.head };
            0 === this.length && (this.tail = entry), this.head = entry, ++this.length
        }, BufferList.prototype.shift = function() {
            if (0 !== this.length) {
                var ret = this.head.data;
                return this.head = 1 === this.length ? this.tail = null : this.head.next, --this.length, ret
            }
        }, BufferList.prototype.clear = function() { this.head = this.tail = null, this.length = 0 }, BufferList.prototype.join = function(s) {
            if (0 === this.length) return "";
            for (var p = this.head, ret = "" + p.data; p = p.next;) ret += s + p.data;
            return ret
        }, BufferList.prototype.concat = function(n) {
            if (0 === this.length) return bufferShim.alloc(0);
            if (1 === this.length) return this.head.data;
            for (var ret = bufferShim.allocUnsafe(n >>> 0), p = this.head, i = 0; p;) p.data.copy(ret, i), i += p.data.length, p = p.next;
            return ret
        }
    }, { buffer: 2, "buffer-shims": 17 }],
    17: [function(require, module, exports) {
        (function(global) {
            "use strict";
            var buffer = require("buffer"),
                Buffer = buffer.Buffer,
                SlowBuffer = buffer.SlowBuffer,
                MAX_LEN = buffer.kMaxLength || 2147483647;
            exports.alloc = function(size, fill, encoding) {
                if ("function" == typeof Buffer.alloc) return Buffer.alloc(size, fill, encoding);
                if ("number" == typeof encoding) throw new TypeError("encoding must not be number");
                if ("number" != typeof size) throw new TypeError("size must be a number");
                if (size > MAX_LEN) throw new RangeError("size is too large");
                var enc = encoding,
                    _fill = fill;
                void 0 === _fill && (enc = void 0, _fill = 0);
                var buf = new Buffer(size);
                if ("string" == typeof _fill)
                    for (var fillBuf = new Buffer(_fill, enc), flen = fillBuf.length, i = -1; ++i < size;) buf[i] = fillBuf[i % flen];
                else buf.fill(_fill);
                return buf
            }, exports.allocUnsafe = function(size) {
                if ("function" == typeof Buffer.allocUnsafe) return Buffer.allocUnsafe(size);
                if ("number" != typeof size) throw new TypeError("size must be a number");
                if (size > MAX_LEN) throw new RangeError("size is too large");
                return new Buffer(size)
            }, exports.from = function(value, encodingOrOffset, length) {
                if ("function" == typeof Buffer.from && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) return Buffer.from(value, encodingOrOffset, length);
                if ("number" == typeof value) throw new TypeError('"value" argument must not be a number');
                if ("string" == typeof value) return new Buffer(value, encodingOrOffset);
                if ("undefined" != typeof ArrayBuffer && value instanceof ArrayBuffer) {
                    var offset = encodingOrOffset;
                    if (1 === arguments.length) return new Buffer(value);
                    "undefined" == typeof offset && (offset = 0);
                    var len = length;
                    if ("undefined" == typeof len && (len = value.byteLength - offset), offset >= value.byteLength) throw new RangeError("'offset' is out of bounds");
                    if (len > value.byteLength - offset) throw new RangeError("'length' is out of bounds");
                    return new Buffer(value.slice(offset, offset + len))
                }
                if (Buffer.isBuffer(value)) {
                    var out = new Buffer(value.length);
                    return value.copy(out, 0, 0, value.length), out
                }
                if (value) {
                    if (Array.isArray(value) || "undefined" != typeof ArrayBuffer && value.buffer instanceof ArrayBuffer || "length" in value) return new Buffer(value);
                    if ("Buffer" === value.type && Array.isArray(value.data)) return new Buffer(value.data)
                }
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
            }, exports.allocUnsafeSlow = function(size) {
                if ("function" == typeof Buffer.allocUnsafeSlow) return Buffer.allocUnsafeSlow(size);
                if ("number" != typeof size) throw new TypeError("size must be a number");
                if (size >= MAX_LEN) throw new RangeError("size is too large");
                return new SlowBuffer(size)
            }
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, { buffer: 2 }],
    18: [function(require, module, exports) {
        (function(Buffer) {
            function isArray(arg) {
                return Array.isArray ? Array.isArray(arg) : "[object Array]" === objectToString(arg)
            }

            function isBoolean(arg) {
                return "boolean" == typeof arg
            }

            function isNull(arg) {
                return null === arg
            }

            function isNullOrUndefined(arg) {
                return null == arg
            }

            function isNumber(arg) {
                return "number" == typeof arg
            }

            function isString(arg) {
                return "string" == typeof arg
            }

            function isSymbol(arg) {
                return "symbol" == typeof arg
            }

            function isUndefined(arg) {
                return void 0 === arg
            }

            function isRegExp(re) {
                return "[object RegExp]" === objectToString(re)
            }

            function isObject(arg) {
                return "object" == typeof arg && null !== arg
            }

            function isDate(d) {
                return "[object Date]" === objectToString(d)
            }

            function isError(e) {
                return "[object Error]" === objectToString(e) || e instanceof Error
            }

            function isFunction(arg) {
                return "function" == typeof arg
            }

            function isPrimitive(arg) {
                return null === arg || "boolean" == typeof arg || "number" == typeof arg || "string" == typeof arg || "symbol" == typeof arg || "undefined" == typeof arg
            }

            function objectToString(o) {
                return Object.prototype.toString.call(o)
            }
            exports.isArray = isArray, exports.isBoolean = isBoolean, exports.isNull = isNull, exports.isNullOrUndefined = isNullOrUndefined, exports.isNumber = isNumber, exports.isString = isString, exports.isSymbol = isSymbol, exports.isUndefined = isUndefined, exports.isRegExp = isRegExp, exports.isObject = isObject, exports.isDate = isDate, exports.isError = isError, exports.isFunction = isFunction, exports.isPrimitive = isPrimitive, exports.isBuffer = Buffer.isBuffer
        }).call(this, { isBuffer: require("../../../../insert-module-globals/node_modules/is-buffer/index.js") })
    }, { "../../../../insert-module-globals/node_modules/is-buffer/index.js": 8 }],
    19: [function(require, module, exports) { arguments[4][5][0].apply(exports, arguments) }, { dup: 5 }],
    20: [function(require, module) {
        (function(process) {
            "use strict";

            function nextTick(fn, arg1, arg2, arg3) {
                if ("function" != typeof fn) throw new TypeError('"callback" argument must be a function');
                var args, i, len = arguments.length;
                switch (len) {
                    case 0:
                    case 1:
                        return process.nextTick(fn);
                    case 2:
                        return process.nextTick(function() { fn.call(null, arg1) });
                    case 3:
                        return process.nextTick(function() { fn.call(null, arg1, arg2) });
                    case 4:
                        return process.nextTick(function() { fn.call(null, arg1, arg2, arg3) });
                    default:
                        for (args = new Array(len - 1), i = 0; i < args.length;) args[i++] = arguments[i];
                        return process.nextTick(function() { fn.apply(null, args) })
                }
            }
            module.exports = !process.version || 0 === process.version.indexOf("v0.") || 0 === process.version.indexOf("v1.") && 0 !== process.version.indexOf("v1.8.") ? nextTick : process.nextTick
        }).call(this, require("_process"))
    }, { _process: 9 }],
    21: [function(require, module) {
        (function(global) {
            function deprecate(fn, msg) {
                function deprecated() {
                    if (!warned) {
                        if (config("throwDeprecation")) throw new Error(msg);
                        config("traceDeprecation") ? console.trace(msg) : console.warn(msg), warned = !0
                    }
                    return fn.apply(this, arguments)
                }
                if (config("noDeprecation")) return fn;
                var warned = !1;
                return deprecated
            }

            function config(name) {
                try {
                    if (!global.localStorage) return !1
                } catch (_) {
                    return !1
                }
                var val = global.localStorage[name];
                return null == val ? !1 : "true" === String(val).toLowerCase()
            }
            module.exports = deprecate
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    22: [function(require, module) { module.exports = require("./lib/_stream_passthrough.js") }, { "./lib/_stream_passthrough.js": 12 }],
    23: [function(require, module, exports) {
        (function(process) {
            var Stream = function() {
                try {
                    return require("stream")
                } catch (_) {}
            }();
            exports = module.exports = require("./lib/_stream_readable.js"), exports.Stream = Stream || exports, exports.Readable = exports, exports.Writable = require("./lib/_stream_writable.js"), exports.Duplex = require("./lib/_stream_duplex.js"), exports.Transform = require("./lib/_stream_transform.js"), exports.PassThrough = require("./lib/_stream_passthrough.js"), !process.browser && "disable" === process.env.READABLE_STREAM && Stream && (module.exports = Stream)
        }).call(this, require("_process"))
    }, { "./lib/_stream_duplex.js": 11, "./lib/_stream_passthrough.js": 12, "./lib/_stream_readable.js": 13, "./lib/_stream_transform.js": 14, "./lib/_stream_writable.js": 15, _process: 9 }],
    24: [function(require, module) { module.exports = require("./lib/_stream_transform.js") }, { "./lib/_stream_transform.js": 14 }],
    25: [function(require, module) { module.exports = require("./lib/_stream_writable.js") }, { "./lib/_stream_writable.js": 15 }],
    26: [function(require, module) {
        function Stream() { EE.call(this) }
        module.exports = Stream;
        var EE = require("events").EventEmitter,
            inherits = require("inherits");
        inherits(Stream, EE), Stream.Readable = require("readable-stream/readable.js"), Stream.Writable = require("readable-stream/writable.js"), Stream.Duplex = require("readable-stream/duplex.js"), Stream.Transform = require("readable-stream/transform.js"), Stream.PassThrough = require("readable-stream/passthrough.js"), Stream.Stream = Stream, Stream.prototype.pipe = function(dest, options) {
            function ondata(chunk) { dest.writable && !1 === dest.write(chunk) && source.pause && source.pause() }

            function ondrain() { source.readable && source.resume && source.resume() }

            function onend() { didOnEnd || (didOnEnd = !0, dest.end()) }

            function onclose() { didOnEnd || (didOnEnd = !0, "function" == typeof dest.destroy && dest.destroy()) }

            function onerror(er) {
                if (cleanup(), 0 === EE.listenerCount(this, "error")) throw er
            }

            function cleanup() { source.removeListener("data", ondata), dest.removeListener("drain", ondrain), source.removeListener("end", onend), source.removeListener("close", onclose), source.removeListener("error", onerror), dest.removeListener("error", onerror), source.removeListener("end", cleanup), source.removeListener("close", cleanup), dest.removeListener("close", cleanup) }
            var source = this;
            source.on("data", ondata), dest.on("drain", ondrain), dest._isStdio || options && options.end === !1 || (source.on("end", onend), source.on("close", onclose));
            var didOnEnd = !1;
            return source.on("error", onerror), dest.on("error", onerror), source.on("end", cleanup), source.on("close", cleanup), dest.on("close", cleanup), dest.emit("pipe", source), dest
        }
    }, { events: 6, inherits: 7, "readable-stream/duplex.js": 10, "readable-stream/passthrough.js": 22, "readable-stream/readable.js": 23, "readable-stream/transform.js": 24, "readable-stream/writable.js": 25 }],
    27: [function(require, module, exports) {
        function assertEncoding(encoding) {
            if (encoding && !isBufferEncoding(encoding)) throw new Error("Unknown encoding: " + encoding)
        }

        function passThroughWrite(buffer) {
            return buffer.toString(this.encoding)
        }

        function utf16DetectIncompleteChar(buffer) { this.charReceived = buffer.length % 2, this.charLength = this.charReceived ? 2 : 0 }

        function base64DetectIncompleteChar(buffer) { this.charReceived = buffer.length % 3, this.charLength = this.charReceived ? 3 : 0 }
        var Buffer = require("buffer").Buffer,
            isBufferEncoding = Buffer.isEncoding || function(encoding) {
                switch (encoding && encoding.toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                    case "raw":
                        return !0;
                    default:
                        return !1
                }
            },
            StringDecoder = exports.StringDecoder = function(encoding) {
                switch (this.encoding = (encoding || "utf8").toLowerCase().replace(/[-_]/, ""), assertEncoding(encoding), this.encoding) {
                    case "utf8":
                        this.surrogateSize = 3;
                        break;
                    case "ucs2":
                    case "utf16le":
                        this.surrogateSize = 2, this.detectIncompleteChar = utf16DetectIncompleteChar;
                        break;
                    case "base64":
                        this.surrogateSize = 3, this.detectIncompleteChar = base64DetectIncompleteChar;
                        break;
                    default:
                        return void(this.write = passThroughWrite)
                }
                this.charBuffer = new Buffer(6), this.charReceived = 0, this.charLength = 0
            };
        StringDecoder.prototype.write = function(buffer) {
            for (var charStr = ""; this.charLength;) {
                var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
                if (buffer.copy(this.charBuffer, this.charReceived, 0, available), this.charReceived += available, this.charReceived < this.charLength) return "";
                buffer = buffer.slice(available, buffer.length), charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
                var charCode = charStr.charCodeAt(charStr.length - 1);
                if (!(charCode >= 55296 && 56319 >= charCode)) {
                    if (this.charReceived = this.charLength = 0, 0 === buffer.length) return charStr;
                    break
                }
                this.charLength += this.surrogateSize, charStr = ""
            }
            this.detectIncompleteChar(buffer);
            var end = buffer.length;
            this.charLength && (buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end), end -= this.charReceived), charStr += buffer.toString(this.encoding, 0, end);
            var end = charStr.length - 1,
                charCode = charStr.charCodeAt(end);
            if (charCode >= 55296 && 56319 >= charCode) {
                var size = this.surrogateSize;
                return this.charLength += size, this.charReceived += size, this.charBuffer.copy(this.charBuffer, size, 0, size), buffer.copy(this.charBuffer, 0, 0, size), charStr.substring(0, end)
            }
            return charStr
        }, StringDecoder.prototype.detectIncompleteChar = function(buffer) {
            for (var i = buffer.length >= 3 ? 3 : buffer.length; i > 0; i--) {
                var c = buffer[buffer.length - i];
                if (1 == i && c >> 5 == 6) {
                    this.charLength = 2;
                    break
                }
                if (2 >= i && c >> 4 == 14) {
                    this.charLength = 3;
                    break
                }
                if (3 >= i && c >> 3 == 30) {
                    this.charLength = 4;
                    break
                }
            }
            this.charReceived = i
        }, StringDecoder.prototype.end = function(buffer) {
            var res = "";
            if (buffer && buffer.length && (res = this.write(buffer)), this.charReceived) {
                var cr = this.charReceived,
                    buf = this.charBuffer,
                    enc = this.encoding;
                res += buf.slice(0, cr).toString(enc)
            }
            return res
        }
    }, { buffer: 2 }],
    28: [function(require, module, exports) { arguments[4][7][0].apply(exports, arguments) }, { dup: 7 }],
    29: [function(require, module) {
        module.exports = function(arg) {
            return arg && "object" == typeof arg && "function" == typeof arg.copy && "function" == typeof arg.fill && "function" == typeof arg.readUInt8
        }
    }, {}],
    30: [function(require, module, exports) {
        (function(process, global) {
            function inspect(obj, opts) {
                var ctx = { seen: [], stylize: stylizeNoColor };
                return arguments.length >= 3 && (ctx.depth = arguments[2]), arguments.length >= 4 && (ctx.colors = arguments[3]), isBoolean(opts) ? ctx.showHidden = opts : opts && exports._extend(ctx, opts), isUndefined(ctx.showHidden) && (ctx.showHidden = !1), isUndefined(ctx.depth) && (ctx.depth = 2), isUndefined(ctx.colors) && (ctx.colors = !1), isUndefined(ctx.customInspect) && (ctx.customInspect = !0), ctx.colors && (ctx.stylize = stylizeWithColor), formatValue(ctx, obj, ctx.depth)
            }

            function stylizeWithColor(str, styleType) {
                var style = inspect.styles[styleType];
                return style ? "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m" : str
            }

            function stylizeNoColor(str) {
                return str
            }

            function arrayToHash(array) {
                var hash = {};
                return array.forEach(function(val) { hash[val] = !0 }), hash
            }

            function formatValue(ctx, value, recurseTimes) {
                if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && (!value.constructor || value.constructor.prototype !== value)) {
                    var ret = value.inspect(recurseTimes, ctx);
                    return isString(ret) || (ret = formatValue(ctx, ret, recurseTimes)), ret
                }
                var primitive = formatPrimitive(ctx, value);
                if (primitive) return primitive;
                var keys = Object.keys(value),
                    visibleKeys = arrayToHash(keys);
                if (ctx.showHidden && (keys = Object.getOwnPropertyNames(value)), isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) return formatError(value);
                if (0 === keys.length) {
                    if (isFunction(value)) {
                        var name = value.name ? ": " + value.name : "";
                        return ctx.stylize("[Function" + name + "]", "special")
                    }
                    if (isRegExp(value)) return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
                    if (isDate(value)) return ctx.stylize(Date.prototype.toString.call(value), "date");
                    if (isError(value)) return formatError(value)
                }
                var base = "",
                    array = !1,
                    braces = ["{", "}"];
                if (isArray(value) && (array = !0, braces = ["[", "]"]), isFunction(value)) {
                    var n = value.name ? ": " + value.name : "";
                    base = " [Function" + n + "]"
                }
                if (isRegExp(value) && (base = " " + RegExp.prototype.toString.call(value)), isDate(value) && (base = " " + Date.prototype.toUTCString.call(value)), isError(value) && (base = " " + formatError(value)), 0 === keys.length && (!array || 0 == value.length)) return braces[0] + base + braces[1];
                if (0 > recurseTimes) return isRegExp(value) ? ctx.stylize(RegExp.prototype.toString.call(value), "regexp") : ctx.stylize("[Object]", "special");
                ctx.seen.push(value);
                var output;
                return output = array ? formatArray(ctx, value, recurseTimes, visibleKeys, keys) : keys.map(function(key) {
                    return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array)
                }), ctx.seen.pop(), reduceToSingleString(output, base, braces)
            }

            function formatPrimitive(ctx, value) {
                if (isUndefined(value)) return ctx.stylize("undefined", "undefined");
                if (isString(value)) {
                    var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                    return ctx.stylize(simple, "string")
                }
                return isNumber(value) ? ctx.stylize("" + value, "number") : isBoolean(value) ? ctx.stylize("" + value, "boolean") : isNull(value) ? ctx.stylize("null", "null") : void 0
            }

            function formatError(value) {
                return "[" + Error.prototype.toString.call(value) + "]"
            }

            function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                for (var output = [], i = 0, l = value.length; l > i; ++i) output.push(hasOwnProperty(value, String(i)) ? formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), !0) : "");
                return keys.forEach(function(key) { key.match(/^\d+$/) || output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, !0)) }), output
            }

            function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                var name, str, desc;
                if (desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] }, desc.get ? str = desc.set ? ctx.stylize("[Getter/Setter]", "special") : ctx.stylize("[Getter]", "special") : desc.set && (str = ctx.stylize("[Setter]", "special")), hasOwnProperty(visibleKeys, key) || (name = "[" + key + "]"), str || (ctx.seen.indexOf(desc.value) < 0 ? (str = isNull(recurseTimes) ? formatValue(ctx, desc.value, null) : formatValue(ctx, desc.value, recurseTimes - 1), str.indexOf("\n") > -1 && (str = array ? str.split("\n").map(function(line) {
                        return "  " + line
                    }).join("\n").substr(2) : "\n" + str.split("\n").map(function(line) {
                        return "   " + line
                    }).join("\n"))) : str = ctx.stylize("[Circular]", "special")), isUndefined(name)) {
                    if (array && key.match(/^\d+$/)) return str;
                    name = JSON.stringify("" + key), name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (name = name.substr(1, name.length - 2), name = ctx.stylize(name, "name")) : (name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), name = ctx.stylize(name, "string"))
                }
                return name + ": " + str
            }

            function reduceToSingleString(output, base, braces) {
                var numLinesEst = 0,
                    length = output.reduce(function(prev, cur) {
                        return numLinesEst++, cur.indexOf("\n") >= 0 && numLinesEst++, prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1
                    }, 0);
                return length > 60 ? braces[0] + ("" === base ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1] : braces[0] + base + " " + output.join(", ") + " " + braces[1]
            }

            function isArray(ar) {
                return Array.isArray(ar)
            }

            function isBoolean(arg) {
                return "boolean" == typeof arg
            }

            function isNull(arg) {
                return null === arg
            }

            function isNullOrUndefined(arg) {
                return null == arg
            }

            function isNumber(arg) {
                return "number" == typeof arg
            }

            function isString(arg) {
                return "string" == typeof arg
            }

            function isSymbol(arg) {
                return "symbol" == typeof arg
            }

            function isUndefined(arg) {
                return void 0 === arg
            }

            function isRegExp(re) {
                return isObject(re) && "[object RegExp]" === objectToString(re)
            }

            function isObject(arg) {
                return "object" == typeof arg && null !== arg
            }

            function isDate(d) {
                return isObject(d) && "[object Date]" === objectToString(d)
            }

            function isError(e) {
                return isObject(e) && ("[object Error]" === objectToString(e) || e instanceof Error)
            }

            function isFunction(arg) {
                return "function" == typeof arg
            }

            function isPrimitive(arg) {
                return null === arg || "boolean" == typeof arg || "number" == typeof arg || "string" == typeof arg || "symbol" == typeof arg || "undefined" == typeof arg
            }

            function objectToString(o) {
                return Object.prototype.toString.call(o)
            }

            function pad(n) {
                return 10 > n ? "0" + n.toString(10) : n.toString(10)
            }

            function timestamp() {
                var d = new Date,
                    time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":");
                return [d.getDate(), months[d.getMonth()], time].join(" ")
            }

            function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop)
            }
            var formatRegExp = /%[sdj%]/g;
            exports.format = function(f) {
                if (!isString(f)) {
                    for (var objects = [], i = 0; i < arguments.length; i++) objects.push(inspect(arguments[i]));
                    return objects.join(" ")
                }
                for (var i = 1, args = arguments, len = args.length, str = String(f).replace(formatRegExp, function(x) {
                        if ("%%" === x) return "%";
                        if (i >= len) return x;
                        switch (x) {
                            case "%s":
                                return String(args[i++]);
                            case "%d":
                                return Number(args[i++]);
                            case "%j":
                                try {
                                    return JSON.stringify(args[i++])
                                } catch (_) {
                                    return "[Circular]"
                                }
                            default:
                                return x
                        }
                    }), x = args[i]; len > i; x = args[++i]) str += isNull(x) || !isObject(x) ? " " + x : " " + inspect(x);
                return str
            }, exports.deprecate = function(fn, msg) {
                function deprecated() {
                    if (!warned) {
                        if (process.throwDeprecation) throw new Error(msg);
                        process.traceDeprecation ? console.trace(msg) : console.error(msg), warned = !0
                    }
                    return fn.apply(this, arguments)
                }
                if (isUndefined(global.process)) return function() {
                    return exports.deprecate(fn, msg).apply(this, arguments)
                };
                if (process.noDeprecation === !0) return fn;
                var warned = !1;
                return deprecated
            };
            var debugEnviron, debugs = {};
            exports.debuglog = function(set) {
                if (isUndefined(debugEnviron) && (debugEnviron = process.env.NODE_DEBUG || ""), set = set.toUpperCase(), !debugs[set])
                    if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
                        var pid = process.pid;
                        debugs[set] = function() {
                            var msg = exports.format.apply(exports, arguments);
                            console.error("%s %d: %s", set, pid, msg)
                        }
                    } else debugs[set] = function() {};
                return debugs[set]
            }, exports.inspect = inspect, inspect.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, inspect.styles = { special: "cyan", number: "yellow", "boolean": "yellow", undefined: "grey", "null": "bold", string: "green", date: "magenta", regexp: "red" }, exports.isArray = isArray, exports.isBoolean = isBoolean, exports.isNull = isNull, exports.isNullOrUndefined = isNullOrUndefined, exports.isNumber = isNumber, exports.isString = isString, exports.isSymbol = isSymbol, exports.isUndefined = isUndefined, exports.isRegExp = isRegExp, exports.isObject = isObject, exports.isDate = isDate, exports.isError = isError, exports.isFunction = isFunction, exports.isPrimitive = isPrimitive, exports.isBuffer = require("./support/isBuffer");
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            exports.log = function() { console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments)) }, exports.inherits = require("inherits"), exports._extend = function(origin, add) {
                if (!add || !isObject(add)) return origin;
                for (var keys = Object.keys(add), i = keys.length; i--;) origin[keys[i]] = add[keys[i]];
                return origin
            }
        }).call(this, require("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, { "./support/isBuffer": 29, _process: 9, inherits: 28 }],
    31: [function(require, module) {
        (function(Buffer) {
            var clone = function() {
                "use strict";

                function clone(parent, circular, depth, prototype) {
                    function _clone(parent, depth) {
                        if (null === parent) return null;
                        if (0 == depth) return parent;
                        var child, proto;
                        if ("object" != typeof parent) return parent;
                        if (clone.__isArray(parent)) child = [];
                        else if (clone.__isRegExp(parent)) child = new RegExp(parent.source, __getRegExpFlags(parent)), parent.lastIndex && (child.lastIndex = parent.lastIndex);
                        else if (clone.__isDate(parent)) child = new Date(parent.getTime());
                        else {
                            if (useBuffer && Buffer.isBuffer(parent)) return child = new Buffer(parent.length), parent.copy(child), child;
                            "undefined" == typeof prototype ? (proto = Object.getPrototypeOf(parent), child = Object.create(proto)) : (child = Object.create(prototype), proto = prototype)
                        }
                        if (circular) {
                            var index = allParents.indexOf(parent);
                            if (-1 != index) return allChildren[index];
                            allParents.push(parent), allChildren.push(child)
                        }
                        for (var i in parent) {
                            var attrs;
                            proto && (attrs = Object.getOwnPropertyDescriptor(proto, i)), attrs && null == attrs.set || (child[i] = _clone(parent[i], depth - 1))
                        }
                        return child
                    }
                    var filter;
                    "object" == typeof circular && (depth = circular.depth, prototype = circular.prototype, filter = circular.filter, circular = circular.circular);
                    var allParents = [],
                        allChildren = [],
                        useBuffer = "undefined" != typeof Buffer;
                    return "undefined" == typeof circular && (circular = !0), "undefined" == typeof depth && (depth = 1 / 0), _clone(parent, depth)
                }

                function __objToStr(o) {
                    return Object.prototype.toString.call(o)
                }

                function __isDate(o) {
                    return "object" == typeof o && "[object Date]" === __objToStr(o)
                }

                function __isArray(o) {
                    return "object" == typeof o && "[object Array]" === __objToStr(o)
                }

                function __isRegExp(o) {
                    return "object" == typeof o && "[object RegExp]" === __objToStr(o)
                }

                function __getRegExpFlags(re) {
                    var flags = "";
                    return re.global && (flags += "g"), re.ignoreCase && (flags += "i"), re.multiline && (flags += "m"), flags
                }
                return clone.clonePrototype = function(parent) {
                    if (null === parent) return null;
                    var c = function() {};
                    return c.prototype = parent, new c
                }, clone.__objToStr = __objToStr, clone.__isDate = __isDate, clone.__isArray = __isArray, clone.__isRegExp = __isRegExp, clone.__getRegExpFlags = __getRegExpFlags, clone
            }();
            "object" == typeof module && module.exports && (module.exports = clone)
        }).call(this, require("buffer").Buffer)
    }, { buffer: 2 }],
    32: [function(require, module) {
        (function(process, Buffer) {
            "use strict";

            function MicrophoneStream(stream, opts) {
                function recorderProcess(e) { recording && self.push(opts.objectMode ? e.inputBuffer : new Buffer(e.inputBuffer.getChannelData(0))) }
                var bufferSize = "undefined" == typeof window.AudioContext ? 4096 : null;
                opts = opts || {}, bufferSize = opts.bufferSize || bufferSize;
                var inputChannels = 1,
                    outputChannels = 1;
                Readable.call(this, opts);
                var self = this,
                    recording = !0,
                    AudioContext = window.AudioContext || window.webkitAudioContext,
                    context = new AudioContext,
                    audioInput = context.createMediaStreamSource(stream),
                    recorder = context.createScriptProcessor(bufferSize, inputChannels, outputChannels);
                recorder.onaudioprocess = recorderProcess, audioInput.connect(recorder), recorder.connect(context.destination), this.stop = function() {
                    if ("closed" !== context.state) {
                        try { stream.getTracks()[0].stop() } catch (ex) {}
                        recorder.disconnect(), audioInput.disconnect();
                        try { context.close() } catch (ex) {}
                        recording = !1, self.push(null), self.emit("close")
                    }
                }, process.nextTick(function() { self.emit("format", { channels: 1, bitDepth: 32, sampleRate: context.sampleRate, signed: !0, "float": !0 }) })
            }
            var Readable = require("stream").Readable,
                util = require("util");
            util.inherits(MicrophoneStream, Readable), MicrophoneStream.prototype._read = function() {}, MicrophoneStream.toRaw = function(chunk) {
                return new Float32Array(chunk.buffer)
            }, module.exports = MicrophoneStream
        }).call(this, require("_process"), require("buffer").Buffer)
    }, { _process: 9, buffer: 2, stream: 26, util: 30 }],
    33: [function(require, module) {
        "use strict";
        var isObject = require("isobject");
        module.exports = function(obj, keys) {
            if (!isObject(obj) && "function" != typeof obj) return {};
            var res = {};
            if ("string" == typeof keys) return keys in obj && (res[keys] = obj[keys]), res;
            for (var len = keys.length, idx = -1; ++idx < len;) {
                var key = keys[idx];
                key in obj && (res[key] = obj[key])
            }
            return res
        }
    }, { isobject: 34 }],
    34: [function(require, module) {
        "use strict";
        var isArray = require("isarray");
        module.exports = function(val) {
            return null != val && "object" == typeof val && isArray(val) === !1
        }
    }, { isarray: 35 }],
    35: [function(require, module, exports) { arguments[4][5][0].apply(exports, arguments) }, { dup: 5 }],
    36: [function(require, module) {
        (function(global, Buffer) {
            "use strict";

            function ReadableBlobStream(blob, opts) {
                if (!(this instanceof ReadableBlobStream)) return new ReadableBlobStream(blob, opts);
                if (opts = opts || {}, opts.objectMode = !1, Readable.call(this, opts), !blob) throw Error('Missing argument "blob"');
                if ("function" != typeof blob.slice) throw Error('Given argument "blob" is not really a Blob/File or your environment does not support .slice()');
                if (!FileReader) throw Error("Your environment does not support FileReader");
                if (!Uint8Array) throw Error("Your environment does not support Uint8Array");
                this.totalSize = blob.size, this._blob = blob, this._nextByteStart = 0
            }

            function uint8ArrayToBuffer(buf) {
                if ("function" == typeof Buffer._augment) {
                    if (buf = Buffer._augment(buf), !(buf instanceof Uint8Array)) throw Error("Assertion error, buf should be an Uint8Array")
                } else buf = new Buffer(buf);
                return buf
            }

            function bufferToUint8Array(buf) {
                if (buf = new Uint8Array(buf), "function" == typeof Buffer._augment && (buf = Buffer._augment(buf)), !(buf instanceof Uint8Array)) throw Error("Assertion error, buf should be an Uint8Array");
                return buf
            }
            var Readable = require("stream").Readable,
                inherits = require("inherits"),
                FileReader = global.FileReader,
                Uint8Array = global.Uint8Array;
            module.exports = ReadableBlobStream, inherits(ReadableBlobStream, Readable), ReadableBlobStream.prototype.read = function() {
                var buf = ReadableBlobStream.super_.prototype.read.apply(this, arguments);
                return !Buffer.isBuffer(buf) || buf instanceof Uint8Array || (buf = bufferToUint8Array(buf)), buf
            }, ReadableBlobStream.prototype._read = function(chunkSize) {
                var start, end, size = this._blob.size;
                if (start = this._nextByteStart, end = Math.min(start + chunkSize, size), this._nextByteStart = end, start >= this._blob.size) return void this.push(null);
                var chunk = this._blob.slice(start, end),
                    reader = new FileReader;
                reader.onload = function() {
                    var buf = new Uint8Array(reader.result);
                    buf = uint8ArrayToBuffer(buf), this.push(buf)
                }.bind(this), reader.onerror = function() { this.emit("error", reader.error) }.bind(this), reader.readAsArrayBuffer(chunk)
            }
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, require("buffer").Buffer)
    }, { buffer: 2, inherits: 37, stream: 26 }],
    37: [function(require, module, exports) { arguments[4][7][0].apply(exports, arguments) }, { dup: 7 }],
    38: [function(require, module) {
        function W3CWebSocket(uri, protocols) {
            var native_instance;
            return native_instance = protocols ? new nativeWebSocket(uri, protocols) : new nativeWebSocket(uri)
        }
        var _global = function() {
                return this
            }(),
            nativeWebSocket = _global.WebSocket || _global.MozWebSocket,
            websocket_version = require("./version");
        module.exports = {
            w3cwebsocket: nativeWebSocket ? W3CWebSocket : null,
            version: websocket_version
        }
    }, { "./version": 39 }],
    39: [function(require, module) { module.exports = require("../package.json").version }, { "../package.json": 40 }],
    40: [function(require, module) { module.exports = { name: "websocket", description: "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.", keywords: ["websocket", "websockets", "socket", "networking", "comet", "push", "RFC-6455", "realtime", "server", "client"], author: { name: "Brian McKelvey", email: "brian@worlize.com", url: "https://www.worlize.com/" }, contributors: [{ name: "Iñaki Baz Castillo", email: "ibc@aliax.net", url: "http://dev.sipdoc.net" }], version: "1.0.23", repository: { type: "git", url: "git+https://github.com/theturtle32/WebSocket-Node.git" }, homepage: "https://github.com/theturtle32/WebSocket-Node", engines: { node: ">=0.8.0" }, dependencies: { debug: "^2.2.0", nan: "^2.3.3", "typedarray-to-buffer": "^3.1.2", yaeti: "^0.0.4" }, devDependencies: { "buffer-equal": "^0.0.1", faucet: "^0.0.1", gulp: "git+https://github.com/gulpjs/gulp.git#4.0", "gulp-jshint": "^1.11.2", "jshint-stylish": "^1.0.2", tape: "^4.0.1" }, config: { verbose: !1 }, scripts: { install: "(node-gyp rebuild 2> builderror.log) || (exit 0)", test: "faucet test/unit", gulp: "gulp" }, main: "index", directories: { lib: "./lib" }, browser: "lib/browser.js", license: "Apache-2.0", gitHead: "ba2fa7e9676c456bcfb12ad160655319af66faed", bugs: { url: "https://github.com/theturtle32/WebSocket-Node/issues" }, _id: "websocket@1.0.23", _shasum: "20de8ec4a7126b09465578cd5dbb29a9c296aac6", _from: "websocket@>=1.0.22 <2.0.0", _npmVersion: "2.15.1", _nodeVersion: "0.10.45", _npmUser: { name: "theturtle32", email: "brian@worlize.com" }, maintainers: [{ name: "theturtle32", email: "brian@worlize.com" }], dist: { shasum: "20de8ec4a7126b09465578cd5dbb29a9c296aac6", tarball: "https://registry.npmjs.org/websocket/-/websocket-1.0.23.tgz" }, _npmOperationalInternal: { host: "packages-16-east.internal.npmjs.com", tmp: "tmp/websocket-1.0.23.tgz_1463625793005_0.4532310354989022" }, _resolved: "https://registry.npmjs.org/websocket/-/websocket-1.0.23.tgz", readme: "ERROR: No README data found!" } }, {}],
    41: [function(require, module) {
        "use strict";
        var contentTypes = { fLaC: "audio/flac", RIFF: "audio/wav", OggS: "audio/ogg; codecs=opus" };
        module.exports = function(header) {
            return contentTypes[header]
        }
    }, {}],
    42: [function(require, module) {
        "use strict";

        function getContentType(file) {
            return new Promise(function(resolve, reject) {
                var blobToText = new Blob([file]).slice(0, 4),
                    r = new FileReader;
                r.readAsText(blobToText), r.onload = function() {
                    var ct = contentType(r.result);
                    if (ct) resolve(ct);
                    else {
                        var err = new Error("Unable to determine content type from file header; only wav, flac, and ogg/opus are supported.");
                        err.name = "UNRECOGNIZED_FORMAT", reject(err)
                    }
                }
            })
        }

        function FilePlayer(file, contentType) {
            var audio = this.audio = new Audio;
            if (!audio.canPlayType(contentType)) {
                var err = new Error("Current browser is unable to play back " + contentType);
                throw err.name = "UNSUPPORTED_FORMAT", err.contentType = contentType, err
            }
            audio.src = URL.createObjectURL(new Blob([file], { type: contentType })), audio.play(), this.stop = function() { audio.pause(), audio.currentTime = 0 }
        }

        function playFile(file) {
            return getContentType(file).then(function(contentType) {
                return new FilePlayer(file, contentType)
            })
        }
        var contentType = require("./content-type");
        module.exports = FilePlayer, module.exports.getContentType = getContentType, module.exports.playFile = playFile
    }, { "./content-type": 41 }],
    43: [function(require, module) {
        "use strict";

        function FormatStream(opts) {
            this.opts = util._extend({ model: "", hesitation: "…", decodeStrings: !0 }, opts), Transform.call(this, opts), this.isJaCn = "ja-JP" === this.opts.model.substring(0, 5) || "zh-CN" === this.opts.model.substring(0, 5);
            var self = this;
            this.on("pipe", function(source) { source.on("result", self.handleResult.bind(self)), source.stop && (self.stop = source.stop.bind(source)) })
        }
        var Transform = require("stream").Transform,
            util = require("util"),
            clone = require("clone");
        util.inherits(FormatStream, Transform);
        var reHesitation = /%HESITATION\s/g,
            reRepeatedCharacter = /(.)\1{2,}/g,
            reDUnderscoreWords = /D_[^\s]+/g;
        FormatStream.prototype.clean = function(text) {
            return (text = text.trim().replace(reHesitation, this.opts.hesitation).replace(reRepeatedCharacter, "").replace(reDUnderscoreWords, "")) ? (this.isJaCn && (text = text.replace(/ /g, "")), text) : text
        }, FormatStream.prototype.capitalize = function(text) {
            return text.charAt(0).toUpperCase() + text.substring(1)
        }, FormatStream.prototype.period = function(text) {
            return text + (this.isJaCn ? "。" : ". ")
        }, FormatStream.prototype._transform = function(chunk, encoding, next) { this.push(this.period(this.capitalize(this.clean(chunk.toString())))), next() }, FormatStream.prototype.handleResult = function(result) {
            result = clone(result), result.alternatives = result.alternatives.map(function(alt) {
                return alt.transcript = this.capitalize(this.clean(alt.transcript)), result["final"] && (alt.transcript = this.period(alt.transcript)), alt.timestamps && (alt.timestamps = alt.timestamps.map(function(ts, i, arr) {
                    return ts[0] = this.clean(ts[0]), 0 === i && (ts[0] = this.capitalize(ts[0])), i == arr.length - 1 && result["final"] && (ts[0] = this.period(ts[0])), ts
                }, this)), alt
            }, this), this.emit("result", result)
        }, FormatStream.prototype.promise = require("./promise"), FormatStream.prototype.stop = function() {}, module.exports = FormatStream
    }, { "./promise": 47, clone: 31, stream: 26, util: 30 }],
    44: [function(require, module) {
        "use strict";
        module.exports = function(constraints) {
            return navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia(constraints) : new Promise(function(resolve, reject) {
                var gum = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                if (!gum) {
                    var err = error = new Error("MediaStreamError");
                    return error.name = "NotSupportedError", reject(err)
                }
                gum.call(navigator, constraints, resolve, reject)
            })
        }
    }, {}],
    45: [function(require, module) {
        (function(Buffer) {
            "use strict";
            module.exports = { recognizeMicrophone: require("./recognize-microphone"), recognizeBlob: require("./recognize-blob"), recognizeElement: require("./recognize-element"), WebAudioL16Stream: require("./webaudio-l16-stream"), MediaElementAudioStream: require("./media-element-audio-stream"), RecognizeStream: require("./recognize-stream"), FilePlayer: require("./file-player"), getUserMedia: require("./getusermedia"), FormatStream: require("./format-stream"), TimingStream: require("./timing-stream"), MicrophoneStream: require("microphone-stream"), Buffer: Buffer }
        }).call(this, require("buffer").Buffer)
    }, { "./file-player": 42, "./format-stream": 43, "./getusermedia": 44, "./media-element-audio-stream": 46, "./recognize-blob": 48, "./recognize-element": 49, "./recognize-microphone": 50, "./recognize-stream": 51, "./timing-stream": 52, "./webaudio-l16-stream": 53, buffer: 2, "microphone-stream": 32 }],
    46: [function(require, module) {
        (function(process, Buffer) {
            "use strict";

            function MediaElementAudioStream(source, opts) {
                function processAudio(e) { recording && self.push(opts.objectMode ? e.inputBuffer : new Buffer(e.inputBuffer.getChannelData(0))) }

                function connect() { audioInput.connect(scriptProcessor), scriptProcessor.connect(context.destination), source.removeEventListener("playing", connect) }

                function start() { source.play(), source.removeEventListener("canplaythrough", start) }

                function end() { recording = !1, scriptProcessor.disconnect(), audioInput.disconnect(), self.push(null), self.emit("close") }
                opts = util._extend({ bufferSize: "undefined" != typeof AudioContext ? null : 4096, muteSource: !1, autoplay: !0, crossOrigin: "anonymous", objectMode: !0 }, opts);
                var inputChannels = 1,
                    outputChannels = 1;
                Readable.call(this, opts);
                var self = this,
                    recording = !0;
                source.crossOrigin = opts.crossOrigin;
                var AudioContext = window.AudioContext || window.webkitAudioContext,
                    context = source.context = source.context || new AudioContext,
                    audioInput = source.node = source.node || context.createMediaElementSource(source),
                    scriptProcessor = context.createScriptProcessor(opts.bufferSize, inputChannels, outputChannels);
                if (scriptProcessor.onaudioprocess = processAudio, !opts.muteSource) {
                    var gain = context.createGain();
                    audioInput.connect(gain), gain.connect(context.destination)
                }
                source.addEventListener("playing", connect), opts.autoplay && (source.readyState === source.HAVE_ENOUGH_DATA ? source.play() : source.addEventListener("canplaythrough", start)), source.addEventListener("ended", end), this.stop = function() { source.pause(), end() }, source.addEventListener("error", this.emit.bind(this, "error")), process.nextTick(function() { self.emit("format", { channels: 1, bitDepth: 32, sampleRate: context.sampleRate, signed: !0, "float": !0 }) })
            }
            var Readable = require("stream").Readable,
                util = require("util");
            util.inherits(MediaElementAudioStream, Readable), MediaElementAudioStream.prototype._read = function() {}, MediaElementAudioStream.toRaw = function(chunk) {
                return new Float32Array(chunk.buffer)
            }, module.exports = MediaElementAudioStream
        }).call(this, require("_process"), require("buffer").Buffer)
    }, { _process: 9, buffer: 2, stream: 26, util: 30 }],
    47: [function(require, module) {
        "use strict";
        module.exports = function(stream) {
            return stream = stream || this, new Promise(function(resolve, reject) {
                var results = [];
                stream.setEncoding("utf8").on("data", function(result) { results.push(result) }).on("end", function() { resolve(results.join("")) }).on("error", reject)
            })
        }
    }, {}],
    48: [function(require, module) {
        "use strict";
        var BlobStream = require("readable-blob-stream"),
            RecognizeStream = require("./recognize-stream.js"),
            FilePlayer = require("./file-player.js"),
            FormatStream = require("./format-stream.js"),
            TimingStream = require("./timing-stream.js");
        module.exports = function(options) {
            if (!options || !options.token) throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
            var recognizeStream = new RecognizeStream(options),
                stream = new BlobStream(options.data).pipe(recognizeStream);
            return options.format !== !1 && (stream = stream.pipe(new FormatStream(options))), (options.realtime || "undefined" == typeof options.realtime && options.play) && (stream = stream.pipe(new TimingStream(options)), start = Date.now()), options.play && FilePlayer.playFile(options.data).then(function(player) { recognizeStream.on("stop", player.stop.bind(player)) })["catch"](function(err) { recognizeStream.emit("playback-error", err) }), stream
        }
    }, { "./file-player.js": 42, "./format-stream.js": 43, "./recognize-stream.js": 51, "./timing-stream.js": 52, "readable-blob-stream": 36 }],
    49: [function(require, module) {
        "use strict";
        var MediaElementAudioStream = require("./media-element-audio-stream"),
            L16 = require("./webaudio-l16-stream"),
            RecognizeStream = require("./recognize-stream.js"),
            FormatStream = require("./format-stream.js");
        module.exports = function(options) {
            if (!options || !options.token) throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
            options["content-type"] = "audio/l16;rate=16000";
            var recognizeStream = new RecognizeStream(options),
                sourceStream = new MediaElementAudioStream(options.element, options),
                stream = sourceStream.pipe(new L16).pipe(recognizeStream);
            return options.format !== !1 && (stream = stream.pipe(new FormatStream(options))), recognizeStream.on("stop", sourceStream.stop.bind(sourceStream)), stream
        }
    }, { "./format-stream.js": 43, "./media-element-audio-stream": 46, "./recognize-stream.js": 51, "./webaudio-l16-stream": 53 }],
    50: [function(require, module) {
        "use strict";
        var getUserMedia = require("./getusermedia"),
            MicrophoneStream = require("microphone-stream"),
            RecognizeStream = require("./recognize-stream.js"),
            L16 = require("./webaudio-l16-stream.js"),
            FormatStream = require("./format-stream.js");
        module.exports = function(options) {
            if (!options || !options.token) throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
            options["content-type"] = "audio/l16;rate=16000";
            var recognizeStream = new RecognizeStream(options);
            getUserMedia({ video: !1, audio: !0 }).then(function(mic) {
                var micStream = new MicrophoneStream(mic, { objectMode: !0, bufferSize: options.bufferSize });
                micStream.pipe(new L16).pipe(recognizeStream), recognizeStream.on("stop", micStream.stop.bind(micStream))
            })["catch"](recognizeStream.emit.bind(recognizeStream, "error"));
            var stream = recognizeStream;
            return options.format !== !1 && (stream = stream.pipe(new FormatStream(options))), stream
        }
    }, { "./format-stream.js": 43, "./getusermedia": 44, "./recognize-stream.js": 51, "./webaudio-l16-stream.js": 53, "microphone-stream": 32 }],
    51: [function(require, module) {
        (function(process) {
            "use strict";

            function RecognizeStream(options) {
                function flowForResults(event) {
                    ("results" == event || "result" == event) && (self.removeListener("newListener", flowForResults), process.nextTick(function() { self.on("data", function() {}) }))
                }
                Duplex.call(this, options), this.options = options, this.listening = !1, this.initialized = !1, this.finished = !1;
                var self = this;
                this.on("newListener", flowForResults)
            }
            var Duplex = require("stream").Duplex,
                util = require("util"),
                pick = require("object.pick"),
                W3CWebSocket = require("websocket").w3cwebsocket,
                contentType = require("./content-type"),
                OPENING_MESSAGE_PARAMS_ALLOWED = ["continuous", "max_alternatives", "timestamps", "word_confidence", "inactivity_timeout", "content-type", "interim_results", "keywords", "keywords_threshold", "word_alternatives_threshold"],
                QUERY_PARAMS_ALLOWED = ["model", "watson-token"];
            util.inherits(RecognizeStream, Duplex), RecognizeStream.prototype.initialize = function() {
                function emitError(msg, frame, err) { err ? err.message = msg + " " + err.message : err = new Error(msg), err.raw = frame, self.emit("error", err) }
                var options = this.options;
                options.token && !options["watson-token"] && (options["watson-token"] = options.token), options.content_type && !options["content-type"] && (options["content-type"] = options.content_type), options["X-WDC-PL-OPT-OUT"] && !options["X-Watson-Learning-Opt-Out"] && (options["X-Watson-Learning-Opt-Out"] = options["X-WDC-PL-OPT-OUT"]);
                var queryParams = util._extend({ model: "en-US_BroadbandModel" }, pick(options, QUERY_PARAMS_ALLOWED)),
                    queryString = Object.keys(queryParams).map(function(key) {
                        return key + "=" + ("watson-token" == key ? queryParams[key] : encodeURIComponent(queryParams[key]))
                    }).join("&"),
                    url = (options.url || "wss://stream.watsonplatform.net/speech-to-text/api").replace(/^http/, "ws") + "/v1/recognize?" + queryString,
                    openingMessage = util._extend({ action: "start", "content-type": "audio/wav", continuous: !0, interim_results: !0, word_confidence: !0, timestamps: !0, max_alternatives: 3, inactivity_timeout: 30 }, pick(options, OPENING_MESSAGE_PARAMS_ALLOWED)),
                    self = this,
                    socket = this.socket = new W3CWebSocket(url, null, null, options.headers, null);
                self.on("finish", self.finish.bind(self)), socket.onerror = function(error) { self.listening = !1, self.emit("error", error) }, this.socket.onopen = function() { self.sendJSON(openingMessage), self.emit("connect") }, this.socket.onclose = function(e) { self.listening && (self.listening = !1, self.push(null)), self.emit("close", e.code, e.reason) }, socket.onmessage = function(frame) {
                    if ("string" != typeof frame.data) return emitError("Unexpected binary data received from server", frame);
                    var data;
                    try { data = JSON.parse(frame.data) } catch (jsonEx) {
                        return emitError("Invalid JSON received from service:", frame, jsonEx)
                    }
                    self.emit("message", data), data.error ? emitError(data.error, frame) : "listening" === data.state ? self.listening ? (self.listening = !1, self.push(null), socket.close()) : (self.listening = !0, self.emit("listening")) : data.results ? (self.emit("results", data.results), data.results.forEach(function(result) { result.index = data.result_index, self.emit("result", result), result["final"] && result.alternatives && self.push(result.alternatives[0].transcript, "utf8") })) : emitError("Unrecognised message from server", frame)
                }, this.initialized = !0
            }, RecognizeStream.prototype.sendJSON = function(msg) {
                return this.emit("send-json", msg), this.socket.send(JSON.stringify(msg))
            }, RecognizeStream.prototype.sendData = function(data) {
                return this.emit("send-data", data), this.socket.send(data)
            }, RecognizeStream.prototype._read = function() {}, RecognizeStream.prototype._write = function(chunk, encoding, callback) {
                var self = this;
                self.finished || (self.listening ? (self.sendData(chunk), this.afterSend(callback)) : (this.initialized || (this.options["content-type"] || (this.options["content-type"] = RecognizeStream.getContentType(chunk)), this.initialize()), this.once("listening", function() { self.sendData(chunk), this.afterSend(callback) })))
            }, RecognizeStream.prototype.afterSend = function(next) { this.socket.bufferedAmount <= this._writableState.highWaterMark ? next() : setTimeout(this.afterSend.bind(this, next), 10) }, RecognizeStream.prototype.stop = function() { this.emit("stop"), this.finish() }, RecognizeStream.prototype.finish = function() {
                if (!this.finished) {
                    this.finished = !0;
                    var self = this,
                        closingMessage = { action: "stop" };
                    self.socket ? self.sendJSON(closingMessage) : this.once("connect", function() { self.sendJSON(closingMessage) })
                }
            }, RecognizeStream.prototype.promise = require("./promise"), RecognizeStream.getContentType = function(buffer) {
                return contentType(buffer.slice(0, 4).toString())
            }, module.exports = RecognizeStream
        }).call(this, require("_process"))
    }, { "./content-type": 41, "./promise": 47, _process: 9, "object.pick": 33, stream: 26, util: 30, websocket: 38 }],
    52: [function(require, module) {
        "use strict";

        function TimingStream(opts) {
            this.opts = util._extend({ emitAt: TimingStream.START, delay: 0, allowHalfOpen: !0 }, opts), Duplex.call(this, opts), this.startTime = Date.now(), this["final"] = [], this.interim = [], this.nextTick = null, this.sourceEnded = !1;
            var self = this;
            this.on("pipe", function(source) { source.on("result", self.handleResult.bind(self)), source.stop && (self.stop = source.stop.bind(source)), source.on("end", function() { self.sourceEnded = !0 }) })
        }

        function noTimestamps(result) {
            var alt = result.alternatives && result.alternatives[0];
            return alt && alt.transcript.trim() && !alt.timestamps || !alt.timestamps.length
        }
        var Duplex = require("stream").Duplex,
            util = require("util"),
            clone = require("clone");
        util.inherits(TimingStream, Duplex), TimingStream.START = 1, TimingStream.END = 2, TimingStream.prototype._write = function(chunk, encoding, next) { next() }, TimingStream.prototype._read = function() {}, TimingStream.prototype.cutoff = function() {
            return (Date.now() - this.startTime) / 1e3 - this.opts.delay
        }, TimingStream.prototype.withinRange = function(result, cutoff) {
            return result.alternatives.some(function(alt) {
                var timestamp = alt.timestamps[0];
                return !!timestamp && timestamp[this.opts.emitAt] <= cutoff
            }, this)
        }, TimingStream.prototype.completelyWithinRange = function(result, cutoff) {
            return result.alternatives.every(function(alt) {
                var timestamp = alt.timestamps[alt.timestamps.length - 1];
                return timestamp[this.opts.emitAt] <= cutoff
            }, this)
        }, Duplex.prototype.crop = function(result, cutoff) {
            return result = clone(result), result.alternatives = result.alternatives.map(function(alt) {
                for (var timestamp, timestamps = [], i = 0; i < alt.timestamps.length && (timestamp = alt.timestamps[i], timestamp[this.opts.emitAt] <= cutoff); i++) timestamps.push(timestamp);
                return alt.timestamps = timestamps, alt.transcript = timestamps.map(function(ts) {
                    return ts[0]
                }).join(" "), alt
            }, this), result["final"] = !1, result
        }, TimingStream.prototype.getCurrentResult = function(results, cutoff) {
            return results.length && this.withinRange(results[0], cutoff) ? this.completelyWithinRange(results[0], cutoff) ? results.shift() : this.crop(results[0], cutoff) : void 0
        }, TimingStream.prototype.tick = function() {
            var cutoff = this.cutoff();
            clearTimeout(this.nextTick);
            var result = this.getCurrentResult(this["final"], cutoff);
            return result || (result = this.getCurrentResult(this.interim, cutoff)), result && (this.emit("result", result), result["final"]) ? (this.push(result.alternatives[0].transcript), this.nextTick = setTimeout(this.tick.bind(this), 0)) : void this.scheduleNextTick(cutoff)
        }, TimingStream.prototype.scheduleNextTick = function(cutoff) {
            var nextResult = this["final"][0] || this.interim[0];
            if (nextResult) {
                for (var timestamps = nextResult.alternatives[0].timestamps, i = 0; i < timestamps.length; i++) {
                    var wordOffset = timestamps[i][this.opts.emitAt];
                    if (wordOffset > cutoff) return this.nextTick = setTimeout(this.tick.bind(this), this.startTime + 1e3 * wordOffset)
                }
                throw new Error("No future words found")
            }
            this.sourceEnded && (this.emit("close"), this.push(null))
        }, TimingStream.prototype.handleResult = function(result) {
            if (noTimestamps(result)) throw new Error("TimingStream requires timestamps");
            for (result.alternatives.length > 1 && (result.alternatives.length = 1); this.interim.length && this.interim[0].index <= result.index;) this.interim.shift();
            result["final"] ? this["final"].push(result) : this.interim.push(result), this.tick()
        }, TimingStream.prototype.stop = function() {}, module.exports = TimingStream
    }, { clone: 31, stream: 26, util: 30 }],
    53: [function(require, module) {
        (function(process, Buffer) {
            "use strict";

            function WebAudioL16Stream(opts) { opts = this.opts = util._extend({ sourceSampleRate: 48e3, writableObjectMode: !0, downsample: !0 }, opts), Transform.call(this, opts), this.bufferUnusedSamples = [], opts.writableObjectMode ? (this.formatEmitted = !1, this._transform = this.handleFirstAudioBuffer) : (this._transform = this.transformBuffer, process.nextTick(this.emitFormat.bind(this))) }
            var Transform = require("stream").Transform,
                util = require("util"),
                TARGET_SAMPLE_RATE = 16e3;
            util.inherits(WebAudioL16Stream, Transform), WebAudioL16Stream.prototype.emitFormat = function() { this.formatEmitted = !0, this.emit("format", { channels: 1, bitDepth: 16, sampleRate: this.opts.downsample ? TARGET_SAMPLE_RATE : this.opts.sourceSampleRate, signed: !0, "float": !1 }) }, WebAudioL16Stream.prototype.downsample = function(bufferNewSamples) {
                var buffer = null,
                    newSamples = bufferNewSamples.length,
                    unusedSamples = this.bufferUnusedSamples.length;
                if (unusedSamples > 0) {
                    buffer = new Float32Array(unusedSamples + newSamples);
                    for (var i = 0; unusedSamples > i; ++i) buffer[i] = this.bufferUnusedSamples[i];
                    for (i = 0; newSamples > i; ++i) buffer[unusedSamples + i] = bufferNewSamples[i]
                } else buffer = bufferNewSamples;
                for (var offset, filter = [-.037935, -89024e-8, .040173, .019989, .0047792, -.058675, -.056487, -.0040653, .14527, .26927, .33913, .26927, .14527, -.0040653, -.056487, -.058675, .0047792, .019989, .040173, -89024e-8, -.037935], samplingRateRatio = this.opts.sourceSampleRate / TARGET_SAMPLE_RATE, nOutputSamples = Math.floor((buffer.length - filter.length) / samplingRateRatio) + 1, outputBuffer = new Float32Array(nOutputSamples), i2 = 0; i2 + filter.length - 1 < buffer.length; i2++) {
                    offset = Math.round(samplingRateRatio * i2);
                    for (var sample = 0, j = 0; j < filter.length; ++j) sample += buffer[offset + j] * filter[j];
                    outputBuffer[i2] = sample
                }
                var indexSampleAfterLastUsed = Math.round(samplingRateRatio * i2),
                    remaining = buffer.length - indexSampleAfterLastUsed;
                if (remaining > 0)
                    for (this.bufferUnusedSamples = new Float32Array(remaining), i = 0; remaining > i; ++i) this.bufferUnusedSamples[i] = buffer[indexSampleAfterLastUsed + i];
                else this.bufferUnusedSamples = new Float32Array(0);
                return outputBuffer
            }, WebAudioL16Stream.prototype.floatTo16BitPCM = function(input) {
                for (var output = new DataView(new ArrayBuffer(2 * input.length)), i = 0; i < input.length; i++) {
                    var multiplier = input[i] < 0 ? 32768 : 32767;
                    output.setInt16(2 * i, input[i] * multiplier | 0, !0)
                }
                return new Buffer(output.buffer)
            }, WebAudioL16Stream.prototype.handleFirstAudioBuffer = function(audioBuffer, encoding, next) { this.opts.sourceSampleRate = audioBuffer.sampleRate, this.formatEmitted || this.emitFormat(), this._transform = this.transformAudioBuffer, this._transform(audioBuffer, encoding, next) }, WebAudioL16Stream.prototype.transformAudioBuffer = function(audioBuffer, encoding, next) {
                var source = audioBuffer.getChannelData(0);
                this.opts.downsample && (source = this.downsample(source)), this.push(this.floatTo16BitPCM(source)), next()
            }, WebAudioL16Stream.prototype.transformBuffer = function(nodebuffer, encoding, next) {
                var source = new Float32Array(nodebuffer.buffer);
                this.opts.downsample && (source = this.downsample(source)), this.push(this.floatTo16BitPCM(source)), next()
            }, module.exports = WebAudioL16Stream
        }).call(this, require("_process"), require("buffer").Buffer)
    }, { _process: 9, buffer: 2, stream: 26, util: 30 }],
    54: [function(require, module, exports) {
        "use strict";

        function build_concept_map(results) {
            // var concept_map={};
            // console.log(results[0]);
            if(results && results.concepts.length!=0){
                // var ctr=0;
                var concept_map=[];
                for(var i=0; i< results.concepts.length; i++){
                    var temp ={};
                    temp.text = results.concepts[i].text;
                    temp.relevance=results.concepts[i].relevance;
                    temp.dbpedia = results.concepts[i].dbpedia;
                    concept_map.push(temp);

                }
                return concept_map;
            }
            // for (var concept_map = {}, i = 0; i < results.annotations.length; i++) {
            //     var current_statistics = {};
            //     results.annotations[i].concept.label in concept_map ? current_statistics = concept_map[results.annotations[i].concept.label] : (current_statistics.score = 0, current_statistics.count = 0, current_statistics.maxpos = -1, current_statistics.label = results.annotations[i].concept.label, current_statistics.id = results.annotations[i].concept.id), current_statistics.score += p_to_llr(results.annotations[i].score), current_statistics.count += 1, current_statistics.maxpos = Math.max(current_statistics.maxpos, results.annotations[i].text_index[0]), concept_map[results.annotations[i].concept.label] = current_statistics
            // }
            // return concept_map
        }

        function update_transcript_content(transcript, text, annotations) {
            annotations.sort(function(a, b) {
                return a.text_index[0] - b.text_index[0]
            });
            for (var html = "<span>", t = 0, tc = 0, a = 0, i = 0; i < text.length; i++) a < annotations.length && i == annotations[a].text_index[0] && (html += '<span class="transcript-concept"><b>'), a < annotations.length && i == annotations[a].text_index[1] && (html += "</b></span>", a++), html += text[i], tc++, tc >= transcript[t].text.length && (tc = 0, t++, html += "</span><span>");
            html += '<span class="transcript-current-sentence">&nbsp;</span>', $(".transcript--content").html(html)
        }

        function update_timeline(transcript, annotations) {
            if (0 != annotations.length && (annotations.sort(function(a, b) {
                    return b.text_index[0] - a.text_index[0]
                }), !(annotations[0].text_index[0] <= conceptState.top_annotation_offset))) {
                for (var new_annotations = [], i = 0; i < annotations.length && !(annotations[i].text_index[0] <= conceptState.top_annotation_offset); i++) new_annotations.unshift(annotations[i]);
                for (var i = 0; i < new_annotations.length; i++) new_annotations[i].count = i;
                conceptState.top_annotation_offset = annotations[0].text_index[0], conceptState.timeline_annotations.push.apply(conceptState.timeline_annotations, new_annotations), conceptState.transcript = transcript, null == conceptState.timeline_callback && update_timeline_content()
            }
        }

        function update_timeline_content() {
            window.clearTimeout(conceptState.timeline_callback), conceptState.timeline_callback = null;
            var annotation = conceptState.timeline_annotations.shift(),
                mention = get_transcript_with_offset(annotation.text_index[0], conceptState.transcript),
                subtext = get_text_window(annotation.text_index[0], annotation.text_index[1], conceptState.text, NUM_WORDS_TIMELINE),
                html = '<div class="timeline--content-block">';
            if (html += annotation.score > .7 ? '<span class="timeline--content-high-icon"></span>' : annotation.score > .3 ? '<span class="timeline--content-middle-icon"></span>' : '<span class="timeline--content-low-icon"></span>', first) html += '<div class="timeline--content-inner-container timeline--very-first-content-inner-container">', first = !1;
            else {
                var c = $(".timeline--very-first-content-inner-container");
                c.length > 0 && (c.removeClass("timeline--very-first-content-inner-container"), c.addClass("timeline--last-content-inner-container")), html += '<div class="timeline--content-inner-container timeline--first-content-inner-container" style="display:none;">'
            }
            html += '<div class="timeline--content">', html += '<div class="timeline--content-title">', html += annotation.concept.label, html += "</div>", html += '<div class="timeline--content-date">', html += secondsToString(mention.timestamp + annotation.count), html += "</div>", html += '<div class="timeline--content-text">', html += "..." + subtext + "..", html += "</div>", html += "</div>", html += "</div>", html += "</div>", $(".timeline--first-content-inner-container").toggleClass("timeline--first-content-inner-container"), $(".timeline--content-container").prepend(html), $(".timeline--first-content-inner-container").fadeIn("slow"), conceptState.timeline_annotations.length > 0 && (conceptState.timeline_callback = window.setTimeout(update_timeline_content, 2500))
        }

        function secondsToString(sec) {
            var d = new Date(1e3 * sec).toUTCString().split(" ")[4].split(":"),
                str = "";
            return 0 != d[0] ? (str += parseInt(d[0]) + "h ", str += d[1] + "m ", str += d[2] + "s") : (0 != d[1] && (str += parseInt(d[1]) + "m "), str += d[2] + "s")
        }

        function get_transcript_with_offset(offset, transcript) {
            var i = 0,
                l = 0;
            for (i = 0; i < transcript.length && (l += transcript[i].text.length, !(l > offset)); i++);
            return transcript[i]
        }

        function get_text_window(offset_begin, offset_end, text, n_words) {
            var s = text.split(" "),
                l = 0,
                w = 0;
            for (w = 0; w < s.length && !(l >= offset_begin); w++) l += s[w].length + 1;
            for (var begin = Math.max(0, w - n_words), end = Math.min(s.length, w + n_words + 1), subtext = "", concept_len = offset_end - offset_begin, i = begin; end > i; i++)
                if (i == w) {
                    subtext += '<span class="transcript-concept"><b>';
                    for (var j = i + 1; s.slice(i, j).join(" ").length < concept_len && end > j;) j++;
                    subtext += s.slice(i, j).join(" "), subtext += "</b></span> "
                } else subtext += s[i] + " ";
            return subtext
        }

        function get_top_concepts(concept_map) {
            var concept_array = [];
            for (var k in concept_map) concept_array.push(concept_map[k]);
            return concept_array.sort(function(a, b) {
                return b.score - a.score
            }), concept_array.slice(0, NUM_TOP_CONCEPTS)
        }

        function update_recommendations(concepts, all_annotations) {
            if (!(concepts.length < NUM_TOP_CONCEPTS)) {
                for (var ids = [], i = 0; i < concepts.length; i++) ids.push(concepts[i].id);
                $.get("/api/conceptualSearch", { ids: ids, limit: 2, documents_fields: JSON.stringify({ user_fields: 1 }) }).done(function(results) {
                    if (void 0 != results.results && 0 != results.results.length) {
                        for (var html = "", i = 0; 2 > i && i < results.results.length; i++) {
                            var recommended_concepts = pick_related_concepts(results.results[i].explanation_tags, concepts, all_annotations);
                            html += '<div class="recommendation--container">', html += '<div class="recommendation--TED">', html += '<div class="recommendation--TED-thumb">';
                            var thumb = results.results[i].user_fields.thumbnail;
                            thumb = thumb.slice(0, thumb.indexOf("?")) + "?quality=20&w=70", html += '<a class="ted-link" href="' + results.results[i].user_fields.url + '"><img src="' + thumb + '" style="width: 4.1em;"></a>', html += "</div>", html += '<div class="recommendation--TED-title-author">', html += '<div class="recommendation--TED-title">', html += '<a class="ted-link" href="' + results.results[i].user_fields.url + '">' + results.results[i].user_fields.title + "</a>", html += "</div>", html += '<div class="recommendation--TED-author">', html += results.results[i].user_fields.speaker, html += "</div>", html += "</div>", html += "</div>", html += '<div class="recommendation--concept-container">';
                            for (var j = 0; j < recommended_concepts.length; j++) html += '<div class="recommendation--concept">', html += recommended_concepts[j].label, html += "</div>";
                            html += "</div>", html += "</div>"
                        }
                        $(".recommendation--container").remove(), $(".recommendation--content-container").append(html), $("._dashboard--recommendation").fadeIn("slow")
                    }
                })
            }
        }

        function update_concepts(concepts){
            if(concepts.length !=0){
                for(var html="", i=0;i<concepts.length;i++){
                    html+=  JSON.stringify(concepts[i],null,4)+'<br' ;
                }
                var out = '<div class="recommendation--container">' + html + '</div';
                $(".recommendation--content-container").append(html), $("._dashboard--recommendation").fadeIn("slow")
            }
        }

        function pick_related_concepts(candidate_tags, top_concepts, all_annotations) {
            for (var recommended_concepts = [], i = 0; i < candidate_tags.length; i++) {
                for (var found = !1, j = 0; j < all_annotations.length; j++)
                    if (candidate_tags[i].concept.id == all_annotations[j].concept.id) {
                        found = !0;
                        break
                    }
                if (0 == found && recommended_concepts.push(candidate_tags[i].concept), recommended_concepts.length >= NUM_TOP_CONCEPTS) break
            }
            return recommended_concepts.push.apply(recommended_concepts, top_concepts), recommended_concepts.slice(0, NUM_TOP_CONCEPTS)
        }

        function truncate(t, threshold) {
            return null == threshold && (threshold = 30), t.length > threshold - 3 ? t.substring(0, threshold - 3) + "..." : t
        }

        function llr_to_p(llr) {
            return Math.exp(llr) / (1 + Math.exp(llr))
        }

        function p_to_llr(p) {
            return Math.log(p / (1 - p))
        }

        function radius_from_score(score) {
            return 15 * Math.max(0, score - .4)
        }
        var conceptState = { text: "", transcript: [], top_annotation_offset: -1, timeline_annotations: [], timeline_callback: null },
            NUM_TOP_CONCEPTS = 3,
            NUM_WORDS_TIMELINE = 8;
        exports.update_transcript = function(transcript) {
            for (var text = "", i = 0; i < transcript.length; i++) text += transcript[i].text;
            0 != text.length && text != conceptState.text && (conceptState.top_annotation_offset <= 0 && update_transcript_content(transcript, text, []), $.get("/alchmey", { text: text })
                .done(function(results) {
                // console.log(results);
                var concept_map = build_concept_map(results);
                console.log(concept_map);
                if (conceptState.text = text, concept_map != null) {
                    // update_transcript_content(transcript, text, results.annotations), update_timeline(transcript, results.annotations);
                    // var top_concepts = get_top_concepts(concept_map);
                    // update_recommendations(top_concepts, results.annotations)
                    update_concepts(concept_map);
                }
            }))
        }, exports.build_related_concept_map = function(results, avoid_concept_map) {
            for (var related_concepts = {}, i = 0; i < results.results.length; i++)
                for (var j = 0; j < results.results[i].explanation_tags.length; j++) {
                    var e = results.results[i].explanation_tags[j],
                        c = e.concept;
                    c.label in avoid_concept_map || (entry = {}, entry.score = e.score, entry.label = c.label, entry.id = c.id, related_concepts[c.label] = entry)
                }
            return related_concepts
        }, exports.build_related_document_map = function(results) {
            for (var related_docs = {}, i = 0; i < results.results.length; i++) d = results.results[i], entry = {}, entry.score = d.score, entry.label = d.label, entry.id = d.id, related_docs[d.label] = entry;
            return related_docs
        };
        var first = !0;
        exports.initContainer = function(svgContainer) {
            svgContainer.append("text").attr("y", yoffset + 20).attr("x", 30).text("Ordered by recency").attr("class", "titles").style("fill", "#d74108").style("font-weight", 600);
            svgContainer.append("text").attr("y", yoffset + 20).attr("x", 300).text("Ordered by confidence").attr("class", "titles").style("fill", "#d74108").style("font-weight", 600), svgContainer.append("text").attr("y", yoffset + 20).attr("x", 570).text("Predictions of relevant concepts").attr("class", "titles").style("fill", "#d74108").style("font-weight", 600), svgContainer.append("text").attr("y", 20).attr("x", 30).text("Predictions of interesting TED talks").attr("class", "titles").style("fill", "#d74108").style("font-weight", 600)
        };
        var yoffset = 120;
        exports.add_related_documents_to_container = function(related_documents, svgContainer) {
            var documents = [];
            for (var label in related_documents) documents.push(related_documents[label]);
            documents.sort(function(a, b) {
                return a.score < b.score ? 1 : a.score > b.score ? -1 : 0
            });
            for (var data = [], j = 0; j < documents.length; j++) data.push({ id: documents[j].id, score: documents[j].score, label: documents[j].label, y: 40 + 20 * j, x: 30 });
            var text = svgContainer.selectAll(".related_document_list").data(data, function(d) {
                return d.id
            });
            text.enter().append("text").attr("y", function(d) {
                return d.y
            }).attr("x", function(d) {
                return d.x
            }).attr("alignment-baseline", "middle").attr("class", "related_document_list").text(function(d) {
                return d.label
            }), text.transition().attr("y", function(d) {
                return d.y
            }).attr("x", function(d) {
                return d.x
            }).attr("alignment-baseline", "middle").attr("class", "related_document_list").text(function(d) {
                return d.label
            }), text.exit().remove()
        }, exports.add_related_concepts_to_container = function(concept_map, svgContainer) {
            var concepts = [];
            for (var label in concept_map) concepts.push(concept_map[label]);
            concepts.sort(function(a, b) {
                return a.score < b.score ? 1 : a.score > b.score ? -1 : 0
            });
            for (var data = [], j = 0; j < concepts.length; j++) data.push({ id: "byscore_" + concepts[j].label, score: concepts[j].score, label: concepts[j].label, y: yoffset + 40 + 20 * j, x: 570 });
            var text = svgContainer.selectAll(".related_concept_list").data(data, function(d) {
                return d.id
            });
            text.enter().append("text").attr("y", function(d) {
                return d.y
            }).attr("x", function(d) {
                return d.x
            }).attr("alignment-baseline", "middle").attr("class", "related_concept_list").text(function(d) {
                return truncate(d.label, 50)
            }), text.transition().attr("y", function(d) {
                return d.y
            }).attr("x", function(d) {
                return d.x
            }).attr("alignment-baseline", "middle").attr("class", "related_concept_list").text(function(d) {
                return truncate(d.label, 50)
            }), text.exit().remove()
        }, exports.add_concepts_to_container = function(concept_map, svgContainer) {
            var concepts = [];
            for (var label in concept_map) concepts.push(concept_map[label]);
            if (0 != concepts.length) {
                concepts.sort(function(a, b) {
                    return a.maxpos < b.maxpos ? 1 : a.maxpos > b.maxpos ? -1 : 0
                });
                for (var data = [], j = 0; j < concepts.length; j++) data.push({ id: "byscore_" + concepts[j].label, score: llr_to_p(concepts[j].score), label: concepts[j].label, y: yoffset + 40 + 20 * j, x: 30 });
                concepts.sort(function(a, b) {
                    return a.score < b.score ? 1 : a.score > b.score ? -1 : 0
                });
                for (var j = 0; j < concepts.length; j++) data.push({ id: "byrecency_" + concepts[j].label, score: llr_to_p(concepts[j].score), label: concepts[j].label, y: yoffset + 40 + 20 * j, x: 300 });
                var text = svgContainer.selectAll(".concept_list").data(data, function(d) {
                    return d.id
                });
                text.enter().append("text").attr("y", function(d) {
                    return d.y
                }).attr("x", function(d) {
                    return d.x
                }).attr("alignment-baseline", "middle").attr("class", "concept_list").text(function(d) {
                    return truncate(d.label)
                }), text.transition().attr("y", function(d) {
                    return d.y
                }).attr("x", function(d) {
                    return d.x
                }).attr("alignment-baseline", "middle").attr("class", "concept_list").text(function(d) {
                    return truncate(d.label)
                }), text.exit().remove();
                var scale = d3.scale.linear().domain([.4, 1]).range(["red", "LightGreen"]),
                    circles = svgContainer.selectAll(".score_circle").data(data, function(d) {
                        return d.id
                    });
                circles.enter().append("circle").attr("cy", function(d) {
                    return d.y
                }).attr("cx", function(d) {
                    return d.x - 15
                }).attr("r", function(d) {
                    return radius_from_score(d.score)
                }).attr("class", "score_circle").style("fill", function(d) {
                    return scale(d.score)
                }), circles.transition().attr("cy", function(d) {
                    return d.y
                }).attr("cx", function(d) {
                    return d.x - 15
                }).attr("r", function(d) {
                    return radius_from_score(d.score)
                }).style("fill", function(d) {
                    return scale(d.score)
                }), circles.exit().transition().attr("r", 0).remove()
            }
        }
    }, {}],
    55: [function(require) {
        "use strict";
        var models = require("./data/models.json").models,
            utils = require("./utils");
        utils.initPubSub();
        var initVideoPlay = require("./views/videoplay").initVideoPlay,
            showerror = require("./views/showerror"),
            showError = showerror.showError,
            getModels = require("./models").getModels;
        window.BUFFERSIZE = 8192, $(document).ready(function() {
            $(".timeline--content-block").html(""), $(".recommendation--concept-container").html(""), $(".recommendation--TED").html("");
            var tokenGenerator = utils.createTokenGenerator();
            tokenGenerator.getToken(function(err, token) {
                window.onbeforeunload = function() { localStorage.clear() }, token || (console.error("No authorization token available"), console.error("Attempting to reconnect..."), showError(err && err.code ? "Server error " + err.code + ": " + err.error : "Server error " + err.code + ": please refresh your browser and try again"));
                var viewContext = { currentModel: "en-US_BroadbandModel", models: models, token: token, bufferSize: BUFFERSIZE };
                initVideoPlay(viewContext), localStorage.setItem("models", JSON.stringify(models)), localStorage.setItem("playbackON", !1);
                for (var query = window.location.search.substring(1), vars = query.split("&"), i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    "debug" === decodeURIComponent(pair[0]) && localStorage.setItem("playbackON", decodeURIComponent(pair[1]))
                }
                localStorage.setItem("currentModel", "en-US_BroadbandModel"), localStorage.setItem("sessionPermissions", "true"), getModels(token), $.subscribe("clearscreen", function() { $("#resultsText").text(""), $("#resultsJSON").text(""), $(".error-row").hide(), $(".notification-row").hide(), $(".hypotheses > ul").empty(), $("#metadataTableBody").empty() })
            }), $(".video-session--another-video-btn").on("click", function() { window.location = "/" }), $(".recommendation--content-container").hide(), $("._dashboard--timeline").hide()
        })
    }, { "./data/models.json": 56, "./models": 57, "./utils": 58, "./views/showerror": 60, "./views/videoplay": 61 }],
    56: [function(require, module) { module.exports = { models: [{ url: "https://stream.watsonplatform.net/speech-to-text/api/v1/models/en-US_BroadbandModel", rate: 16e3, name: "en-US_BroadbandModel", language: "en-US", description: "US English broadband model." }, { url: "https://stream.watsonplatform.net/speech-to-text/api/v1/models/en-US_NarrowbandModel", rate: 8e3, name: "en-US_NarrowbandModel", language: "en-US", description: "US English narrowband model." }] } }, {}],
    57: [function(require, module, exports) {
        "use strict";
        var selectModel = require("./views/selectmodel").initSelectModel;
        exports.getModels = function(token) {
            var viewContext = { currentModel: "en-US_BroadbandModel", models: null, token: token, bufferSize: BUFFERSIZE },
                modelUrl = "https://stream.watsonplatform.net/speech-to-text/api/v1/models",
                sttRequest = new XMLHttpRequest;
            sttRequest.open("GET", modelUrl, !0), sttRequest.withCredentials = !0, sttRequest.setRequestHeader("Accept", "application/json"), sttRequest.setRequestHeader("X-Watson-Authorization-Token", token), sttRequest.onload = function() {
                var response = JSON.parse(sttRequest.responseText),
                    sorted = response.models.sort(function(a, b) {
                        return a.name > b.name ? 1 : a.name < b.name ? -1 : 0
                    });
                response.models = sorted, localStorage.setItem("models", JSON.stringify(response.models)), viewContext.models = response.models, selectModel(viewContext)
            }, sttRequest.onerror = function() { viewContext.models = require("./data/models.json").models, selectModel(viewContext) }, sttRequest.send()
        }
    }, { "./data/models.json": 56, "./views/selectmodel": 59 }],
    58: [function(require, module, exports) {
        (function(global) {
            "use strict";
            var $ = "undefined" != typeof window ? window.jQuery : "undefined" != typeof global ? global.jQuery : null,
                fileBlock = function(_offset, length, _file, readChunk) {
                    var r = new FileReader,
                        blob = _file.slice(_offset, length + _offset);
                    r.onload = readChunk, r.readAsArrayBuffer(blob)
                };
            exports.onFileProgress = function(options, ondata, running, onerror, onend, samplingRate) {
                var file = options.file,
                    fileSize = file.size,
                    chunkSize = options.bufferSize || 16e3,
                    offset = 0,
                    readChunk = function(evt) {
                        if (offset >= fileSize) return console.log("Done reading file"), void onend();
                        if (running()) {
                            if (null != evt.target.error) {
                                var errorMessage = evt.target.error;
                                return console.log("Read error: " + errorMessage), void onerror(errorMessage)
                            }
                            var buffer = evt.target.result,
                                len = buffer.byteLength;
                            offset += len, ondata(buffer), samplingRate ? setTimeout(function() { fileBlock(offset, chunkSize, file, readChunk) }, 1e3 * chunkSize / (2 * samplingRate)) : fileBlock(offset, chunkSize, file, readChunk)
                        }
                    };
                fileBlock(offset, chunkSize, file, readChunk)
            }, exports.createTokenGenerator = function() {
                var hasBeenRunTimes = 0;
                return {
                    getToken: function(callback) {
                        if (++hasBeenRunTimes, hasBeenRunTimes > 5) {
                            var err = new Error("Cannot reach server");
                            return void callback(null, err)
                        }
                        var url = "/api/token",
                            tokenRequest = new XMLHttpRequest;
                        tokenRequest.open("POST", url, !0), tokenRequest.setRequestHeader("csrf-token", $('meta[name="ct"]').attr("content")), tokenRequest.onreadystatechange = function() {
                            if (4 === tokenRequest.readyState)
                                if (200 === tokenRequest.status) {
                                    var token = tokenRequest.responseText;
                                    callback(null, token)
                                } else {
                                    var error = "Cannot reach server";
                                    if (tokenRequest.responseText) try { error = JSON.parse(tokenRequest.responseText) } catch (e) { error = tokenRequest.responseText }
                                    callback(error)
                                }
                        }, tokenRequest.send()
                    },
                    getCount: function() {
                        return hasBeenRunTimes
                    }
                }
            }, exports.initPubSub = function() {
                var o = $({});
                $.subscribe = o.on.bind(o), $.unsubscribe = o.off.bind(o), $.publish = o.trigger.bind(o)
            }
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    59: [function(require, module, exports) {
        "use strict";
        require("./videoplay").initPlayVideo;
        exports.initSelectModel = function(ctx) {
            ctx.models.forEach(function(model) { $("#dropdownMenuList").append($("<li>").attr("role", "presentation").append($("<a>").attr("role", "menu-item").attr("href", "/").attr("data-model", model.name).append(model.description.substring(0, model.description.length - 1), 8e3 === model.rate ? " (8KHz)" : " (16KHz)"))) }), $("#dropdownMenuList").click(function(evt) {
                evt.preventDefault(), evt.stopPropagation(), console.log("Change view", $(evt.target).text());
                var newModelDescription = $(evt.target).text(),
                    newModel = $(evt.target).data("model");
                $("#dropdownMenuDefault").empty().text(newModelDescription), $("#dropdownMenu1").dropdown("toggle"), localStorage.setItem("currentModel", newModel), ctx.currentModel = newModel, initVideoPlay(ctx), $.publish("clearscreen")
            })
        }
    }, { "./videoplay": 61 }],
    60: [function(require, module, exports) {
        "use strict";
        exports.showError = function(msg) {
            console.log("Error: ", msg);
            var errorAlert = $(".error-row");
            errorAlert.hide(), errorAlert.css("background-color", "#d74108"), errorAlert.css("color", "white");
            var errorMessage = $("#errorMessage");
            errorMessage.text(msg), errorAlert.show(), $("#errorClose").click(function(e) {
                return e.preventDefault(), errorAlert.hide(), !1
            })
        }, exports.showNotice = function(msg) {
            console.log("Notice: ", msg);
            var noticeAlert = $(".notification-row");
            noticeAlert.hide(), noticeAlert.css("border", "2px solid #ececec"), noticeAlert.css("background-color", "#f4f4f4"), noticeAlert.css("color", "black");
            var noticeMessage = $("#notificationMessage");
            noticeMessage.text(msg), noticeAlert.show(), $("#notificationClose").click(function(e) {
                return e.preventDefault(), noticeAlert.hide(), !1
            })
        }, exports.hideError = function() {
            var errorAlert = $(".error-row");
            errorAlert.hide()
        }
    }, {}],
    61: [function(require, module, exports) {
        "use strict";

        function toggleHowItWorks() { videoProps.howitworks = null, "&nbsp;" != $(".transcript-current-sentence").html() && ($(".how-it-works--loading").hide(), $(".how-it-works--title").show(), $(".recommendation--content-container").show(), $("._dashboard--timeline").fadeIn("slow")) }

        function startVideoSpeechStream() {
            $("._hidden--video").html('<video id="inlinevideo" hidden></video>'), $("#inlinevideo").attr("src", videoProps.curURL + "#t=" + videoProps.currentTime);
            var myMediaElement = document.getElementById("inlinevideo");
            console.log("video: create media element source"), videoProps.stream = WatsonSpeechToText.recognizeElement({ element: myMediaElement, token: videoProps.ctx.token, muteSource: !0, autoPlay: !1 }).pipe(new WatsonSpeechToText.FormatStream), myMediaElement.play(), videoProps.playing = !0, $('<span class="transcript-current-sentence">&nbsp;</span>').appendTo($(".transcript--content")), videoProps.howitworks = window.setTimeout(toggleHowItWorks, 5e3), videoProps.stream.on("result", function(result) { $(".transcript-current-sentence").html(result.alternatives[0].transcript), $(".transcript--content")[0].scrollTop = $(".transcript--content")[0].scrollHeight, result["final"] && (console.log({ text: result.alternatives[0].transcript, timestamp: result.alternatives[0].timestamps[0][1] + videoProps.currentTime }), videoProps.transcript.push({ text: result.alternatives[0].transcript, timestamp: result.alternatives[0].timestamps[0][1] + videoProps.currentTime }), concepts.update_transcript(videoProps.transcript)), null == videoProps.howitworks && toggleHowItWorks() })
        }

        function chooseSupportedFormat(urls) {
            for (var test = document.createElement("video"), i = 0; i < urls.length; i++) {
                var can = test.canPlayType(urls[i].type);
                if (null != can && void 0 != can && can.length > 0) return $(test).remove(), urls[i].url
            }
        }
        var WatsonSpeechToText = require("watson-speech/speech-to-text"),
            concepts = (require("./showerror").showError, require("../concepts")),
            videoProps = { curUrl: "", playing: !1, currentTime: 0, transcript: [] };
        exports.initVideoPlay = function(ctx) {
            for (var params = ($("#inlinevideo"), window.location.href.slice(window.location.href.indexOf("?") + 1).split("&")), video_id = "", i = 0; i < params.length; i++) 0 == params[i].indexOf("v=") && (video_id = params[i].substr(2));
            $.get("/api/video_url?id=https://www.youtube.com/watch?v=" + video_id).done(function(data) { videoProps.curURL = chooseSupportedFormat(data.urls), videoProps.title = data.title, videoProps.ctx = ctx, $(".video-session--video-title").html(videoProps.title), startVideoSpeechStream() }).fail(function() { console.log("Could not process video url") });
            var tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        };
        var player;
        window.onYouTubeIframeAPIReady = function() {
            for (var params = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&"), video_id = "", i = 0; i < params.length; i++) 0 == params[i].indexOf("v=") && (video_id = params[i].substr(2));
            player = new YT.Player("videoSession", { width: "100%", videoId: video_id, playerVars: { controls: 0, autoPlay: 1, rel: 0 }, events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange } })
        }, window.onPlayerReady = function(event) { event.target.playVideo() };
        window.onPlayerStateChange = function(event) { event.data == YT.PlayerState.PAUSED && (videoProps.stream.stop(), console.log("PAUSED"), videoProps.playing = !1, videoProps.stream.stop(), videoProps.currentTime = player.getCurrentTime()), event.data == YT.PlayerState.PLAYING && 1 == !videoProps.playing && videoProps.curURL.length > 0 && (console.log("PLAYING"), startVideoSpeechStream()) }, window.stopVideo = function() { player.stopVideo() }
    }, { "../concepts": 54, "./showerror": 60, "watson-speech/speech-to-text": 45 }]
}, {}, [55]);
