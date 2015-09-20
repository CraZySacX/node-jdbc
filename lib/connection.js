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

Connection.prototype.createStatement = function(callback, arg1, arg2, arg3) {
  if (typeof arg1 === 'undefined' && typeof arg2 === 'undefined' && typeof arg3 === 'undefined') {
    this._conn.createStatement(function(err, statement) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new Statement(statement));
      }
    });
  } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'undefined') {
    this._conn.createStatement(arg1, arg2, function(err, statement) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new Statement(statement));
      }
    });
  } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'number') {
    this._conn.createStatement(arg1, arg2, arg3, function(err, statement) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new Statement(statement));
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
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
};

function allType(array, type) {
  _.each(array, function(el) {
    if (typeof el !== type) {
      return false;
    }
  });

  return true;
}

Connection.prototype.prepareStatement = function(sql, callback, arg1, arg2, arg3) {
  if (sql && typeof arg1 === 'undefined' && typeof arg2 === 'undefined' && typeof arg3 === 'undefined') {
    this._conn.prepareStatement(sql, function(err, ps) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new PreparedStatement(ps));
      }
    });
  } else if (sql && typeof arg1 === 'number' && typeof arg2 === 'undefined' && typeof arg3 === 'undefined') {
    // arg1 is autoGeneratedKeys
    this._conn.prepareStatement(sql, arg1, function(err, ps) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new PreparedStatement(ps));
      }
    });
  } else if (sql && typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'undefined') {
    // arg1 is resultSetType, arg2 is resultSetConcurrency
    this._conn.prepareStatement(sql, arg1, arg2, function(err, ps) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new PreparedStatement(ps));
      }
    });
  } else if (sql && typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'number') {
    // arg1 is resultSetType, arg2 is resultSetConcurrency, arg3 is resultSetHoldability
    this._conn.prepareStatement(sql, arg1, arg2, arg3, function(err, ps) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, new PreparedStatement(ps));
      }
    });
  } else if (sql && typeof arg1 === 'object' && typeof arg2 === 'undefined' && typeof arg3 === 'undefined') {
    // arg1 could be string array or a number array
    if (Array.isArray(arg1) && allType(arg1, 'string')) {
      this._conn.prepareStatement(sql, arg1, function(err, ps) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, new PreparedStatement(ps));
        }
      });
    } else if (Array.isArray(arg1) && allType(arg1, 'number')) {
      this._conn.prepareStatement(sql, arg1, function(err, ps) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, new PreparedStatement(ps));
        }
      });
    } else {
      return callback(new Error('INVALID ARGUMENTS'));
    }
  } else {
    return callback(new Error('INVALID ARGUMENTS'));
  }
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

Connection.prototype.rollback = function(callback, savepoint) {
  if (typeof savepoint === 'undefined') {
    this._conn.rollback(function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null);
      }
    });
  } else if (typeof savepoint === 'object') {
    this._conn.rollback(savepoint, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
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

Connection.prototype.setClientInfo = function(callback, props, name, value) {
  if (typeof props === 'object' && typeof name == 'undefined' && typeof value === 'undefined') {
    this._conn.setClientInfo(props, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null);
      }
    });
  } else if (props === null && typeof name == 'string' && typeof value === 'string') {
    this._conn.setClientInfo(name, value, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
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

Connection.prototype.setSavepoint = function(callback, name) {
  if (typeof name === 'undefined') {
    this._conn.setSavepoint(function(err, savepoint) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, savepoint);
      }
    });
  } else if (typeof name === 'string') {
    this._conn.setSavepoint(name, function(err, savepoint) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, savepoint);
      }
    });
  } else {
    return callback('INVALID ARGUMENTS');
  }
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
