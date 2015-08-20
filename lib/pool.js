var dm = require('./drivermanager.js');
var Connection = require('./connection.js');

function Pool(config) {
  this._url = config.url;
  this._props = config.props;
  this._minpoolsize = config.minpoolsize ? config.minpoolsize : 1;
  this._maxpoolsize = config.maxpoolsize ? config.maxpoolsize : 1;
  this._buffer = this._maxpoolsize - this._minpoolsize;
  this._pool = [];
}

function addConnToPool(queue, url, props, callback) {
  dm.getConnectionWithProps(url, props, function(err, conn) {
    if (err) {
      return callback(err);
    } else {
      queue.unshift(new Connection(conn));
      return callback(null, true);
    }
  });
}

Pool.prototype.initialize = function(callback) {
  var self = this;
  var outstanding = 0;

  for(i = 0; i < self._minpoolsize; i++) {
    outstanding++;

    addConnToPool(self._pool, self._url, self._props, function(err, added) {
      if (!(--outstanding)) {
        return callback(null, self._pool.length);
      }
    });
  }
};

Pool.prototype.reserve = function(callback) {
  if (this._pool.length > 0 ) {
    return callback(null, this._pool.shift());
  } else if (this._buffer > 0) {
    addConnToPool(this._pool, this._url, this._props, function(err, result) {
        if (err) {
          return callback(err);
        } else {
          this._buffer -= 1;
          return callback(null, this._pool.shift());
        }
    });
  } else {
    return callback("No more pool connections available");
  }
};

Pool.prototype.release = function(conn, callback) {
  console.log("Object Type:" + Object.prototype.toString(conn));

  if (typeof conn === 'object' && Object.prototype.toString(conn) === 'Connection') {
    this._pool.unshift(conn);
    return callback(null, true);
  } else {
    return callback("Connection is invalid, not releasing back to pool");
  }
};

module.exports = Pool;
