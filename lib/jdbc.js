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
  
  java.classpath.push(self._config.libpath);
  
  java.newInstance(self._config.drivername, function(err, driver) {
    if (err) {
      self.emit('init', err, null);
    } else {
      java.callStaticMethod('java.sql.DriverManager','registerDriver', driver, function(err, result) {
        if (err) {
          self.emit('init', err, null);
        } else {
          self.emit('init', null, self._config.drivername);
        }
      });
    }
  });
};

JDBCConn.prototype.open = function() {
  var self = this;

  java.callStaticMethod('java.sql.DriverManager','getConnection', self._config.url, self._config.user, self._config.password, function(err, conn) {
    if (err) {
      self.emit('open', err, null);
    } else {
      self._conn = conn;
      self.emit('open', null, conn);
    }
  });
};

JDBCConn.prototype.close = function() {
  var self = this;
  
  if (self._conn) {
    self._conn.close(function(err) {
      if (err) {
        self.emit('close', err, null);
      } else {
        self.emit('close', null, 'closed');
        self._conn = null;
      }
    }); 
  }
};

JDBCConn.prototype.executeQuery = function(sql) {
  var self = this;

  self._conn.createStatement(function(err, statement) {
    if (err) {
      self.emit('executeQuery', err, null);
    } else {
      statement.executeQuery(sql ,function(err,resultset) {
        var resultset = resultset;
        if (err) {
          self.emit('executeQuery', err, null);
        } else if (resultset) {
          resultset.getMetaData(function(err,rsmd) {
            if (err) {
              self.emit('executeQuery', err, null);
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
              self.emit('executeQuery', null, results); 
            }
          });
        } else {
          self.emit('executeQuery', null, null);
        }
      });
    }
  });
};

module.exports = new JDBCConn();
