/* jshint node: true */
"use strict";
var _ = require("lodash");
var jinst = require("./jinst");
var CallableStatement = require('./callablestatement');
var PreparedStatement = require('./preparedstatement');
var DatabaseMetaData = require('./databasemetadata');
var Statement = require('./statement');
var SQLWarning = require('./sqlwarning');
var java = jinst.getInstance();

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
}

function Connection(conn) {
  this._conn = conn;
  this._txniso = (function() {
    var txniso = [];

    txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_NONE")] = "TRANSACTION_NONE";
    txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_READ_COMMITTED")] = "TRANSACTION_READ_COMMITTED";
    txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_READ_UNCOMMITTED")] = "TRANSACTION_READ_UNCOMMITTED";
    txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_REPEATABLE_READ")] = "TRANSACTION_REPEATABLE_READ";
    txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_SERIALIZABLE")] = "TRANSACTION_SERIALIZABLE";

    return txniso;
  })();
}

Connection.prototype.abort = function(executor, callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

Connection.prototype.clearWarnings = function(callback) {
  this._conn.clearWarnings(function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.close = function(callback) {
  var self = this;

  if (self._conn === null) {
    return callback(null);
  }

  self._conn.close(function(err) {
    if (err) {
      return callback(err);
    } else {
      self._conn = null;
      return callback(null);
    }
  });
};

Connection.prototype.commit = function(callback) {
  this._conn.commit(function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.createArrayOf = function(typename, objarr, callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

Connection.prototype.createBlob = function(callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

Connection.prototype.createClob = function(callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

Connection.prototype.createNClob = function(callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

Connection.prototype.createSQLXML = function(callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

Connection.prototype.createStatement = function(arg1, arg2, arg3, callback) {
  // Get arguments as an array
  var args = Array.prototype.slice.call(arguments);

  // Pull the callback off the end of the arguments
  callback = args.pop();

  // Check arguments for validity, and return error if invalid
  var invalidArgs = false;
  _.forEach(args, function(arg) {
    if (! _.isNumber(arg)) {
      invalidArgs = true;
      // Lodash break
      return false;
    }
  });

  if (invalidArgs) {
    return callback(new Error("INVALID ARGUMENTS"));
  }

  // Push a callback handler onto the arguments
  args.push(function(err, statement) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, new Statement(statement));
    }
  });

  // Forward modified arguments to _conn.createStatement
  this._conn.createStatement.apply(this._conn, args);
};

Connection.prototype.createStruct = function(typename, attrarr, callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

Connection.prototype.getAutoCommit = function(callback) {
  this._conn.getAutoCommit(function(err, result) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, result);
    }
  });
};

Connection.prototype.getCatalog = function(callback) {
  this._conn.getCatalog(function(err, catalog) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, catalog);
    }
  });
};

Connection.prototype.getClientInfo = function(name, callback) {
  // Get arguments as an array
  var args = Array.prototype.slice.call(arguments);

  // Pull the callback off the end of the arguments
  callback = args.pop();

  // Push a callback handler onto the arguments
  args.push(function(err, result) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, result);
    }
  });

  // Forward modified arguments to _conn.getClientInfo
  this._conn.getClientInfo.apply(this._conn, args);
};

Connection.prototype.getHoldability = function(callback) {
  this._conn.getClientInfo(function(err, holdability) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, holdability);
    }
  });
};

Connection.prototype.getMetaData = function(callback) {
  this._conn.getMetaData(function(err, dbm) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, new DatabaseMetaData(dbm));
    }
  });
};

Connection.prototype.getNetworkTimeout = function(callback) {
  this._conn.getNetworkTimeout(function(err, ms) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, ms);
    }
  });
};

Connection.prototype.getSchema = function(callback) {
  this._conn.getSchema(function(err, schema) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, schema);
    }
  });
};

Connection.prototype.getTransactionIsolation = function(callback) {
  var self = this;

  self._conn.getTransactionIsolation(function(err, txniso) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, self._txniso[txniso]);
    }
  });
};

Connection.prototype.getTypeMap = function(callback) {
  this._conn.getTypeMap(function(err, map) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, map);
    }
  });
};

Connection.prototype.getWarnings = function(callback) {
  this._conn.getWarnings(function(err, sqlwarning) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, new SQLWarning(sqlwarning));
    }
  });
};

Connection.prototype.isClosed = function(callback) {
  this._conn.isClosed(function(err, closed) {
    if (err) return callback(err);
    callback(null, closed);
  });
};

Connection.prototype.isClosedSync = function() {
  return this._conn.isClosedSync();
};

Connection.prototype.isReadOnly = function(callback) {
  this._conn.isReadOnly(function(err, readonly) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, readonly);
    }
  });
};

Connection.prototype.isReadOnlySync = function() {
  return this._conn.isReadOnlySync();
};

Connection.prototype.isValid = function(timeout, callback) {
  this._conn.isValid(timeout, function(err, valid) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, valid);
    }
  });
};

Connection.prototype.isValidSync = function(timeout) {
  return this._conn.isValidSync(timeout);
};

Connection.prototype.nativeSQL = function(sql, callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

Connection.prototype.prepareCall = function(sql, rstype, rsconcurrency, rsholdability, callback) {
  // Get arguments as an array
  var args = Array.prototype.slice.call(arguments);

  // Pull the callback off the end of the arguments
  callback = args.pop();

  // Check arguments for validity, and return error if invalid
  if (! args[0] || (args[1] && ! args[2])) {
    return callback(new Error("INVALID ARGUMENTS"));
  }

  // Push a callback handler onto the arguments
  args.push(function(err, callablestatement) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, new CallableStatement(callablestatement));
    }
  });

  // Forward modified arguments to _conn.prepareCall
  this._conn.prepareCall.apply(this._conn, args);
};

