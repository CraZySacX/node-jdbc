import Pool from "./pool";

function JDBC(config) {
  Pool.call(this, config);
}

JDBC.prototype = Object.create(Pool.prototype);
JDBC.prototype.constructor = JDBC;

export default JDBC;
