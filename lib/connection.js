function Connection(conn) {
  this._conn = conn;
}

Connection.prototype.clearWarnings = function(callback) {
  this._conn.clearWarnings(function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

Connection.prototype.close = function(callback) {
  this._conn.close(function(err) {
    if (err) {
      return callback(err);
    } else {
      this._conn = null;
      return callback(null);
    }
  });
};

module.exports = Connection;
