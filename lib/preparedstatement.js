/* jshint node: true */
"use strict";
var ResultSet = require('./resultset');
var ResultSetMetaData = require('./resultsetmetadata');
var Statement = require('./statement');
var winston = require('winston');

function PreparedStatement(ps) {
  Statement.call(this, ps);
  this._ps = ps;
}

PreparedStatement.prototype = Object.create(Statement.prototype);
PreparedStatement.prototype.constructor = PreparedStatement;

PreparedStatement.prototype.addBatch = function(callback) {
  this._ps.addBatch(function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.clearParameters = function(callback) {
  this._ps.clearParameters(function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.execute = function(callback) {
  this._ps.execute(function(err, result) {
    if (err) { winston.error(err); return callback(err); }
    callback(null, result);
  });
};

PreparedStatement.prototype.executeBatch = function(callback) {
  this._ps.executeBatch(function(err, result) {
    if (err) { winston.error(err); return callback(err); }
    callback(null, result);
  });
};

PreparedStatement.prototype.executeQuery = function(callback) {
  this._ps.executeQuery(function(err, resultset) {
    if (err) { winston.error(err); return callback(err); }
    callback(null, new ResultSet(resultset));
  });
};

PreparedStatement.prototype.executeUpdate = function(callback) {
  this._ps.executeUpdate(function(err, result) {
    if (err) { winston.error(err); return callback(err); }
    callback(null, result);
  });
};

PreparedStatement.prototype.getMetaData = function(callback) {
  this._ps.getMetaData(function(err, result) {
    if (err) return callback(err);
    callback(null, new ResultSetMetaData(result));
  });
};

PreparedStatement.prototype.getParameterMetaData = function(callback) {
  callback(new Error("NOT IMPLEMENTED"));
  // this._ps.getParameterMetaData(function(err, result) {
  //   if (err) callback(err);
  //   callback(null, result);
  // });
};

PreparedStatement.prototype.setArray = function(index, val, callback) {
  callback(new Error("NOT IMPLEMENTED"));
};

PreparedStatement.prototype.setAsciiStream = function(index, val, length, callback) {
  // length is optional, or can be int or long.
  callback(new Error("NOT IMPLEMENTED"));
};

// val must be a java.math.BigDecimal
PreparedStatement.prototype.setBigDecimal = function(index, val, callback) {
  this._ps.setBigDecimal(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.setBinaryStream = function(index, val, length, callback) {
  // length is optional, or can be int or long.
  callback(new Error("NOT IMPLEMENTED"));
};

PreparedStatement.prototype.setBlob = function(index, val, length, callback) {
  // length is optional.  Must be java.lang.Long if supplied, only valid with
  // InputStream.
  // val can be java.sql.Blob or java.io.InputStream
  callback(new Error("NOT IMPLEMENTED"));
};

PreparedStatement.prototype.setBoolean = function(index, val, callback) {
  this._ps.setBoolean(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.setByte = function(index, val, callback) {
  this._ps.setByte(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.setBytes = function(index, val, callback) {
  this._ps.setBytes(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.setCharacterStream = function(index, val, length, callback) {
  // length is optional, or can be int or long.
  // val must be a java.io.Reader
  callback(new Error("NOT IMPLEMENTED"));
};

PreparedStatement.prototype.setClob = function(index, val, length, callback) {
  // length is optional, must be a long, only valid with a java.io.Reader.
  // val can be a java.io.Reader or a java.sql.Clob
  callback(new Error("NOT IMPLEMENTED"));
};

PreparedStatement.prototype.setDate = function(index, val, calendar, callback) {
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
};

PreparedStatement.prototype.setDouble = function(index, val, callback) {
  this._ps.setDouble(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.setFloat = function(index, val, callback) {
  this._ps.setFloat(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.setInt = function(index, val, callback) {
  this._ps.setInt(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.setLong = function(index, val, callback) {
  this._ps.setLong(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.setString = function(index, val, callback) {
  this._ps.setString(index, val, function(err) {
    if (err) return callback(err);
    callback(null);
  });
};

PreparedStatement.prototype.setTime = function(index, val, calendar, callback) {
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
};

PreparedStatement.prototype.setTimestamp = function(index, val, calendar, callback) {
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
};

module.exports = PreparedStatement;
