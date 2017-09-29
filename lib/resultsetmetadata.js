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
      log.debug('getColumnCount ERR!!!', err);
      return callback(err);
    }
  });
};

module.exports = ResultSetMetaData;