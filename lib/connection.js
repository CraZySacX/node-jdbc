function Connection(conn) {
  this._conn = conn;
}

Connection.prototype.abort = function(executor, callback) {
  this._conn.abort(executor, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
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

Connection.prototype.getClientInfo = function(callback) {
  this._conn.getClientInfo(function(err, props) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, props);
    }
  });
};

Connection.prototype.getClientInfoByName = function(name, callback) {
  this._conn.getClientInfo(name, function(err, value) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, value);
    }
  });
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
  this._conn.getMetaData(function(err, metadata) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, metadata);
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
  this._conn.getTransactionIsolation(function(err, txniso) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, txniso);
    }
  });
};

module.exports = Connection;
