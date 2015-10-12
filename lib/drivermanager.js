/* jshint node: true */
"use strict";
var jinst = require("./jinst.js");
var java = jinst.getInstance();

var DM = 'java.sql.DriverManager';

module.exports = {
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
  getLoginTimeout: function(callback) {
    java.callStaticMethod(DM, 'getLoginTimeout', function(err, seconds) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, seconds);
      }
    });
  },
  registerDriver: function(driver, callback) {
    java.callStaticMethod(DM, 'registerDriver', driver, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null);
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
};
