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
  java.callStaticMethod('java.sql.DriverManager','getConnection', self._config.url, function(err, conn) {
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
  this._conn.close(function(err, result) {
    if (err) {
      self.emit('close', err);
    } else {
      self.emit('close', null);
    }
  });
};

module.exports = new JDBCConn();
