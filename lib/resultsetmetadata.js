/* jshint node: true */
"use strict";
var promisify = require("./promisify");

function ResultSetMetaData(rsmd) {
  this._rsmd = rsmd;
}

ResultSetMetaData.prototype.getColumnCount = promisify(function (callback) {
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
});

module.exports = ResultSetMetaData;
