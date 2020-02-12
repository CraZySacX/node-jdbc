/* jshint node: true */
"use strict";

function ResultSetMetaData(rsmd) {
  this._rsmd = rsmd;
}

ResultSetMetaData.prototype.getColumnCount = function (callback) {
  this._rsmd.getColumnCount(function (err, count) {
    try {
      if (err) {
        return callback(err);
      } else {
        return callback(null, count);
      }
    } catch (err) {
      return callback(err);
    }
  });
};

ResultSetMetaData.prototype.getColumnName = function (column, callback) {
  this._rsmd.getColumnName(column, function (err, name) {
    try {
      if (err) {
        return callback(err);
      } else {
        return callback(null, name);
      }
    } catch (err) {
      return callback(err);
    }
  });
};

module.exports = ResultSetMetaData;