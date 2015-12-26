/* jshint node: true */
"use strict";
var ResultSet = require('./resultset');

function Statement(s) {
  this._s = s;
}

Statement.prototype.close = function(callback) {
  this._s.close(function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

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

Statement.prototype.getFetchSize = function(callback) {
  this._s.getFetchSize(function(err, fetchSize) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, fetchSize);
    }
  });
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

Statement.prototype.getQueryTimeout = function(callback) {
  this._s.getQueryTimeout(function(err, queryTimeout) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, queryTimeout);
    }
  });
};

Statement.prototype.setQueryTimeout = function(seconds, callback) {
  this._s.setQueryTimeout(seconds, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

module.exports = Statement;
