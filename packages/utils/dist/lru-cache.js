"use strict";
exports.__esModule = true;
exports.LruCache = void 0;
var LruCache = /** @class */ (function () {
  function LruCache() {
    this.values = new Map();
    this.maxEntries = 20;
  }
  LruCache.prototype.get = function (key) {
    var hasKey = this.values.has(key);
    var entry = undefined;
    if (hasKey) {
      entry = this.values.get(key);
      this.values["delete"](key);
      this.values.set(key, entry);
    }
    return entry;
  };
  LruCache.prototype.put = function (key, value) {
    if (this.values.size >= this.maxEntries) {
      var keyToDelete = this.values.keys().next().value;
      this.values["delete"](keyToDelete);
    }
    this.values.set(key, value);
  };
  return LruCache;
})();
exports.LruCache = LruCache;
