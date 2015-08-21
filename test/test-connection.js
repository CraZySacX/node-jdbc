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
          dm.getConnection(config.url, function(err, conn) {
              if (err) {
                console.log(err);
              } else {
                testconn = new Connection(conn);
              }
              callback();
          }, config.user, config.password);
        }
      });
    } else {
      callback();
    }
  },
  testabort: function(test) {
    testconn.abort(null, function(err) {
      test.expect(2);
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
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
  testcommit: function(test) {
    testconn.commit(function(err) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testcreatearrayof: function(test) {
    testconn.createArrayOf(null, null, function(err) {
      test.expect(2);
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreateblob: function(test) {
    testconn.createBlob(function(err) {
      test.expect(2);
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreateclob: function(test) {
    testconn.createClob(function(err) {
      test.expect(2);
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreatenclob: function(test) {
    testconn.createNClob(function(err) {
      test.expect(2);
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreatesqlxml: function(test) {
    testconn.createSQLXML(function(err) {
      test.expect(2);
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreatestatment: function(test) {
    testconn.createStatement(function(err) {
      test.expect(2);
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreatestruct: function(test) {
    testconn.createStruct(null, null, function(err) {
      test.expect(2);
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
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
      test.ok(txniso);
      test.equal(txniso, "TRANSACTION_READ_COMMITTED");
      test.done();
    });
  },
  testgettypemap: function(test) {
    testconn.getTypeMap(function(err, map) {
      test.expect(2);
      test.equal(null, err);
      test.ok(map);
      test.done();
    });
  },
  testgetwarnings: function(test) {
    testconn.getWarnings(function(err, sqlwarning) {
      test.expect(2);
      test.equal(null, err);
      test.ok(sqlwarning);
      test.done();
    });
  },
  testisclosed: function(test) {
    testconn.isClosed(function(err, closed) {
      test.expect(2);
      test.equal(null, err);
      test.equal(false, closed);
      test.done();
    });
  },
  testisreadonly: function(test) {
    testconn.isReadOnly(function(err, readonly) {
      test.expect(2);
      test.equal(null, err);
      test.equal(false, readonly);
      test.done();
    });
  },
  testisvalid: function(test) {
    testconn.isValid(0, function(err, valid) {
      test.expect(2);
      test.equal(null, err);
      test.ok(valid);
      test.done();
    });
  },
  testnativesql: function(test) {
    testconn.nativeSQL(null, function(err) {
      test.expect(2);
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testpreparecallsql: function(test) {
    testconn.prepareCall("{ call database() }", function(err, callablestatement) {
      test.expect(2);
      test.equal(null, err);
      test.ok(callablestatement);
      test.done();
    });
  },
};
