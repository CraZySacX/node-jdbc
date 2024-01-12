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
  url: 'jdbc:hsqldb:hsql://localhost/xdb',
  user : 'SA',
  password: ''
};

var hsqldb = new JDBC(config);
var testconn = null;

module.exports = {
  setUp: function(callback) {
    if (testconn === null && hsqldb._pool.length > 0) {
      hsqldb.reserve(function(err, conn) {
        testconn = conn;
        callback();
      });
    } else {
      callback();
    }
  },
  tearDown: function(callback) {
    if (testconn) {
      hsqldb.release(testconn, function(err) {
        callback();
      });
    } else {
      callback();
    }
  },
  testinit: function(test) {
    hsqldb.initialize(function(err) {
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
        statement.executeUpdate("CREATE TABLE blah (id int, name varchar(10), date DATE, time TIME, timestamp TIMESTAMP);", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.equal(0, result);
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
        statement.executeUpdate("INSERT INTO blah VALUES (1, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP);", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.equal(1, result);
          test.done();
        });
      }
    });
  },
  testcreateprocedure: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("CREATE PROCEDURE new_blah(id int, name varchar(10)) " +
                                "MODIFIES SQL DATA " +
                                "BEGIN ATOMIC " +
                                "  INSERT INTO blah VALUES (id, name, CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP); " +
                                "END;", function(err, result) {
          test.expect(1);
          test.equal(null, err);
          test.done();
        });
      }
    });
  },
  testcallprocedure: function(test) {
    testconn.conn.prepareCall("{ call new_blah(2, 'Another')}", function(err, callablestatement) {
      if (err) {
        console.log(err);
      } else {
        callablestatement.execute(function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.equal(false, result);
          test.done();
        });
      }
    });
  },
  testselectaftercall: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeQuery("SELECT * FROM blah;", function(err, resultset) {
          test.expect(7);
          test.equal(null, err);
          test.ok(resultset);
          resultset.toObjArray(function(err, results) {
            test.equal(results.length, 2);
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
  testdropprocedure: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("DROP PROCEDURE IF EXISTS new_blah;", function(err, result) {
          test.expect(1);
          test.equal(null, err);
          test.done();
        });
      }
    });
  },
  testdroptable: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("DROP TABLE blah;", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.equal(0, result);
          test.done();
        });
      }
    });
  }
};
