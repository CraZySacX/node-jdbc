module.exports = function(fn) {
  return function() {
    var self = this;

    var Promise = require("./jdbc").Promise;

    if (typeof Promise === "undefined" || typeof arguments[arguments.length - 1] === "function") {
      return fn.apply(self, arguments);
    }

    // copy arguments to array
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject) {
      // add custom callback
      args.push(function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });

      try {
        fn.apply(self, args);
      } catch (err) {
        reject(err);
      }
    });
  };
};
