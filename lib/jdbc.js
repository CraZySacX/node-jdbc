var Pool = require("./pool");

function JDBC(config) {
  Pool.call(this, config);
}

JDBC.prototype = Object.create(Pool.prototype);
JDBC.prototype.constructor = JDBC;

module.exports = JDBC;
exports.jinst = require('./jinst');
