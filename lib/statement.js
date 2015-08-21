function Statement(s) {
  this._s = s;
}

Statement.prototype.executeUpdate = function(sql, callback, arg1) {
    if (typeof sql === 'string' && typeof arg1 === 'undefined') {
      this._s.executeUpdate(sql, function(err, count) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, count);
        }
      });
    } else {
      return callback(new Error('INVALID ARGUMENTS'));
    }
};

module.exports = Statement;
