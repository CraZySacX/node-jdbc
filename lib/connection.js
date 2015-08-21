var jinst = require("./jinst.js");
var CallableStatement = require('./callablestatement');
var DatabaseMetaData = require('./databasemetadata');
var SQLWarning = require('./sqlwarning');
var java = jinst.getInstance();

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
}

function Connection(conn) {
  this._conn = conn;
  this._txniso = (function setupTxnIsos() {
    var txniso = [''];

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

Connection.prototype.createStatement = function(callback, rsype, rsconcurrency, rsholdability) {
  return callback(new Error("NOT IMPLEMENTED"));
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

Connection.prototype.getClientInfo = function(callback, name) {
  if (name) {
    this._conn.getClientInfo(name, function(err, value) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, value);
      }
    });
  } else {
    this._conn.getClientInfo(function(err, props) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, props);
      }
    });
  }
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
    if (err) {
      return callback(err);
    } else {
      return callback(null, closed);
    }
  });
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

Connection.prototype.isValid = function(timeout, callback) {
  this._conn.isValid(timeout, function(err, valid) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, valid);
    }
  });
};

Connection.prototype.nativeSQL = function(sql, callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

Connection.prototype.prepareCall = function(sql, callback, rstype, rsconcurrency, rsholdability) {
  if (sql && !rstype && !rsconcurrency && !rsholdability) {
    this._conn.prepareCall(sql, function(err, callablestatement) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new CallableStatement(callablestatement));
      }
    });
  } else if (sql && rstype && rsconcurrency && !rsholdability) {
    this._conn.prepareCall(sql, rstype, rsconcurrency, function(err, callablestatement) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new CallableStatement(callablestatement));
      }
    });
  } else if (sql && rstype && rsconcurrency && rsholdability) {
    this._conn.prepareCall(sql, rstype, rsconcurrency, rsholdability, function(err, callablestatement) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new CallableStatement(callablestatement));
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS!"));
  }
}

module.exports = Connection;
