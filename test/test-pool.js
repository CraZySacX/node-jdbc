var jinst = require('../lib/jinst.js');
var nodeunit = require('nodeunit');
var Pool = require('../lib/pool.js');
var java = jinst.getInstance();

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/hsqldb.jar',
                        './drivers/derby.jar',
                        './drivers/derbyclient.jar',
                        './drivers/derbytools.jar']);
}

var config = {
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  url: 'jdbc:hsqldb:hsql://localhost/xdb',
  user : 'SA',
  password: '',
  minpoolsize: 10,
  maxpoolsize: 20
};

var testpool = null;

module.exports = {
  setUp: function(callback) {
    if (testpool === null) {
      testpool = new Pool(config);
    }
    callback();
  },
  testinitialize: function(test) {
    testpool.initialize(function(err, poolsize) {
      test.expect(2);
      test.equal(null, err);
      test.equal(10, poolsize);
      test.done();
    });
  },
};
