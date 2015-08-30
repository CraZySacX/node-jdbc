/* jshint node: true */
"use strict";
var _ = require('underscore');
var jinst = require('./jinst');
var ResultSetMetaData = require('./resultsetmetadata');
var java = jinst.getInstance();

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
}

function ResultSet(rs) {
  this._rs = rs;
  this._holdability = (function() {
    var h = [];

    h[java.getStaticFieldValue('java.sql.ResultSet', 'CLOSE_CURSORS_AT_COMMIT')] = 'CLOSE_CURSORS_AT_COMMIT';
    h[java.getStaticFieldValue('java.sql.ResultSet', 'HOLD_CURSORS_OVER_COMMIT')] = 'HOLD_CURSORS_OVER_COMMIT';

    return h;
  })();
  this._types = (function() {
    var typeNames = [];

    typeNames[java.getStaticFieldValue("java.sql.Types", "TINYINT")]  = "Int";
    typeNames[java.getStaticFieldValue("java.sql.Types", "SMALLINT")] = "Int";
    typeNames[java.getStaticFieldValue("java.sql.Types", "INTEGER")]  = "Int";
    typeNames[java.getStaticFieldValue("java.sql.Types", "BIGINT")]   = "Int";
    typeNames[java.getStaticFieldValue("java.sql.Types", "FLOAT")]    = "Float";
    typeNames[java.getStaticFieldValue("java.sql.Types", "REAL")]     = "Float";
    typeNames[java.getStaticFieldValue("java.sql.Types", "DOUBLE")]   = "Double";
    typeNames[java.getStaticFieldValue("java.sql.Types", "NUMERIC")]  = "Float";
    typeNames[java.getStaticFieldValue("java.sql.Types", "DECIMAL")]  = "Float";
    typeNames[java.getStaticFieldValue("java.sql.Types", "CHAR")]     = "String";
    typeNames[java.getStaticFieldValue("java.sql.Types", "VARCHAR")]     =  "String";
    typeNames[java.getStaticFieldValue("java.sql.Types", "LONGVARCHAR")] = "String";
    typeNames[java.getStaticFieldValue("java.sql.Types", "DATE")] =  "Date";
    typeNames[java.getStaticFieldValue("java.sql.Types", "TIME")] =  "Time";
    typeNames[java.getStaticFieldValue("java.sql.Types", "TIMESTAMP")] = "Timestamp";
    typeNames[java.getStaticFieldValue("java.sql.Types", "BOOLEAN")] =  "Boolean";
    typeNames[java.getStaticFieldValue("java.sql.Types", "NCHAR")] =  "String";
    typeNames[java.getStaticFieldValue("java.sql.Types", "NVARCHAR")] = "String";
    typeNames[java.getStaticFieldValue("java.sql.Types", "LONGNVARCHAR")] = "String";

    return typeNames;
  })();
}

ResultSet.prototype.toObjArray = function(callback) {
  var self = this;

  self.getMetaData(function(err, rsmd) {
    if (err) {
      return callback(err);
    } else {
      var results = [];
      // Add empty object to start at 1 (because ResultSet starts at 1).
      var colsmetadata = [{}];

      rsmd.getColumnCount(function(err, colcount) {
        // Get some column metadata.
        _.each(_.range(1, colcount + 1), function(i) {
          colsmetadata.push({
            label: rsmd._rsmd.getColumnLabelSync(i),
            type: rsmd._rsmd.getColumnTypeSync(i)
          });
        });

        // Get the first row.
        var nextrow = self._rs.nextSync();

        // Setup the processRow function.
        var processRow = function(row) {
          if (row) {
            var result = {};
            var type = 'String';  // Default to getStringSync getter.

            // loop through each column
            _.each(_.range(1, colcount + 1), function(i) {
              var cmd = colsmetadata[i];

              if (self._types[cmd.type]) {
                type = self._types[cmd.type];
              }

              if (type === 'Date' || type === 'Time' || type === 'Timestamp') {
                if (self._rs['get' + type + 'Sync'](i)) {
                  result[cmd.label] = self._rs['get' + type + 'Sync'](i).toString();
                } else { // if date is empty, it should be null
                  result[cmd.label] = null;
                }
              } else {
                result[cmd.label] = self._rs['get' + type + 'Sync'](i);
              }
            });

            results.push(result);
            nextrow = self._rs.nextSync();
            processRow(nextrow);
          } else {
            callback(null, results);
          }
        };

        // Process the first row.
        processRow(nextrow);
      });
    }
  });
};

ResultSet.prototype.getMetaData = function(callback) {
  this._rs.getMetaData(function(err, rsmd) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, new ResultSetMetaData(rsmd));
    }
  });
};

module.exports = ResultSet;
