var _ = require('underscore');
var java = require('java');
java.options.push('-Xrs');

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
  
  if (self._config.libpath) {
    java.classpath.push(self._config.libpath);
  }
  if (self._config.libs) {
   java.classpath.push.apply(java.classpath, self._config.libs); 
  }

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

  if(self._config.user || self._config.password) {
    java.callStaticMethod('java.sql.DriverManager', 'getConnection', self._config.url, self._config.user, self._config.password, function (err, conn) {
      if (err) {
        return callback(err);
      } else {
        self._conn = conn;
        return callback(null, conn);
      }
    });
  } else {
    java.callStaticMethod('java.sql.DriverManager', 'getConnection', self._config.url, function (err, conn) {
      if (err) {
        return callback(err);
      } else {
        self._conn = conn;
        return callback(null, conn);
      }
    });
  }
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
        if (err) {
          return callback(err);
        } else if (resultset) {
          resultset.getMetaData(function(err,rsmd) {
            if (err) {
              return callback(err);
            } else {
              var results = [];
              var cc = rsmd.getColumnCountSync();
              var columns = [''];
              for(var i = 1; i <= cc; i++) {
                var colname = rsmd.getColumnNameSync(i);
                columns.push(colname);
              }
              var next = resultset.nextSync();
              var processRow = function(next){
                if(next){
                  setImmediate(function(){
                    var row = {};
                    for(var a= 1; a <= cc; a++) {
                      row[columns[a]] = trim1(resultset.getStringSync(a));
                    }
                    results.push(row);
                    next = resultset.nextSync();
                    processRow(next);
                  });
                } else {
                  callback(null, results);
                }
              };
              processRow(next);
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

module.exports = JDBCConn;
