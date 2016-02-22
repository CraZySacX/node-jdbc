/* jshint node: true */
"use strict";
var _ = require('lodash');
var ResultSet = require('./resultset');
var jinst = require('./jinst');
var java = jinst.getInstance();

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

Statement.prototype.executeUpdate = function(sql, arg1, callback) {
  // Get arguments as an array
  var args = Array.prototype.slice.call(arguments);

  // Pull the callback off the end of the arguments
  callback = args.pop();

  // Check arguments for validity, and return error if invalid
  if(! (_.isString(args[0]) && _.isUndefined(args[1]))) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  // Push a callback handler onto the arguments
  args.push(function(err, count) {
    if (err) {
      return callback(err);
    }
    return callback(null, count);
  });

  // Forward modified arguments to _s.executeUpdate
  this._s.executeUpdate.apply(this._s, args);
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

Statement.prototype.getGeneratedKeys = function(callback) {
  this._s.getGeneratedKeys(function(err, resultset) {
    if(err) {
      return callback(err);
    }
    return callback(null, new ResultSet(resultset));
  });
};

jinst.events.once('initialized', function onInitialized() {
  // The constant indicating that the current ResultSet object should be closed
  // when calling getMoreResults.
  Statement.CLOSE_CURRENT_RESULT = java.getStaticFieldValue('java.sql.Statement', 'CLOSE_CURRENT_RESULT');

  // The constant indicating that the current ResultSet object should not be
  // closed when calling getMoreResults.
  Statement.KEEP_CURRENT_RESULT = java.getStaticFieldValue('java.sql.Statement', 'KEEP_CURRENT_RESULT');

  // The constant indicating that all ResultSet objects that have previously been
  // kept open should be closed when calling getMoreResults.
  Statement.CLOSE_ALL_RESULTS = java.getStaticFieldValue('java.sql.Statement', 'CLOSE_ALL_RESULTS');

  // The constant indicating that a batch statement executed successfully but that
  // no count of the number of rows it affected is available.
  Statement.SUCCESS_NO_INFO = java.getStaticFieldValue('java.sql.Statement', 'SUCCESS_NO_INFO');

  // The constant indicating that an error occured while executing a batch
  // statement.
  Statement.EXECUTE_FAILED = java.getStaticFieldValue('java.sql.Statement', 'EXECUTE_FAILED');

  // The constant indicating that generated keys should be made available for
  // retrieval.
  Statement.RETURN_GENERATED_KEYS = java.getStaticFieldValue('java.sql.Statement', 'RETURN_GENERATED_KEYS');

  // The constant indicating that generated keys should not be made available for
  // retrieval.
  Statement.NO_GENERATED_KEYS = java.getStaticFieldValue('java.sql.Statement', 'NO_GENERATED_KEYS');
});

module.exports = Statement;
