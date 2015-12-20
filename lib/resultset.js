/* jshint node: true */
"use strict";
var _ = require('lodash');
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
    typeNames[java.getStaticFieldValue("java.sql.Types", "BIGINT")]   = "String";
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
    typeNames[java.getStaticFieldValue("java.sql.Types", "LONGVARBINARY")] = "Bytes";
    typeNames[java.getStaticFieldValue("java.sql.Types", "BLOB")] = "Bytes";

    return typeNames;
  })();
}

ResultSet.prototype.toObjArray = function(callback) {
  this.toObject(function(err, result) {
    if (err) return callback(err);
    callback(null, result.rows);
  });
};

ResultSet.prototype.toObject = function(callback) {
  this.toObjectIter(function(err, rs) {
    if (err) return callback(err);

    var rowIter = rs.rows;
    var rows = [];
    var row = rowIter.next();

    while (!row.done) {
      rows.push(row.value);
      row = rowIter.next();
    }

    rs.rows = rows;
    return callback(null, rs);
  });
};

ResultSet.prototype.toObjectIter = function(callback) {
  var self = this;

  self.getMetaData(function(err, rsmd) {
    if (err) {
      return callback(err);
    } else {
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

        callback(null, {
          labels: _.pluck(colsmetadata, 'label'),
          types: _.pluck(colsmetadata, 'type'),
          rows: {
            next: function() {
              var nextRow = self._rs.nextSync();
              if (nextRow) {
                var result = {};
                var type = 'String';  // Default to getStringSync getter.

                // loop through each column
                _.each(_.range(1, colcount + 1), function(i) {
                  var cmd = colsmetadata[i];

                  if (self._types[cmd.type]) {
                    type = self._types[cmd.type];
                  } else {
                    type = 'String'; // Default to getStringSync getter.
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

                return {value: result, done: false};
              } else {
                return {done: true};
              }
            }
          }
        });
      });
    }
  });
};

ResultSet.prototype.close = function(callback) {
  this._rs.close(function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
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
