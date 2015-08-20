var jinst = require('../lib/jinst.js');
var nodeunit = require('nodeunit');
var dm = require('../lib/drivermanager.js');
var Connection = require('../lib/connection.js');
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
  password: ''
};

var testconn = null;

module.exports = {
  setUp: function(callback) {
    if (testconn == null) {
      dm.registerDriver(java.newInstanceSync(config.drivername), function(err) {
        if (err) {
          console.log(err);
        } else {
          dm.getConnectionWithUserPass(config.url, config.user, config.password, function(err, conn) {
              if (err) {
                console.log(err);
              } else {
                testconn = new Connection(conn);
              }
              callback();
          });
        }
      });
    } else {
      callback();
    }
  },
  testclearwarnings: function(test) {
    testconn.clearWarnings(function(err) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testclose: function(test) {
    testconn.close(function(err) {
      test.expect(1);
      test.equal(null, err);
      testconn = null;
      test.done();
    });
  },
};
