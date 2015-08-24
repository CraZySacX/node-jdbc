var ResultSet = require('./resultset');

function DatabaseMetaData(dbm) {
  this._dbm = dbm;
}

DatabaseMetaData.prototype.getSchemas = function(callback) {
  this._dbm.getSchemas(function(err, resultset) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, new ResultSet(resultset));
    }
  });
};

DatabaseMetaData.prototype.getTables = function(catalog, schema, name, types, callback) {
  this._dbm.getTables(null, null, name, null, function(err, resultset) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, new ResultSet(resultset));
    }
  });
};

module.exports = DatabaseMetaData;
