/* jshint node: true */
"use strict";
function ResultSetMetaData(rsmd) {
  this._rsmd = rsmd;
}

ResultSetMetaData.prototype.getColumnCount = function (callback) {
  this._rsmd.getColumnCount(function(err, count) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, count);
    }
  });
};

module.exports = ResultSetMetaData;
