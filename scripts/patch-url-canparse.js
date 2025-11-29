// Small runtime polyfill to add URL.canParse if the Node runtime lacks it.
// Metro (and Expo's Metro) calls URL.canParse — some Node builds or envs
// may not expose that static method. This script provides a safe fallback.

try {
  if (typeof URL !== 'undefined' && typeof URL.canParse !== 'function') {
    Object.defineProperty(URL, 'canParse', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: function (input, base) {
        try {
          if (base) {
            // Attempt to construct with a base
            new URL(input, base);
          } else {
            new URL(input);
          }
          return true;
        } catch (e) {
          return false;
        }
      },
    });
  }
} catch (err) {
  // If anything goes wrong, don't crash the process — Metro will surface
  // a clearer error later. Keep this as a no-op fallback.
}

module.exports = {};
