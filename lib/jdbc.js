var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var java = require('java');
var sys = require('sys');

function trim1 (str) {
  return (str || '').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function JDBCConn() {
  EventEmitter.call(this);
  this._config = {};
  this._conn = null;
}

sys.inherits(JDBCConn, EventEmitter);

JDBCConn.prototype.initialize = function(config) {
  var self = this;
  self._config = config;
  
  var minPoolSize = self._config.minpoolsize | 5;
  java.classpath.push(self._config.libpath);
  java.newInstance(self._config.drivername, function( err, driver ){
    if (err) {
      self.emit('init', err, null);
    } else {
      java.callStaticMethod('java.sql.DriverManager','registerDriver', driver, function(err, result) {
        if (err) {
          self.emit('init', err);
        } else {
          java.callStaticMethod('java.sql.DriverManager','getConnection', self._config.url, function(err, conn) {
            if (err) {
                console.log(err);
              self.emit('init', err);
            } else {
              self._conn = conn;
              self.emit('init',null);
            }
          });
        }
      });
    }
  });
};

JDBCConn.prototype.open = function() {
  var self = this;
  java.callStaticMethod('java.sql.DriverManager','getConnection', self._config.url, function(err, conn) {
    if (err) {
      throw new Error(err);
    } else {
      self._conn = conn;
      self.emit('open', conn);
    }
  });
};

JDBCConn.prototype.close = function() {
  var self = this;
  self.emit('close', null);
};

JDBCConn.prototype.execute = function(sql) {
  var self = this;

  self._conn.createStatement(function(err, statement) {
    if (err) {
      self.emit('execute', err, null);
    } else {
      statement.executeQuery(sql ,function(err,resultset) {
        var resultset = resultset;
        if (err) {
          self.emit('execute', err, null);
        } else {
          self.emit('delivered', err, null);
          resultset.getMetaData(function(err,rsmd) {
            if (err) {
              self.emit('execute', err, null);
            } else {
              var cc = rsmd.getColumnCountSync();
               var columns = [''];
                for(var i = 1; i <= cc; i++) {
                    var colname = rsmd.getColumnNameSync(i);
                    columns.push(colname);
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
              self.emit('execute', null, results); 
            }
          });
        }
      });
    }
  });
};

module.exports = JDBCConn;
