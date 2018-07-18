var nodeunit = require('nodeunit');
var jinst = require('../../lib/jinst');
var JDBC = require('../../lib/jdbc');

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/hsqldb.jar',
                        './drivers/derby.jar',
                        './drivers/derbyclient.jar',
                        './drivers/derbytools.jar']);
}

var configWithUserInUrl = {
  url: 'jdbc:hsqldb:hsql://localhost/xdb;user=SA;password='
};

var configderby = {
  url: 'jdbc:derby://localhost:1527/testdb'
};

var hsqldb = new JDBC(configWithUserInUrl);
var derby = new JDBC(configderby);

module.exports.hsqldb = hsqldb;
module.exports.derby = derby;
