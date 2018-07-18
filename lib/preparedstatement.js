/* jshint node: true */
"use strict";
var ResultSet = require('./resultset');
var ResultSetMetaData = require('./resultsetmetadata');
var Statement = require('./statement');
var winston = require('winston');
var promisify = require("./promisify");

function PreparedStatement(ps) {
  Statement.call(this, ps);
  this._ps = ps;
}

PreparedStatement.prototype = Object.create(Statement.prototype);
PreparedStatement.prototype.constructor = PreparedStatement;

PreparedStatement.prototype.addBatch = promisify(function(callback) {
  this._ps.addBatch(function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.clearParameters = promisify(function(callback) {
  this._ps.clearParameters(function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.execute = promisify(function(callback) {
  this._ps.execute(function(err, result) {
    if (err) { winston.error(err); return callback(err); }
    callback(null, result);
  });
});

PreparedStatement.prototype.executeBatch = promisify(function(callback) {
  this._ps.executeBatch(function(err, result) {
    if (err) { winston.error(err); return callback(err); }
    callback(null, result);
  });
});

PreparedStatement.prototype.executeQuery = promisify(function(callback) {
  this._ps.executeQuery(function(err, resultset) {
    if (err) { winston.error(err); return callback(err); }
    callback(null, new ResultSet(resultset));
  });
});

PreparedStatement.prototype.executeUpdate = promisify(function(callback) {
  this._ps.executeUpdate(function(err, result) {
    if (err) { winston.error(err); return callback(err); }
    callback(null, result);
  });
});

PreparedStatement.prototype.getMetaData = promisify(function(callback) {
  this._ps.getMetaData(function(err, result) {
    if (err) return callback(err);
    callback(null, new ResultSetMetaData(result));
  });
});

PreparedStatement.prototype.getParameterMetaData = promisify(function(callback) {
  callback(new Error("NOT IMPLEMENTED"));
  // this._ps.getParameterMetaData(function(err, result) {
  //   if (err) callback(err);
  //   callback(null, result);
  // });
});

PreparedStatement.prototype.setArray = promisify(function(index, val, callback) {
  callback(new Error("NOT IMPLEMENTED"));
});

PreparedStatement.prototype.setAsciiStream = promisify(function(index, val, length, callback) {
  // length is optional, or can be int or long.
  callback(new Error("NOT IMPLEMENTED"));
});

// val must be a java.math.BigDecimal
PreparedStatement.prototype.setBigDecimal = promisify(function(index, val, callback) {
  this._ps.setBigDecimal(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.setBinaryStream = promisify(function(index, val, length, callback) {
  // length is optional, or can be int or long.
  callback(new Error("NOT IMPLEMENTED"));
});

PreparedStatement.prototype.setBlob = promisify(function(index, val, length, callback) {
  // length is optional.  Must be java.lang.Long if supplied, only valid with
  // InputStream.
  // val can be java.sql.Blob or java.io.InputStream
  callback(new Error("NOT IMPLEMENTED"));
});

PreparedStatement.prototype.setBoolean = promisify(function(index, val, callback) {
  this._ps.setBoolean(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.setByte = promisify(function(index, val, callback) {
  this._ps.setByte(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.setBytes = promisify(function(index, val, callback) {
  this._ps.setBytes(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.setCharacterStream = promisify(function(index, val, length, callback) {
  // length is optional, or can be int or long.
  // val must be a java.io.Reader
  callback(new Error("NOT IMPLEMENTED"));
});

PreparedStatement.prototype.setClob = promisify(function(index, val, length, callback) {
  // length is optional, must be a long, only valid with a java.io.Reader.
  // val can be a java.io.Reader or a java.sql.Clob
  callback(new Error("NOT IMPLEMENTED"));
});

PreparedStatement.prototype.setDate = promisify(function(index, val, calendar, callback) {
  if (calendar === null) {
    this._ps.setDate(index, val, function(err) {
      if (err) return callback(err);
      callback(null);
    });
  } else {
    this._ps.setDate(index, val, calendar, function(err) {
      if (err) return callback(err);
      callback(null);
    });
  }
});

PreparedStatement.prototype.setDouble = promisify(function(index, val, callback) {
  this._ps.setDouble(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.setFloat = promisify(function(index, val, callback) {
  this._ps.setFloat(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.setInt = promisify(function(index, val, callback) {
  this._ps.setInt(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.setLong = promisify(function(index, val, callback) {
  this._ps.setLong(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.setString = promisify(function(index, val, callback) {
  this._ps.setString(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
});

PreparedStatement.prototype.setTime = promisify(function(index, val, calendar, callback) {
  if (calendar === null) {
    this._ps.setTime(index, val, function(err) {
      if (err) return callback(err);
      callback(null);
    });
  } else {
    this._ps.setTime(index, val, calendar, function(err) {
      if (err) return callback(err);
      callback(null);
    });
  }
});

PreparedStatement.prototype.setTimestamp = promisify(function(index, val, calendar, callback) {
  if (calendar === null) {
    this._ps.setTimestamp(index, val, function(err) {
      if (err) return callback(err);
      callback(null);
    });
  } else {
    this._ps.setTimestamp(index, val, calendar, function(err) {
      if (err) return callback(err);
      callback(null);
    });
  }
});

module.exports = PreparedStatement;
