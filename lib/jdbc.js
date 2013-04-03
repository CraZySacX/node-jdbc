var EventEmitter = require('events').EventEmitter;
var java = require('java');
var sys = require('sys');

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
  java.newInstance(self._config.drivername, function( err, driver ){
    if (err) {
      throw new Error(err);
    } else {
      java.callStaticMethod('java.sql.DriverManager','registerDriver', driver, function(err, result) {
        if (err) {
          throw new Error(err);
        } else {
          self.emit('init', self._config.drivername);
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
  this._conn.close(function(err, result) {
    if (err) {
      throw new Error(err);
    } else {
      self.emit('close');
    }
  });
};

module.exports = new JDBCConn();
