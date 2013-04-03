var events = require('events');
var java = require('java');
var sys = require('sys');

var JDBCConnection = function(config) {
  if ( this instanceof JDBCConnection ) {
    this.config = config;
    java.classpath.push(config.libpath);
    events.EventEmitter.call(this);
  } else {
    return new JDBCConnection(config);
  }
}

sys.inherits(JDBCConnection, events.EventEmitter);

JDBCConnection.prototype.initialize = function() {
  var self = this;
  
  java.newInstance(self.config.drivername, function( err, driver ){
    if (err) {
      console.error('An error occurred creating the driver.', err);
    } else {
      java.callStaticMethod('java.sql.DriverManager','registerDriver', driver, function(err, result) {
        if (err) {
          console.error('An error occurred registering the driver.', err);
        } else {
          self.emit('init', self.config.drivername);
        }
      });
    }
  });
}

JDBCConnection.prototype.open = function() {
  var self = this;
  java.callStaticMethod('java.sql.DriverManager','getConnection', self.config.url, function(err, conn) {
    if (err) {
      console.error('Error opening connection to database!', err);
    } else {
      console.log('Connection to database opened.');
      self.emit('open', conn);
    }
  });
}

JDBCConnection.prototype.close = function(conn) {
  var self = this;
  conn.close(function(err, result) {
    if (err) {
      console.error('An error occurred closing the connection.', err);
    } else {
      self.emit('close', result);
    }
  });
}

module.exports.JDBCConnection = JDBCConnection
