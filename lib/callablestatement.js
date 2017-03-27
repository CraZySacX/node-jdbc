/* jshint node: true */
"use strict";
var _ = require('lodash');
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

CallableStatement.prototype.getDate = function(arg1, arg2, callback) {
  // Get arguments as an array
  var args = Array.prototype.slice.call(arguments);

  // Pull the callback off the end of the arguments
  callback = args.pop();

  // Check arguments for validity, and return error if invalid
  var validArgs = (
    (_.isNumber(args[0]) || _.isString(args[0])) &&
    (_.isUndefined(args[1]) || _.isObject(args[1]))
  );
  if (! validArgs) {
    return callback(new Error("INVALID ARGUMENTS"));
  }

  // Push a callback handler onto the arguments
  args.push(function(err, result) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, result);
    }
  });

  // Forward modified arguments to _cs.getDate
  this._cs.getDate.apply(this._cs, args);
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

CallableStatement.prototype.getObject = function(arg1, arg2, callback) {
  return callback(new Error("NOT IMPLEMENTED"));
};

CallableStatement.prototype.registerOutParameter = function() { 
  var args = Array.prototype.slice.call(arguments);
  var callback = args.pop();
  if ((typeof args[0] == 'number' && typeof args[1] == 'number') || 
     (typeof args[0] == 'number' && typeof args[1] == 'number' && typeof args[2] == 'number') ||
     (typeof args[0] == 'number' && typeof args[1] == 'number' && typeof args[2] == 'string') || 
     (typeof args[0] == 'string' && typeof args[1] == 'number') || 
     (typeof args[0] == 'string' && typeof args[1] == 'number' && typeof args[2] == 'number') || 
     (typeof args[0] == 'string' && typeof args[1] == 'number' && typeof args[2] == 'string')) {
    args.push(callback);
    this._cs.registerOutParameter.apply(this._cs, args);
  } else {
    return callback(new Error("INVALID ARGUMENTS"));
  }
}

module.exports = CallableStatement;