function allType(array, type) {
  _.each(array, function(el) {
    if (typeof el !== type) {
      return false;
    }
  });

  return true;
}

/**
 * @callback prepareStatementCallback
 * @param {Error} err - An error message, or null if no error occurred
 * @param {PreparedStatement} prepStmt - The prepared statement
 */

/**
 * Creates a prepared statement and returns it via callback.
 *
 * @param {string} sql - SQL query
 * @param {(number | number[] | string[])} [arg1] - autoGeneratedKeys, resultSetType, or an array of numbers or strings
 * @param {number} [arg2] - resultSetConcurrency
 * @param {number} [arg3] - resultSetHoldability
 * @param {prepareStatementCallback} callback - The callback that handles the prepare statement response
 */
Connection.prototype.prepareStatement = function(sql, arg1, arg2, arg3, callback) {
  // Get arguments as an array
  var args = Array.prototype.slice.call(arguments);

  // Pull the callback off the end of the arguments
  callback = args.pop();

  // Error to return if arguments are invalid
  var errMsg = 'INVALID ARGUMENTS';

  // The first arg (sql) must be present
  if (! args[0]) {
    return callback(new Error(errMsg));
  }

  // Check arg1, arg2, and arg3 for validity.  These arguments must
  // be numbers if given, except for the special case when the first
  // of these arguments is an array and no other arguments are given.
  // In this special case, the array must be a string or number array.
  //
  // NOTE: _.tail returns all but the first argument, so we are only
  // processing arg1, arg2, and arg3; and not sql (or callback, which
  // was already removed from the args array).
  var invalidArgs = false;
  _.forEach(_.tail(args), function(arg, idx) {
    // Check for the special case where arg1 can be an array of strings or numbers
    // if arg2 and arg3 are not given
    if (idx === 0 && _.isArray(arg) && _.isUndefined(args[2]) && _.isUndefined(args[3])) {
      if (! (allType(arg, 'string') || allType(arg, 'number'))) {
        invalidArgs = true;

        // Lodash break
        return false;
      }

      // Lodash continue
      return;
    }

    // Other than the special case above, these args must be numbers
    if (! _.isNumber(arg)) {
      invalidArgs = true;

      // Lodash break
      return false;
    }
  });

  if (invalidArgs) {
    return callback(new Error(errMsg));
  }

  // Push a callback handler onto the arguments
  args.push(function(err, ps) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, new PreparedStatement(ps));
    }
  });

  // Forward modified arguments to _conn.prepareStatement
  this._conn.prepareStatement.apply(this._conn, args);
};

Connection.prototype.releaseSavepoint = function(savepoint, callback) {
  this._conn.releaseSavepoint(savepoint, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.rollback = function(savepoint, callback) {
  // Get arguments as an array
  var args = Array.prototype.slice.call(arguments);

  // Pull the callback off the end of the arguments
  callback = args.pop();

  // Check arguments for validity, and return error if invalid
  // if (! _.isObject(args[0])) {
  //   return callback(new Error("INVALID ARGUMENTS"));
  // }

  // Push a callback handler onto the arguments
  args.push(function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });

  // Forward modified arguments to _conn.rollback
  this._conn.rollback.apply(this._conn, args);
};

Connection.prototype.setAutoCommit = function(autocommit, callback) {
  this._conn.setAutoCommit(autocommit, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.setCatalog = function(catalog, callback) {
  this._conn.setCatalog(catalog, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.setClientInfo = function(props, name, value, callback) {
  // Get arguments as an array
  var args = Array.prototype.slice.call(arguments);

  // Pull the callback off the end of the arguments
  callback = args.pop();

  // Check arguments for validity, manipulate the args array appropriately,
  // and return error if invalid
  if (_.isObject(args[0]) && _.isUndefined(args[1]) && _.isUndefined(args[2])) {
    // Do nothing
  } else if (_.isNull(args[0]) && _.isString(args[1]) && _.isString(args[2])) {
    // Remove first argument (props) from args array
    args.shift();
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }

  // Push a callback handler onto the arguments
  args.push(function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });

  // Forward modified arguments to _conn.setClientInfo
  this._conn.setClientInfo.apply(this._conn, args);
};

Connection.prototype.setHoldability = function(holdability, callback) {
  this._conn.setHoldability(holdability, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.setNetworkTimeout = function(executor, ms, callback) {
  return callback(new Error('NOT IMPLEMENTED'));
};

Connection.prototype.setReadOnly = function(readonly, callback) {
  this._conn.setReadOnly(readonly, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.setSavepoint = function(name, callback) {
  // Get arguments as an array
  var args = Array.prototype.slice.call(arguments);

  // Pull the callback off the end of the arguments
  callback = args.pop();

  // Check arguments for validity, and return error if invalid
  if (! (_.isUndefined(args[0]) || _.isString(args[0]))) {
    return callback(new Error("INVALID ARGUMENTS"));
  }

  // Push a callback handler onto the arguments
  args.push(function(err, savepoint) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, savepoint);
    }
  });

  // Forward modified arguments to _conn.setSavepoint
  this._conn.setSavepoint.apply(this._conn, args);
};

Connection.prototype.setSchema = function(schema, callback) {
  this._conn.setSchema(schema, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.setTransactionIsolation = function(txniso, callback) {
  this._conn.setTransactionIsolation(txniso, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.setTypeMap = function(map, callback) {
  return callback(new Error('NOT IMPLEMENTED'));
};

module.exports = Connection;
