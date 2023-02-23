import { Platform } from 'react-native'

const isAndroid = Platform.OS === 'android'

if (typeof global.BigInt === 'undefined') {
  global.BigInt = require('big-integer');
}
if (typeof __dirname === 'undefined') {
  global.__dirname = '/';
}
if (typeof __filename === 'undefined') {
  global.__filename = '';
}
if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

/**
 * We have to do these on android as disabling hermes on android
 * removes the default support for Buffer and WebAssembly
 */
if (isAndroid) {
  global.Buffer = require('buffer').Buffer;
  const hey = global.Buffer.from('Hello World');
  console.log('shim-js Buffer', hey);
  console.log('shim-js Buffer-string', hey.toString());

  global.Buffer.prototype.reverse = function () {
    return require('buffer-reverse')(this, arguments);
  };
  require('react-native-wasm');
}

process.browser = false;

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === 'boolean' && __DEV__;
process.env.NODE_ENV = isDev ? 'development' : 'production';
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : '';
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require('crypto');
