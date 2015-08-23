var Statement = require('./statement');

function PreparedStatement(ps) {
  Statement.call(this, ps);
  this._ps = ps;
}

PreparedStatement.prototype = Object.create(Statement.prototype);
PreparedStatement.prototype.constructor = PreparedStatement;

PreparedStatement.prototype.execute = function(callback) {
  this._ps.execute(function(err, result) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, result);
    }
  });
};

module.exports = PreparedStatement;
