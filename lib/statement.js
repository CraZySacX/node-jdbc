/* jshint node: true */
"use strict";
var ResultSet = require('./resultset');

function Statement(s) {
  this._s = s;
}

Statement.prototype.executeUpdate = function(sql, callback, arg1) {
    if (typeof sql === 'string' && typeof arg1 === 'undefined') {
      this._s.executeUpdate(sql, function(err, count) {
        if (err) {
          return callback(err);
        }
        return callback(null, count);
      });
    } else {
      return callback(new Error('INVALID ARGUMENTS'));
    }
};

Statement.prototype.executeQuery = function(sql, callback) {
  if (typeof sql === 'string') {
    this._s.executeQuery(sql, function(err, resultset) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new ResultSet(resultset));
      }
    });
  } else {
    return callback(new Error('INVALID ARGUMENTS'));
  }
};

Statement.prototype.execute = function(sql, callback) {
  var s = this._s;
  if (typeof sql === 'string') {
    s.execute(sql, function(err, isResultSet) {
      if (err) {
        return callback(err);
      }
      if (isResultSet) {
        s.getResultSet(function(err, resultset) {
          if (err) {
            return callback(err);
          }
          return callback(null, new ResultSet(resultset));
        });
      } else {
        s.getUpdateCount(function(err, count) {
          if (err) {
            return callback(err);
          }
          return callback(null, count);
        });
      }
    });
  } else {
    return callback(new Error('INVALID ARGUMENTS'));
  }
};

Statement.prototype.setFetchSize = function(rows, callback) {
  this._s.setFetchSize(rows, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

module.exports = Statement;
