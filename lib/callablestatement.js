/* jshint node: true */
"use strict";
var PreparedStatement = require('./preparedstatement');

function CallableStatement(cs) {
  PreparedStatement.call(this, cs);
  this._cs = cs;
}

CallableStatement.prototype = Object.create(PreparedStatement.prototype);
CallableStatement.prototype.constructor = CallableStatement;

CallableStatement.prototype.getArray = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getArray(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getBigDecimal = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getBigDecimal(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getBlob = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getBlob(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getBoolean = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getBoolean(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getByte = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getByte(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getBytes = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getBytes(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getCharacterStream = function(arg1, callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

CallableStatement.prototype.getClob = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getClob(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getDate = function(arg1, callback, arg2) {
  if ((typeof arg1 === 'number' || typeof arg1 === 'string') && typeof arg2 === 'undefined') {
    this._cs.getDate(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else if (((typeof arg1 === 'number' || typeof arg1 === 'string') && typeof arg2 === 'object')) {
    this._cs.getDate(arg1, arg2, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getDouble = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getDouble(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getFloat = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getFloat(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getInt = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getInt(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getLong = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getLong(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getNCharacterStream = function(arg1, callback) {
    return callback(new Error("NOT IMPLEMENTED"));
};

CallableStatement.prototype.getNClob = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getNClob(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getNString = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getNString(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getLong = function(arg1, callback) {
  if (typeof arg1 === 'number' || typeof arg1 === 'string') {
    this._cs.getLong(arg1, function(err, result) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
};

CallableStatement.prototype.getObject = function(arg1, callback, arg2) {
  return callback(new Error("NOT IMPLEMENTED"));
};

module.exports = CallableStatement;
