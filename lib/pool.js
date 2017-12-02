/* jshint node: true */
"use strict";
var _ = require('lodash');
var asyncjs = require('async');
var uuid = require('uuid');
var jinst = require("./jinst");
var dm = require('./drivermanager');
var Connection = require('./connection');
var winston = require('winston');

var java = jinst.getInstance();

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
}

var keepalive = function(conn, query) {
  var self = this;
  conn.createStatement(function(err, statement) {
    if (err) return winston.error(err);
    statement.execute(query, function(err, result) {
      if (err) return winston.error(err);
      winston.silly("%s - Keep-Alive", new Date().toUTCString());
    });
  });
};

var addConnection = function(url, props, ka, maxIdle, maxAge, callback) {
  dm.getConnection(url, props, function(err, conn) {
    if (err) {
      return callback(err);
    } else {
      var connobj = {
        uuid: uuid.v4(),
        conn: new Connection(conn),
        keepalive: ka.enabled ? setInterval(keepalive, ka.interval, conn, ka.query) : false
      };

      if (maxIdle) {
        connobj.lastIdle = new Date().getTime();
      }
      if (maxAge) {
        connobj.birthTime = new Date().getTime();
      }
      return callback(null, connobj);
    }
  });
};

var addConnectionSync = function(url, props, ka, maxIdle, maxAge) {
  var conn = dm.getConnectionSync(url, props);
  var connobj = {
    uuid: uuid.v4(),
    conn: new Connection(conn),
    keepalive: ka.enabled ? setInterval(keepalive, ka.interval, conn, ka.query) : false
  };

  if (maxIdle) {
    connobj.lastIdle = new Date().getTime();
  }
  if (maxAge) {
    connobj.birthTime = new Date().getTime();
  }
  return connobj;
};

function Pool(config) {
  this._url = config.url;
  this._props = (function (config) {
    var Properties = java.import('java.util.Properties');
    var properties = new Properties();

    for(var name in config.properties) {
      properties.putSync(name, config.properties[name]);
    }

    if (config.user && properties.getPropertySync('user') === undefined) {
      properties.putSync('user', config.user);
    }

    if (config.password && properties.getPropertySync('password') === undefined) {
      properties.putSync('password', config.password);
    }

    return properties;
  })(config);
  this._drivername = config.drivername ? config.drivername : '';
  this._minpoolsize = config.minpoolsize ? config.minpoolsize : 1;
  this._maxpoolsize = config.maxpoolsize ? config.maxpoolsize : 1;
  this._keepalive = config.keepalive ? config.keepalive : {
    interval: 60000,
    query: 'select 1',
    enabled: false
  };
  this._maxidle = (!this._keepalive.enabled && config.maxidle) || null;
  this._logging = config.logging ? config.logging : {
    level: 'error'
  };
  this._pool = [];
  this._reserved = [];
  this._maxage = config.maxage || null;
}

var connStatus = function(acc, pool) {
  _.reduce(pool, function(conns, connobj) {
    var conn = connobj.conn;
    var closed = conn.isClosedSync();
    var readonly = conn.isReadOnlySync();
    var valid = conn.isValidSync(1000);
    conns.push({
      uuid: connobj.uuid,
      closed: closed,
      readonly: readonly,
      valid: valid
    });
    return conns;
  }, acc);
  return acc;
};

Pool.prototype.status = function(callback) {
  var self = this;
  var status = {};
  status.available = self._pool.length;
  status.reserved = self._reserved.length;
  status.pool = connStatus([], self._pool);
  status.rpool = connStatus([], self._reserved);
  callback(null, status);
};


Pool.prototype.initialize = function(callback) {
  var self = this;

  winston.level = this._logging.level;

  // If a drivername is supplied, initialize the via the old method,
  // Class.forName()
  if (this._drivername) {
    java.newInstance(this._drivername, function(err, driver) {
      if (err) {
        return callback(err);
      } else {
        dm.registerDriver(driver, function(err) {
          if (err) {
            return callback(err);
          }
        });
      }
    });
  }

  asyncjs.times(self._minpoolsize, function(n, next){
    addConnection(self._url, self._props, self._keepalive, self._maxidle, self._maxage, function(err, conn) {
      next(err, conn);
    });
  }, function(err, conns) {
    if (err) {
      return callback(err);
    } else {
      _.each(conns, function(conn) {
        self._pool.push(conn);
      });
      return callback(null);
    }
  });

  jinst.events.emit('initialized');
};

Pool.prototype.reserve = function(callback) {
  var self = this;
  var conn = null;
  self._closeIdleConnections();
  self._closeExpiredConnections();

  if (self._pool.length > 0 ) {
    conn = self._pool.shift();

    if (conn.lastIdle) {
      conn.lastIdle = new Date().getTime();
    }

    self._reserved.unshift(conn);
  } else if (self._reserved.length < self._maxpoolsize) {
    try {
      conn = addConnectionSync(self._url, self._props, self._keepalive, self._maxidle, self._maxage);
      self._reserved.unshift(conn);
    } catch (err) {
      winston.error(err);
      conn = null;
      return callback(err);
    }
  }

  if (conn === null) {
    callback(new Error("No more pool connections available"));
  } else {
    callback(null, conn);
  }
};

Pool.prototype._closeIdleConnections = function() {
  if (! this._maxidle) {
    return;
  }

  var self = this;

  closeIdleConnectionsInArray(self._pool, this._maxidle);
  closeIdleConnectionsInArray(self._reserved, this._maxidle);
};

Pool.prototype._closeExpiredConnections = function() {
  if (! this._maxage) {
    return;
  }

  var self = this;

  closeExpiredConnectionsInArray(self._pool, this._maxage);
  closeExpiredConnectionsInArray(self._reserved, this._maxage);
}

function closeIdleConnectionsInArray(array, maxIdle) {
  var time = new Date().getTime();
  var maxLastIdle = time - maxIdle;

  for (var i = array.length - 1; i >=0; i--) {
    var conn = array[i];
    if (typeof conn === 'object' && conn.conn !== null) {
      if (conn.lastIdle < maxLastIdle) {
        conn.conn.close(function(err) { });
        array.splice(i, 1);
      }
    }
  }
}

function closeExpiredConnectionsInArray(array, maxAge) {
  var time = new Date().getTime();
  var maxBirthTime = time - maxAge;

  for (var i = array.length - 1; i >=0; i--) {
    var conn = array[i];
    if (typeof conn === 'object' && conn.conn !== null) {
      if (conn.birthTime < maxBirthTime) {
        console.log("closing connection beacuse it is older than " + (maxAge) + "ms");
        conn.conn.close(function(err) { });
        array.splice(i, 1);
      }
    }
  }
}

Pool.prototype.release = function(conn, callback) {
  var self = this;
  if (typeof conn === 'object') {
    var uuid = conn.uuid;
    self._reserved = _.reject(self._reserved, function(conn) {
      return conn.uuid === uuid;
    });

    if (conn.lastIdle) {
      conn.lastIdle = new Date().getTime();
    }

    self._pool.unshift(conn);
    return callback(null);
  } else {
    return callback(new Error("INVALID CONNECTION"));
  }
};

Pool.prototype.purge = function(callback) {
  var self = this;
  var conns = self._pool.concat(self._reserved);

  asyncjs.each(conns,
    function(conn, done) {
      if (typeof conn === 'object' && conn.conn !== null) {
        conn.conn.close(function(err) {
          //we don't want to prevent other connections from being closed
          done();
        });
      } else {
        done();
      }
    },
    function() {
      self._pool = [];
      self._reserved = [];

      callback();
    }
  );
};

module.exports = Pool;
