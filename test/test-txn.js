var nodeunit = require('nodeunit');
var jinst = require('../lib/jinst');
var JDBC = require('../lib/jdbc');

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/hsqldb.jar',
                        './drivers/derby.jar',
                        './drivers/derbyclient.jar',
                        './drivers/derbytools.jar']);
}

var config = {
  url: 'jdbc:derby://localhost:1527/testdb;create=true',
};

var derby = new JDBC(config);
var testconn = null;

module.exports = {
  setUp: function(callback) {
    if (testconn === null && derby._pool.length > 0) {
      derby.reserve(function(err, conn) {
        testconn = conn;
        testconn.conn.setAutoCommit(false, function(err) {
          callback();
        });
      });
    } else {
      callback();
    }
  },
  tearDown: function(callback) {
    if (testconn) {
      derby.release(testconn, function(err) {
        callback();
      });
    } else {
      callback();
    }
  },
  testinitialize: function(test) {
    derby.initialize(function(err) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testcreatetable: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("CREATE TABLE blah (id int, name varchar(10), date DATE, time TIME, timestamp TIMESTAMP)", function(err, result) {
          test.expect(1);
          test.equal(null, err);
          test.done();
        });
      }
    });
  },
  testinsert: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("INSERT INTO blah VALUES (1, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP)", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(result && result == 1);
          testconn.conn.commit(function(err) { if (err) { console.log(err); }});
          test.done();
        });
      }
    });
  },
  testupdate: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("UPDATE blah SET id = 2 WHERE name = 'Jason'", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(result && result == 1);
          testconn.conn.commit(function(err) { if (err) { console.log(err); }});
          test.done();
        });
      }
    });
  },
  testselect: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeQuery("SELECT * FROM blah", function(err, resultset) {
          test.expect(7);
          test.equal(null, err);
          test.ok(resultset);
          resultset.toObjArray(function(err, results) {
            test.equal(results.length, 1);
            test.equal(results[0].NAME, 'Jason');
            test.ok(results[0].DATE);
            test.ok(results[0].TIME);
            test.ok(results[0].TIMESTAMP);
            test.done();
          });
        });
      }
    });
  },
  testdeleterollback: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("DELETE FROM blah WHERE id = 2", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(result && result == 1);
          testconn.conn.rollback(function(err) { if (err) { console.log(err); }});
          test.done();
        });
      }
    });
  },
  testselectpostrollback: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeQuery("SELECT * FROM blah", function(err, resultset) {
          test.expect(7);
          test.equal(null, err);
          test.ok(resultset);
          resultset.toObjArray(function(err, results) {
            test.equal(results.length, 1);
            test.equal(results[0].NAME, 'Jason');
            test.ok(results[0].DATE);
            test.ok(results[0].TIME);
            test.ok(results[0].TIMESTAMP);
            test.done();
          });
        });
      }
    });
  },
  testdroptable: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("DROP TABLE blah", function(err, result) {
          test.expect(1);
          test.equal(null, err);
          test.done();
        });
      }
    });
  }
};
