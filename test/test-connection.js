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
  testgetautocommit: function(test) {
    testconn.getAutoCommit(function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.equal(true, result);
      test.done();
    });
  },
  testgetcatalog: function(test) {
    testconn.getCatalog(function(err, catalog) {
      test.expect(2);
      test.equal(null, err);
      test.ok(catalog);
      test.done();
    });
  },
  testgetclientinfo: function(test) {
    testconn.getClientInfo(function(err, props) {
      test.expect(2);
      test.equal(null, err);
      test.equal(null, props);
      test.done();
    });
  },
  testgetholdability: function(test) {
    testconn.getHoldability(function(err, holdability) {
      test.expect(2);
      test.equal(null, err);
      test.equal(null, holdability);
      test.done();
    });
  },
  testgetmetadata: function(test) {
    testconn.getMetaData(function(err, metadata) {
      test.expect(2);
      test.equal(null, err);
      test.ok(metadata);
      test.done();
    });
  },
  testgetnetworktimeout: function(test) {
    testconn.getNetworkTimeout(function(err, ms) {
      test.expect(2);
      test.equal(null, err);
      test.equal(0, ms);
      test.done();
    });
  },
  testgetschema: function(test) {
    testconn.getSchema(function(err, schema) {
      test.expect(2);
      test.equal(null, err);
      test.ok(schema);
      test.done();
    });
  },
  testgettransactionisolation: function(test) {
    testconn.getTransactionIsolation(function(err, txniso) {
      test.expect(3);
      test.equal(null, err);
      var trc = java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_READ_COMMITTED");
      test.ok(txniso);
      test.equal(txniso, trc);
      test.done();
    });
  },
};
