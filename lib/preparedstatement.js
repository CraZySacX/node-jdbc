/* jshint node: true */
"use strict";
var ResultSet = require('./resultset');
var Statement = require('./statement');

function PreparedStatement(ps) {
  Statement.call(this, ps);
  this._ps = ps;
}

PreparedStatement.prototype = Object.create(Statement.prototype);
PreparedStatement.prototype.constructor = PreparedStatement;

PreparedStatement.prototype.execute = function(callback) {
  this._ps.execute(function(err, result) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, result);
    }
  });
};

PreparedStatement.prototype.executeQuery = function(callback) {
  this._ps.executeQuery(function(err, resultset) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, new ResultSet(resultset));
    }
  });
};

PreparedStatement.prototype.executeUpdate = function(callback) {
  this._ps.executeUpdate(function(err, result) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, result);
    }
  });
};

PreparedStatement.prototype.setInt = function(index, val, callback) {
  this._ps.setInt(index, val, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

PreparedStatement.prototype.setString = function(index, val, callback) {
  this._ps.setString(index, val, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

module.exports = PreparedStatement;
