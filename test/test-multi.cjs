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

var configWithUserInUrl = {
  url: 'jdbc:hsqldb:hsql://localhost/xdb;user=SA;password='
};

var configderby = {
  url: 'jdbc:derby://localhost:1527/testdb'
};

var hsqldb = new JDBC(configWithUserInUrl);
var derby = new JDBC(configderby);
var hsqldbconn = null;
var derbyconn = null;

exports.hsqldb = {
  setUp: function(callback) {
    if (hsqldbconn === null && hsqldb._pool.length > 0) {
      hsqldb.reserve(function(err, conn) {
        hsqldbconn = conn;
        callback();
      });
    } else {
      callback();
    }
  },
  tearDown: function(callback) {
    if (hsqldbconn) {
      hsqldb.release(hsqldbconn, function(err) {
        callback();
      });
    } else {
      callback();
    }
  },
  testinitialize: function(test) {
    hsqldb.initialize(function(err) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testcreatetable: function(test) {
    hsqldbconn.conn.createStatement(function(err, statement) {
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
    hsqldbconn.conn.createStatement(function(err, statement) {
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
  testupdate: function(test) {
    hsqldbconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("UPDATE blah SET id = 2 WHERE name = 'Jason';", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(1, result);
          test.done();
        });
      }
    });
  },
  testselect: function(test) {
    hsqldbconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeQuery("SELECT * FROM blah;", function(err, resultset) {
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
  testselectbyexecute: function(test) {
    hsqldbconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.execute("SELECT * FROM blah;", function(err, resultset) {
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
  testupdatebyexecute: function(test) {
    hsqldbconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.execute("UPDATE blah SET id = 2 WHERE name = 'Jason';", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(1, result);
          test.done();
        });
      }
    });
  },
  testdelete: function(test) {
    hsqldbconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("DELETE FROM blah WHERE id = 2;", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.equal(1, result);
          test.done();
        });
      }
    });
  },
  testdroptable: function(test) {
    hsqldbconn.conn.createStatement(function(err, statement) {
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
  },
};

exports.derby = {
  setUp: function(callback) {
    if (derbyconn === null && derby._pool.length > 0) {
      derby.reserve(function(err, conn) {
        derbyconn = conn;
        callback();
      });
    } else {
      callback();
    }
  },
  tearDown: function(callback) {
    if (derbyconn) {
      derby.release(derbyconn, function(err) {
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
    derbyconn.conn.createStatement(function(err, statement) {
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
    derbyconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("INSERT INTO blah VALUES (1, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP)", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(result && result == 1);
          test.done();
        });
      }
    });
  },
  testupdate: function(test) {
    derbyconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("UPDATE blah SET id = 2 WHERE name = 'Jason'", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(result && result == 1);
          test.done();
        });
      }
    });
  },
  testselect: function(test) {
    derbyconn.conn.createStatement(function(err, statement) {
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
  testselectobject: function(test) {
    derbyconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeQuery("SELECT * FROM blah", function(err, resultset) {
          test.expect(13);
          test.equal(null, err);
          test.ok(resultset);
          resultset.toObject(function(err, results) {
            test.equal(results.rows.length, 1);
            test.equal(results.rows[0].NAME, 'Jason');
            test.ok(results.rows[0].DATE);
            test.ok(results.rows[0].TIME);
            test.ok(results.rows[0].TIMESTAMP);

            test.equal(results.labels.length, 5);
            test.equal(results.labels[0], 'ID');
            test.equal(results.labels[1], 'NAME');
            test.ok(results.labels[2], 'DATE');
            test.ok(results.labels[3], 'TIME');
            test.ok(results.labels[4], 'TIMESTAMP');

            test.done();
          });
        });
      }
    });
  },
  testselectzero: function(test) {
    derbyconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeQuery("SELECT * FROM blah WHERE id = 1000", function(err, resultset) {
          test.expect(9);
          test.equal(null, err);
          test.ok(resultset);
          resultset.toObject(function(err, results) {
            test.equal(results.rows.length, 0);
            test.equal(results.labels.length, 5);
            test.equal(results.labels[0], 'ID');
            test.equal(results.labels[1], 'NAME');
            test.ok(results.labels[2], 'DATE');
            test.ok(results.labels[3], 'TIME');
            test.ok(results.labels[4], 'TIMESTAMP');
            test.done();
          });
        });
      }
    });
  },
  testdelete: function(test) {
    derbyconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.executeUpdate("DELETE FROM blah WHERE id = 2", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(result && result == 1);
          test.done();
        });
      }
    });
  },
  testdroptable: function(test) {
    derbyconn.conn.createStatement(function(err, statement) {
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
