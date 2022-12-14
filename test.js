/*!
 * hash-wasm (https://www.npmjs.com/package/hash-wasm)
 * (c) Dani Biro
 * @license MIT
 */

!(function (A, I) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? I(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], I)
    : I(
        ((A =
          typeof globalThis !== 'undefined' ? globalThis : A || self).hashwasm =
          A.hashwasm || {}),
      );
})(this, function (A) {
  'use strict';
  function I(A, I, i, C) {
    return new (i || (i = Promise))(function (g, B) {
      function Q(A) {
        try {
          e(C.next(A));
        } catch (A) {
          B(A);
        }
      }
      function h(A) {
        try {
          e(C.throw(A));
        } catch (A) {
          B(A);
        }
      }
      function e(A) {
        var I;
        A.done
          ? g(A.value)
          : ((I = A.value),
            I instanceof i
              ? I
              : new i(function (A) {
                  A(I);
                })).then(Q, h);
      }
      e((C = C.apply(A, I || [])).next());
    });
  }
  var i;
  const C =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : global,
    g = (i = C.Buffer) !== null && void 0 !== i ? i : null,
    B = C.TextEncoder ? new C.TextEncoder() : null;
  function Q(A, I) {
    return (
      (((15 & A) + ((A >> 6) | ((A >> 3) & 8))) << 4) |
      ((15 & I) + ((I >> 6) | ((I >> 3) & 8)))
    );
  }
  function h(A, I) {
    const i = I.length >> 1;
    for (let C = 0; C < i; C++) {
      const i = C << 1;
      A[C] = Q(I.charCodeAt(i), I.charCodeAt(i + 1));
    }
  }
  const e = 'a'.charCodeAt(0) - 10,
    E = '0'.charCodeAt(0);
  function t(A, I, i) {
    let C = 0;
    for (let g = 0; g < i; g++) {
      let i = I[g] >>> 4;
      (A[C++] = i > 9 ? i + e : i + E),
        (i = 15 & I[g]),
        (A[C++] = i > 9 ? i + e : i + E);
    }
    return String.fromCharCode.apply(null, A);
  }
  const w =
      g !== null
        ? A => {
            if (typeof A === 'string') {
              const I = g.from(A, 'utf8');
              return new Uint8Array(I.buffer, I.byteOffset, I.length);
            }
            if (g.isBuffer(A)) {
              return new Uint8Array(A.buffer, A.byteOffset, A.length);
            }
            if (ArrayBuffer.isView(A)) {
              return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
            }
            throw new Error('Invalid data type!');
          }
        : A => {
            if (typeof A === 'string') {
              return B.encode(A);
            }
            if (ArrayBuffer.isView(A)) {
              return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
            }
            throw new Error('Invalid data type!');
          },
    o = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    n = new Uint8Array(256);
  for (let A = 0; A < o.length; A++) {
    n[o.charCodeAt(A)] = A;
  }
  function D(A, I = !0) {
    const i = A.length,
      C = i % 3,
      g = [],
      B = i - C;
    for (let I = 0; I < B; I += 3) {
      const i =
          ((A[I] << 16) & 16711680) +
          ((A[I + 1] << 8) & 65280) +
          (255 & A[I + 2]),
        C =
          o.charAt((i >> 18) & 63) +
          o.charAt((i >> 12) & 63) +
          o.charAt((i >> 6) & 63) +
          o.charAt(63 & i);
      g.push(C);
    }
    if (C === 1) {
      const C = A[i - 1],
        B = o.charAt(C >> 2),
        Q = o.charAt((C << 4) & 63);
      g.push(`${B}${Q}`), I && g.push('==');
    } else if (C === 2) {
      const C = (A[i - 2] << 8) + A[i - 1],
        B = o.charAt(C >> 10),
        Q = o.charAt((C >> 4) & 63),
        h = o.charAt((C << 2) & 63);
      g.push(`${B}${Q}${h}`), I && g.push('=');
    }
    return g.join('');
  }
  function k(A) {
    let I = Math.floor(0.75 * A.length);
    const i = A.length;
    return A[i - 1] === '=' && ((I -= 1), A[i - 2] === '=' && (I -= 1)), I;
  }
  function r(A) {
    const I = k(A),
      i = A.length,
      C = new Uint8Array(I);
    let g = 0;
    for (let I = 0; I < i; I += 4) {
      const i = n[A.charCodeAt(I)],
        B = n[A.charCodeAt(I + 1)],
        Q = n[A.charCodeAt(I + 2)],
        h = n[A.charCodeAt(I + 3)];
      (C[g] = (i << 2) | (B >> 4)),
        (g += 1),
        (C[g] = ((15 & B) << 4) | (Q >> 2)),
        (g += 1),
        (C[g] = ((3 & Q) << 6) | (63 & h)),
        (g += 1);
    }
    return C;
  }
  class f {
    constructor() {
      this.mutex = Promise.resolve();
    }
    lock() {
      let A = () => {};
      return (
        (this.mutex = this.mutex.then(() => new Promise(A))),
        new Promise(I => {
          A = I;
        })
      );
    }
    dispatch(A) {
      return I(this, void 0, void 0, function* () {
        const I = yield this.lock();
        try {
          return yield Promise.resolve(A());
        } finally {
          I();
        }
      });
    }
  }
  const a = 16384,
    F = new f(),
    s = new Map();
  function S(A, i) {
    return I(this, void 0, void 0, function* () {
      let C = null,
        g = null,
        B = !1;
      if (typeof WebAssembly === 'undefined') {
        throw new Error('WebAssembly is not supported in this environment!');
      }
      const e = () =>
          new DataView(C.exports.memory.buffer).getUint32(
            C.exports.STATE_SIZE,
            !0,
          ),
        E = F.dispatch(() =>
          I(this, void 0, void 0, function* () {
            if (!s.has(A.name)) {
              const I = r(A.data),
                i = WebAssembly.compile(I);
              s.set(A.name, i);
            }
            const I = yield s.get(A.name);
            C = yield WebAssembly.instantiate(I, {});
          }),
        ),
        o = (A = null) => {
          (B = !0), C.exports.Hash_Init(A);
        },
        n = A => {
          if (!B) {
            throw new Error('update() called before init()');
          }
          (A => {
            let I = 0;
            for (; I < A.length; ) {
              const i = A.subarray(I, I + a);
              (I += i.length), g.set(i), C.exports.Hash_Update(i.length);
            }
          })(w(A));
        },
        D = new Uint8Array(2 * i),
        k = (A, I = null) => {
          if (!B) {
            throw new Error('digest() called before init()');
          }
          return (
            (B = !1),
            C.exports.Hash_Final(I),
            A === 'binary' ? g.slice(0, i) : t(D, g, i)
          );
        },
        f = A => (typeof A === 'string' ? A.length < 4096 : A.byteLength < a);
      let S = f;
      switch (A.name) {
        case 'argon2':
        case 'scrypt':
          S = () => !0;
          break;
        case 'blake2b':
        case 'blake2s':
          S = (A, I) => I <= 512 && f(A);
          break;
        case 'blake3':
          S = (A, I) => I === 0 && f(A);
          break;
        case 'xxhash64':
        case 'xxhash3':
        case 'xxhash128':
          S = () => !1;
      }
      return (
        yield (() =>
          I(this, void 0, void 0, function* () {
            C || (yield E);
            const A = C.exports.Hash_GetBuffer(),
              I = C.exports.memory.buffer;
            g = new Uint8Array(I, A, a);
          }))(),
        {
          getMemory: () => g,
          writeMemory: (A, I = 0) => {
            g.set(A, I);
          },
          getExports: () => C.exports,
          setMemorySize: A => {
            C.exports.Hash_SetMemorySize(A);
            const I = C.exports.Hash_GetBuffer(),
              i = C.exports.memory.buffer;
            g = new Uint8Array(i, I, A);
          },
          init: o,
          update: n,
          digest: k,
          save: () => {
            if (!B) {
              throw new Error(
                'save() can only be called after init() and before digest()',
              );
            }
            const I = C.exports.Hash_GetState(),
              i = e(),
              g = C.exports.memory.buffer,
              Q = new Uint8Array(g, I, i),
              E = new Uint8Array(4 + i);
            return h(E, A.hash), E.set(Q, 4), E;
          },
          load: I => {
            if (!(I instanceof Uint8Array)) {
              throw new Error(
                'load() expects an Uint8Array generated by save()',
              );
            }
            const i = C.exports.Hash_GetState(),
              g = e(),
              h = 4 + g,
              E = C.exports.memory.buffer;
            if (I.length !== h) {
              throw new Error(
                `Bad state length (expected ${h} bytes, got ${I.length})`,
              );
            }
            if (
              !(function (A, I) {
                if (A.length !== 2 * I.length) {
                  return !1;
                }
                for (let i = 0; i < I.length; i++) {
                  const C = i << 1;
                  if (I[i] !== Q(A.charCodeAt(C), A.charCodeAt(C + 1))) {
                    return !1;
                  }
                }
                return !0;
              })(A.hash, I.subarray(0, 4))
            ) {
              throw new Error(
                'This state was written by an incompatible hash implementation',
              );
            }
            const t = I.subarray(4);
            new Uint8Array(E, i, g).set(t), (B = !0);
          },
          calculate: (A, I = null, B = null) => {
            if (!S(A, I)) {
              return o(I), n(A), k('hex', B);
            }
            const Q = w(A);
            return (
              g.set(Q), C.exports.Hash_Calculate(Q.length, I, B), t(D, g, i)
            );
          },
          hashLength: i,
        }
      );
    });
  }
  var c = {
    name: 'blake2b',
    data: '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',
    hash: '68afc9cf',
  };
  function G(A) {
    return !Number.isInteger(A) || A < 8 || A > 512 || A % 8 != 0
      ? new Error('Invalid variant! Valid values: 8, 16, ..., 512')
      : null;
  }
  function U(A = 512, I = null) {
    if (G(A)) {
      return Promise.reject(G(A));
    }
    let i = null,
      C = A;
    if (I !== null) {
      if (((i = w(I)), i.length > 64)) {
        return Promise.reject(new Error('Max key length is 64 bytes'));
      }
      (g = A), (B = i.length), (C = g | (B << 16));
    }
    var g, B;
    const Q = A / 8;
    return S(c, Q).then(A => {
      C > 512 && A.writeMemory(i), A.init(C);
      const I = {
        init:
          C > 512
            ? () => (A.writeMemory(i), A.init(C), I)
            : () => (A.init(C), I),
        update: i => (A.update(i), I),
        digest: I => A.digest(I),
        save: () => A.save(),
        load: i => (A.load(i), I),
        blockSize: 128,
        digestSize: Q,
      };
      return I;
    });
  }
  new f();
  var p = {
    name: 'argon2',
    data: 'AGFzbQEAAAABKQVgAX8Bf2AAAX9gEH9/f39/f39/f39/f39/f38AYAR/f39/AGACf38AAwYFAAECAwQEBQFwAQEBBQYBAQKAgAIGCAF/AUGQqAQLB0EEBm1lbW9yeQIAEkhhc2hfU2V0TWVtb3J5U2l6ZQAADkhhc2hfR2V0QnVmZmVyAAEOSGFzaF9DYWxjdWxhdGUABArXMwVbAQF/QQAhAQJAIABBACgCgAhrIgBFDQACQCAAQRB2IABBgIB8cSAASWoiAEAAQX9HDQBB/wEhAQwBC0EAIQFBAEEAKQOACCAAQRB0rXw3A4AICyABQRh0QRh1C2oBAn8CQEEAKAKICCIADQBBAD8AQRB0IgA2AogIQYCAIEEAKAKACGsiAUUNAAJAIAFBEHYgAUGAgHxxIAFJaiIAQABBf0cNAEEADwtBAEEAKQOACCAAQRB0rXw3A4AIQQAoAogIIQALIAALnA8BA34gACAEKQMAIhAgACkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDCAQIAwpAwCFIhBCIIkiETcDACAIIBEgCCkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAEIBAgBCkDAIUiEEIoiSIRNwMAIAAgESAAKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAMIBAgDCkDAIUiEEIwiSIRNwMAIAggESAIKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAEIBAgBCkDAIVCAYk3AwAgASAFKQMAIhAgASkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDSAQIA0pAwCFIhBCIIkiETcDACAJIBEgCSkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAFIBAgBSkDAIUiEEIoiSIRNwMAIAEgESABKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACANIBAgDSkDAIUiEEIwiSIRNwMAIAkgESAJKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAFIBAgBSkDAIVCAYk3AwAgAiAGKQMAIhAgAikDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDiAQIA4pAwCFIhBCIIkiETcDACAKIBEgCikDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAGIBAgBikDAIUiEEIoiSIRNwMAIAIgESACKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAOIBAgDikDAIUiEEIwiSIRNwMAIAogESAKKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAGIBAgBikDAIVCAYk3AwAgAyAHKQMAIhAgAykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDyAQIA8pAwCFIhBCIIkiETcDACALIBEgCykDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAHIBAgBykDAIUiEEIoiSIRNwMAIAMgESADKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAPIBAgDykDAIUiEEIwiSIRNwMAIAsgESALKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgACAFKQMAIhAgACkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDyAQIA8pAwCFIhBCIIkiETcDACAKIBEgCikDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAFIBAgBSkDAIUiEEIoiSIRNwMAIAAgESAAKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAPIBAgDykDAIUiEEIwiSIRNwMAIAogESAKKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAFIBAgBSkDAIVCAYk3AwAgASAGKQMAIhAgASkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDCAQIAwpAwCFIhBCIIkiETcDACALIBEgCykDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAGIBAgBikDAIUiEEIoiSIRNwMAIAEgESABKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAMIBAgDCkDAIUiEEIwiSIRNwMAIAsgESALKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAGIBAgBikDAIVCAYk3AwAgAiAHKQMAIhAgAikDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDSAQIA0pAwCFIhBCIIkiETcDACAIIBEgCCkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAHIBAgBykDAIUiEEIoiSIRNwMAIAIgESACKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACANIBAgDSkDAIUiEEIwiSIRNwMAIAggESAIKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgAyAEKQMAIhAgAykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDiAQIA4pAwCFIhBCIIkiETcDACAJIBEgCSkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAEIBAgBCkDAIUiEEIoiSIRNwMAIAMgESADKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAOIBAgDikDAIUiEEIwiSIRNwMAIAkgESAJKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAEIBAgBCkDAIVCAYk3AwALhxoBAX9BACEEQQAgAikDACABKQMAhTcDkAhBACACKQMIIAEpAwiFNwOYCEEAIAIpAxAgASkDEIU3A6AIQQAgAikDGCABKQMYhTcDqAhBACACKQMgIAEpAyCFNwOwCEEAIAIpAyggASkDKIU3A7gIQQAgAikDMCABKQMwhTcDwAhBACACKQM4IAEpAziFNwPICEEAIAIpA0AgASkDQIU3A9AIQQAgAikDSCABKQNIhTcD2AhBACACKQNQIAEpA1CFNwPgCEEAIAIpA1ggASkDWIU3A+gIQQAgAikDYCABKQNghTcD8AhBACACKQNoIAEpA2iFNwP4CEEAIAIpA3AgASkDcIU3A4AJQQAgAikDeCABKQN4hTcDiAlBACACKQOAASABKQOAAYU3A5AJQQAgAikDiAEgASkDiAGFNwOYCUEAIAIpA5ABIAEpA5ABhTcDoAlBACACKQOYASABKQOYAYU3A6gJQQAgAikDoAEgASkDoAGFNwOwCUEAIAIpA6gBIAEpA6gBhTcDuAlB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',
    hash: '59aa4fb4',
  };
  const y = new DataView(new ArrayBuffer(4));
  function K(A) {
    return y.setInt32(0, A, !0), new Uint8Array(y.buffer);
  }
  function Y(A, i, C) {
    return I(this, void 0, void 0, function* () {
      if (C <= 64) {
        const A = yield U(8 * C);
        return A.update(K(C)), A.update(i), A.digest('binary');
      }
      const I = Math.ceil(C / 32) - 2,
        g = new Uint8Array(C);
      A.init(), A.update(K(C)), A.update(i);
      let B = A.digest('binary');
      g.set(B.subarray(0, 32), 0);
      for (let i = 1; i < I; i++) {
        A.init(),
          A.update(B),
          (B = A.digest('binary')),
          g.set(B.subarray(0, 32), 32 * i);
      }
      const Q = C - 32 * I;
      let h;
      return (
        Q === 64 ? ((h = A), h.init()) : (h = yield U(8 * Q)),
        h.update(B),
        (B = h.digest('binary')),
        g.set(B.subarray(0, Q), 32 * I),
        g
      );
    });
  }
  function l(A) {
    return I(this, void 0, void 0, function* () {
      const {parallelism: I, iterations: i, hashLength: C} = A,
        g = w(A.password),
        B = w(A.salt),
        Q = (function (A) {
          switch (A) {
            case 'd':
              return 0;
            case 'i':
              return 1;
            default:
              return 2;
          }
        })(A.hashType),
        {memorySize: e} = A,
        [E, o] = yield Promise.all([S(p, 1024), U(512)]);
      E.setMemorySize(1024 * e + 1024);
      const n = new Uint8Array(24),
        k = new DataView(n.buffer);
      k.setInt32(0, I, !0),
        k.setInt32(4, C, !0),
        k.setInt32(8, e, !0),
        k.setInt32(12, i, !0),
        k.setInt32(16, 19, !0),
        k.setInt32(20, Q, !0),
        E.writeMemory(n, 1024 * e),
        o.init(),
        o.update(n),
        o.update(K(g.length)),
        o.update(g),
        o.update(K(B.length)),
        o.update(B),
        o.update(K(0)),
        o.update(K(0));
      const r = 4 * Math.floor(e / (4 * I)),
        f = new Uint8Array(72),
        a = o.digest('binary');
      f.set(a);
      for (let A = 0; A < I; A++) {
        f.set(K(0), 64), f.set(K(A), 68);
        let I = A * r,
          i = yield Y(o, f, 1024);
        E.writeMemory(i, 1024 * I),
          (I += 1),
          f.set(K(1), 64),
          (i = yield Y(o, f, 1024)),
          E.writeMemory(i, 1024 * I);
      }
      const F = new Uint8Array(1024);
      h(F, E.calculate(new Uint8Array([]), e));
      const s = yield Y(o, F, C);
      if (A.outputType === 'hex') {
        return t(new Uint8Array(2 * C), s, C);
      }
      return A.outputType === 'encoded'
        ? (function (A, I, i) {
            const C = [
              `m=${I.memorySize}`,
              `t=${I.iterations}`,
              `p=${I.parallelism}`,
            ].join(',');
            return `$argon2${I.hashType}$v=19$${C}$${D(A, !1)}$${D(i, !1)}`;
          })(B, A, s)
        : s;
    });
  }
  const J = A => {
    if (!A || typeof A !== 'object') {
      throw new Error('Invalid options parameter. It requires an object.');
    }
    if (!A.password) {
      throw new Error('Password must be specified');
    }
    if (((A.password = w(A.password)), A.password.length < 1)) {
      throw new Error('Password must be specified');
    }
    if (!A.salt) {
      throw new Error('Salt must be specified');
    }
    if (((A.salt = w(A.salt)), A.salt.length < 8)) {
      throw new Error('Salt should be at least 8 bytes long');
    }
    if (!Number.isInteger(A.iterations) || A.iterations < 1) {
      throw new Error('Iterations should be a positive number');
    }
    if (!Number.isInteger(A.parallelism) || A.parallelism < 1) {
      throw new Error('Parallelism should be a positive number');
    }
    if (!Number.isInteger(A.hashLength) || A.hashLength < 4) {
      throw new Error('Hash length should be at least 4 bytes.');
    }
    if (!Number.isInteger(A.memorySize)) {
      throw new Error('Memory size should be specified.');
    }
    if (A.memorySize < 8 * A.parallelism) {
      throw new Error('Memory size should be at least 8 * parallelism.');
    }
    if (
      (void 0 === A.outputType && (A.outputType = 'hex'),
      !['hex', 'binary', 'encoded'].includes(A.outputType))
    ) {
      throw new Error(
        `Insupported output type ${A.outputType}. Valid values: ['hex', 'binary', 'encoded']`,
      );
    }
  };
  (A.argon2Verify = function (A) {
    return I(this, void 0, void 0, function* () {
      (A => {
        if (!A || typeof A !== 'object') {
          throw new Error('Invalid options parameter. It requires an object.');
        }
        if (void 0 === A.hash || typeof A.hash !== 'string') {
          throw new Error('Hash should be specified');
        }
      })(A);
      const I = ((A, I) => {
        const i = I.match(
          /^\$argon2(id|i|d)\$v=([0-9]+)\$((?:[mtp]=[0-9]+,){2}[mtp]=[0-9]+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/,
        );
        if (!i) {
          throw new Error('Invalid hash');
        }
        const [, C, g, B, Q, h] = i;
        if (g !== '19') {
          throw new Error(`Unsupported version: ${g}`);
        }
        const e = {},
          E = {m: 'memorySize', p: 'parallelism', t: 'iterations'};
        return (
          B.split(',').forEach(A => {
            const [I, i] = A.split('=');
            e[E[I]] = parseInt(i, 10);
          }),
          Object.assign(Object.assign({}, e), {
            password: A,
            hashType: C,
            salt: r(Q),
            hashLength: k(h),
            outputType: 'encoded',
          })
        );
      })(A.password, A.hash);
      J(I);
      const i = A.hash.lastIndexOf('$') + 1;
      return (yield l(I)).substring(i) === A.hash.substring(i);
    });
  }),
    (A.argon2d = function (A) {
      return I(this, void 0, void 0, function* () {
        return J(A), l(Object.assign(Object.assign({}, A), {hashType: 'd'}));
      });
    }),
    (A.argon2i = function (A) {
      return I(this, void 0, void 0, function* () {
        return J(A), l(Object.assign(Object.assign({}, A), {hashType: 'i'}));
      });
    }),
    (A.argon2id = function (A) {
      return I(this, void 0, void 0, function* () {
        return J(A), l(Object.assign(Object.assign({}, A), {hashType: 'id'}));
      });
    }),
    Object.defineProperty(A, '__esModule', {value: !0});
});
