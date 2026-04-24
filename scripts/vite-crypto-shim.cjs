const crypto = require('node:crypto');

if (typeof crypto.getRandomValues !== 'function') {
  crypto.getRandomValues = (typedArray) => {
    if (!ArrayBuffer.isView(typedArray)) {
      throw new TypeError('Expected an integer typed array');
    }

    return crypto.randomFillSync(typedArray);
  };
}