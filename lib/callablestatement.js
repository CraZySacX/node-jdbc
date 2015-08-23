var PreparedStatement = require('./preparedstatement');

function CallableStatement(cs) {
  PreparedStatement.call(this, cs);
  this._cs = cs;
}

CallableStatement.prototype = Object.create(PreparedStatement.prototype);
CallableStatement.prototype.constructor = CallableStatement;

module.exports = CallableStatement;
