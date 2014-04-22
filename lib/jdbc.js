var _ = require('underscore');
var java = require('java');

function trim1 (str) {
  return (str || '').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function JDBCConn() {
  this._config = {};
  this._conn = null;
}

JDBCConn.prototype.initialize = function(config, callback) {
  var self = this;
  self._config = config;
  
  java.classpath.push(self._config.libpath);
  
  java.newInstance(self._config.drivername, function(err, driver) {
    if (err) {
      return callback(err);
    } else {
      java.callStaticMethod('java.sql.DriverManager','registerDriver', driver, function(err, result) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, self._config.drivername);
        }
      });
    }
  });
};

JDBCConn.prototype.open = function(callback) {
  var self = this;

  java.callStaticMethod('java.sql.DriverManager','getConnection', self._config.url, function(err, conn) {
    if (err) {
      return callback(err);
    } else {
      self._conn = conn;
      return callback(null, conn);
    }
  });
};

JDBCConn.prototype.close = function(callback) {
  var self = this;
  
  if (self._conn) {
    self._conn.close(function(err) {
      if (err) {
        return callback(err);
      } else {
        self._conn = null;
        return callback(null);
      }
    }); 
  }
};

JDBCConn.prototype.executeQuery = function(sql, callback) {
  var self = this;

  self._conn.createStatement(function(err, statement) {
    if (err) {
      return callback(err);
    } else {
      statement.executeQuery(sql ,function(err,resultset) {
        var resultset = resultset;
        if (err) {
          return callback(err);
        } else if (resultset) {
          resultset.getMetaData(function(err,rsmd) {
            if (err) {
              return callback(err);
            } else {
              var cc = rsmd.getColumnCountSync();
              var columns = [''];
              for(var i = 1; i <= cc; i++) {
                var colname = rsmd.getColumnNameSync(i);
                columns.push(colname)
              }
              var results = [];
              var next = resultset.nextSync();

              while(next) {
                var row = {};
              
                for(var i = 1; i <= cc; i++) {
                  row[columns[i]] = trim1(resultset.getStringSync(i));
                }
                results.push(row);
                next = resultset.nextSync();
              }
              return callback(null, results);
            }
          });
        } else {
          return callback(null, null);
        }
      });
    }
  });
};

JDBCConn.prototype.executeUpdate = function(sql, callback) {
  var self = this;

  self._conn.createStatement(function(err, statement) {
    if (err) {
      return callback(err);
    } else {
      statement.executeUpdate(sql, function(err, rowcount) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, rowcount);
        }
      });
    }
  });
};

JDBCConn.prototype.callProcedure = function(proc, params, callback) {
  var self = this;

  var param_placeholders = [];
  for(var i = 0; i < params.length; i++) { //create placeholders for params
    param_placeholders.push("?");
  }

  var call = "{ call " + proc + "(" + param_array.join(',') + ") }";

  self._conn.prepareCall(call, function(err, callableStatement) {
    if (err) {
      return callback(err);
    } else {
      for(var i = 0; i < params.length; i++) { //set all params
        callableStatement.setString(i + 1,params[i]);
      }

      callableStatement.execute(function(err) {
        if (err) {
          return callback(err);
        } else {
          return callback(null);
        }
      });
    }
  });

};

module.exports = new JDBCConn();
