var jinst = require("./jinst.js");
var java = jinst.getInstance();

const DM = 'java.sql.DriverManager';

module.exports = {
  deregisterDriver: function(driver, callback) {
    java.callStaticMethod(DM, 'deregisterDriver', driver, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, true);
      }
    });
  },
  getConnection: function(url, callback, propsoruser, password) {
    if (url && typeof propsoruser === 'string' && typeof password === 'string') {
      java.callStaticMethod(DM, 'getConnection', url, propsoruser, password, function(err, conn) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, conn);
        }
      });
    } else if (url && typeof propsoruser === 'object' && !password) {
      java.callStaticMethod(DM, 'getConnection', url, propsoruser, function(err, conn) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, conn);
        }
      });
    } else if (url && !propsoruser && !password) {
      java.callStaticMethod(DM, 'getConnection', url, function(err, conn) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, conn);
        }
      });
    } else {
      return callback(new Error("INVALID ARGUMENTS"));
    }
  },
  getDriver: function(url, callback) {
    java.callStaticMethod(DM, 'getDriver', url, function(err, driver) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, driver);
      }
    });
  },
  getDrivers: function(callback) {
    java.callStaticMethod(DM, 'getDrivers', function(err, drivers) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, drivers);
      }
    });
  },
  getLoginTimeout: function(callback) {
    java.callStaticMethod(DM, 'getLoginTimeout', function(err, seconds) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, seconds);
      }
    });
  },
  getLogWriter: function(callback) {
    java.callStaticMethod(DM, 'getLogWriter', function(err, printwriter) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, printwriter);
      }
    });
  },
  println: function(callback) {
    java.callStaticMethod(DM, 'println', function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, true);
      }
    });
  },
  registerDriver: function(driver, callback) {
    java.callStaticMethod(DM, 'registerDriver', driver, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, true);
      }
    });
  },
  setLoginTimeout: function(seconds, callback) {
    java.callStaticMethod(DM, 'setLoginTimeout', seconds, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, true);
      }
    });
  },
  setLogWriter: function(out, callback) {
    java.callStaticMethod(DM, 'setLogWriter', out, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, true);
      }
    });
  }
};
