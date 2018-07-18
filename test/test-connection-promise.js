var config = require("./common/connection");
var dm = require('../lib/drivermanager');
var Connection = require('../lib/connection');
var ResultSet = require('../lib/resultset');
require("../lib/jdbc").Promise = global.Promise || require("bluebird");

var testconn = null;

module.exports = {
  setUp: function(callback) {
    if (testconn === null) {
      dm.getConnection(config.url, config.user, config.password).then(function(conn) {
        testconn = new Connection(conn);
        callback();
      }).catch(function(err) {
        console.log(err);
      });
    } else {
      callback();
    }
  },
  testabort: function(test) {
    test.expect(2);
    testconn.abort(null).then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testclearwarnings: function(test) {
    test.expect(1);
    testconn.clearWarnings().then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testclose: function(test) {
    test.expect(1);
    testconn.close().then(function() {
      testconn = null;
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testcloseclosed: function(test) {
    test.expect(1);
    testconn._conn = null;
    testconn.close().then(function() {
      testconn = null;
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testcommit: function(test) {
    test.expect(1);
    testconn.commit().then(function() {
      test.ok(true);
      test.done();
    }).catch(function (err) {
      console.log(err);
      test.done();
    });
  },
  testcreatearrayof: function(test) {
    test.expect(2);
    testconn.createArrayOf(null, null).then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreateblob: function(test) {
    test.expect(2);
    testconn.createBlob().then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreateclob: function(test) {
    test.expect(2);
    testconn.createClob().then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreatenclob: function(test) {
    test.expect(2);
    testconn.createNClob().then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreatesqlxml: function(test) {
    test.expect(2);
    testconn.createSQLXML().then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testcreatestatment: function(test) {
    test.expect(1);
    testconn.createStatement().then(function(statement) {
      test.ok(statement);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testcreatestatement1: function(test) {
    test.expect(1);
    testconn.createStatement(0, 0).then(function(statement) {
      test.ok(statement);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testcreatestatement2: function(test) {
    test.expect(1);
    testconn.createStatement(0, 0, 0).then(function(statement) {
      test.ok(statement);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testcreatestruct: function(test) {
    test.expect(2);
    testconn.createStruct(null, null).then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testgetautocommit: function(test) {
    test.expect(1);
    testconn.getAutoCommit().then(function(result) {
      test.equal(true, result);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetcatalog: function(test) {
    test.expect(1);
    testconn.getCatalog().then(function(catalog) {
      test.ok(catalog);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetclientinfo: function(test) {
    test.expect(1);
    testconn.getClientInfo().then(function(props) {
      test.equal(null, props);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetholdability: function(test) {
    test.expect(1);
    testconn.getHoldability().then(function(holdability) {
      test.equal(null, holdability);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetmetadata: function(test) {
    test.expect(1);
    testconn.getMetaData().then(function(metadata) {
      test.ok(metadata);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetnetworktimeout: function(test) {
    test.expect(1);
    testconn.getNetworkTimeout().then(function(ms) {
      test.equal(0, ms);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetschema: function(test) {
    test.expect(1);
    testconn.getSchema().then(function(schema) {
      test.ok(schema);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgettransactionisolation: function(test) {
    test.expect(2);
    testconn.getTransactionIsolation().then(function(txniso) {
      test.ok(txniso);
      test.equal(txniso, "TRANSACTION_READ_COMMITTED");
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgettypemap: function(test) {
    test.expect(1);
    testconn.getTypeMap().then(function(map) {
      test.ok(map);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetwarnings: function(test) {
    test.expect(1);
    testconn.getWarnings().then(function(sqlwarning) {
      test.ok(sqlwarning);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testisclosed: function(test) {
    test.expect(1);
    testconn.isClosed().then(function(closed) {
      test.equal(false, closed);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testisreadonly: function(test) {
    test.expect(1);
    testconn.isReadOnly().then(function(readonly) {
      test.equal(false, readonly);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testisvalid: function(test) {
    test.expect(1);
    testconn.isValid(0).then(function(valid) {
      test.ok(valid);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testnativesql: function(test) {
    test.expect(2);
    testconn.nativeSQL(null).then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testpreparecallsql: function(test) {
    test.expect(1);
    testconn.prepareCall("{ call database() }").then(function(callablestatement) {
      test.ok(callablestatement);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testpreparestatement: function(test) {
    test.expect(1);
    testconn.prepareCall("SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;").then(function(preparedstatement) {
      test.ok(preparedstatement);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testreleasesavepoint: function(test) {
    test.expect(1);
    testconn.setAutoCommit(false).then(function() {
      return testconn.setSavepoint();
    }).then(function(savepoint) {
      return testconn.releaseSavepoint(savepoint);
    }).then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testrollback: function(test) {
    test.expect(1);
    testconn.setAutoCommit(false).then(function() {
      return testconn.rollback();
    }).then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testrollbacksavepoint: function(test) {
    test.expect(1);
    testconn.setAutoCommit(false).then(function() {
      return testconn.setSavepoint();
    }).then(function(savepoint) {
      return testconn.rollback(savepoint);
    }).then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testsetcatalog: function(test) {
    test.expect(1);
    testconn.setCatalog('PUBLIC').then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testsetclientinfo: function(test) {
    test.expect(1);
    // Note that HSQLDB doesn't support this feature so it errors.
    testconn.setClientInfo(null, 'TEST', 'ME').then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.done();
    });
  },
  testsetholdability: function(test) {
    test.expect(1);
    var hold = (new ResultSet(null))._holdability.indexOf('HOLD_CURSORS_OVER_COMMIT');
    testconn.setHoldability(hold).then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testsetnetworktimeout: function(test) {
    test.expect(2);
    testconn.setNetworkTimeout(null, null).then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
  testsetreadonly: function(test) {
    test.expect(1);
    testconn.setReadOnly(true).then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testsetsavepoint: function(test) {
    test.expect(1);
    testconn.setAutoCommit(false).then(function() {
      return testconn.setSavepoint();
    }).then(function(savepoint) {
      test.ok(savepoint);
      test.done();
    }).catch(function(err){
      console.log(err);
      test.done();
    });
  },
  testsetsavepointname: function(test) {
    test.expect(1);
    testconn.setAutoCommit(false).then(function() {
      return testconn.setSavepoint("SAVEPOINT");
    }).then(function(savepoint) {
      test.ok(savepoint);
      test.done();
    }).catch(function(err){
      console.log(err);
      test.done();
    });
  },
  testsetschema: function(test) {
    test.expect(1);
    testconn.setSchema('PUBLIC').then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testsettransactionisolation: function(test) {
    test.expect(1);
    var txniso = testconn._txniso.indexOf('TRANSACTION_SERIALIZABLE');
    testconn.setTransactionIsolation(txniso).then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testsettypemap: function(test) {
    test.expect(2);
    testconn.setTypeMap(null).then(function() {
      test.done();
    }).catch(function(err) {
      test.ok(err);
      test.equal("NOT IMPLEMENTED", err.message);
      test.done();
    });
  },
};
