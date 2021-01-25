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

var derby = new JDBC({
  url: 'jdbc:derby://localhost:1527/testdb;create=true'
});

var testconn = null;
var testDate = Date.now();

module.exports = {
  setUp: function(callback) {
    if (testconn === null && derby._pool.length > 0) {
      derby.reserve(function(err, conn) {
        testconn = conn;
        callback();
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
      test.equal(err, null);
      test.done();
    });
  },
  testcreatetable: function(test) {
    testconn.conn.createStatement(function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        var create = "CREATE TABLE blah ";
        create += "(id int, bi bigint, name varchar(10), date DATE, time TIME, timestamp TIMESTAMP, dollars NUMERIC(5,2))";
        statement.executeUpdate(create, function(err, result) {
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
        var insert = "INSERT INTO blah VALUES ";
        insert += "(1, 9223372036854775807, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP, 12.01)";
        statement.executeUpdate(insert, function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(result && result == 1);
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
          test.expect(9);
          test.equal(null, err);
          test.ok(resultset);
          resultset.toObjArray(function(err, results) {
            test.equal(results.length, 1);
            test.equal(results[0].BI, '9223372036854775807');
            test.equal(results[0].NAME, 'Jason');
            test.ok(results[0].DATE);
            test.ok(results[0].TIME);
            test.ok(results[0].TIMESTAMP);
            test.equal(results[0].DOLLARS, 12.01)
            test.done();
          });
        });
      }
    });
  },
  testpreparedselectsetint: function(test) {
    testconn.conn.prepareStatement("SELECT * FROM blah WHERE id=?",function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.setInt(1, 2, function(err) {
          if (err) {
            console.log(err);
          }
          else {
            statement.executeQuery(function(err, resultset) {
              test.expect(3);
              test.equal(null, err);
              test.ok(resultset);
              resultset.toObjArray(function(err, results) {
                test.equal(results.length, 1);
                test.done();
              });
            });
          }
        });
      }
    });
  },
  testpreparedselectsetstring: function(test) {
    testconn.conn.prepareStatement("SELECT * FROM blah WHERE name=?",function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.setString(1,'Jason', function(err) {
          if (err) {
            console.log(err);
          }
          else {
            statement.executeQuery(function(err, resultset) {
              test.expect(3);
              test.equal(null, err);
              test.ok(resultset);
              resultset.toObjArray(function(err, results) {
                test.equal(results.length, 1);
                test.done();
              });
            });
          }
        });
      }
    });
  },
  testpreparedinsertsetdate: function(test) {
    var myjava = jinst.getInstance();
    testconn.conn.prepareStatement("INSERT INTO blah (id,name,date) VALUES (3,'Test',?)",function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        var sqlDate = myjava.newInstanceSync("java.sql.Date", myjava.newLong(testDate));
        statement.setDate(1, sqlDate, null, function(err) {
          if (err) {
            console.log(err);
          } else {
            statement.executeUpdate(function(err, numrows) {
              if (err) {
                console.log(err);
              } else {
                test.expect(2);
                test.equal(null, err);
                test.equal(1, numrows);
                test.done();
              }
            });
          }
        });
      }
    });
  },
  testpreparedselectsetdate: function(test) {
    var myjava = jinst.getInstance();
    testconn.conn.prepareStatement("SELECT * FROM blah WHERE id = 3 AND date = ?",function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        var sqlDate = myjava.newInstanceSync("java.sql.Date", myjava.newLong(testDate));
        statement.setDate(1, sqlDate, null, function(err) {
          if (err) {
            console.log(err);
          }
          else {
            statement.executeQuery(function(err, resultset) {
              if (err) {
                console.log(err);
              } else {
                test.expect(3);
                test.equal(null, err);
                test.ok(resultset);
                resultset.toObjArray(function(err, results) {
                  if (err) {
                    console.log(err);
                  } else {
                    test.equal(results.length, 1);
                    test.done();
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  testpreparedinsertsettimestamp: function(test) {
    var myjava = jinst.getInstance();
    testconn.conn.prepareStatement("INSERT INTO blah (id,name,timestamp) VALUES (4,'Test',?)",function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        var sqlTimestamp = myjava.newInstanceSync("java.sql.Timestamp", myjava.newLong(testDate));
        statement.setTimestamp(1, sqlTimestamp, null, function(err) {
          if (err) {
            console.log(err);
          }
          else {
            statement.executeUpdate(function(err, numrows) {
              if (err) {
                console.log(err);
              } else {
                test.expect(2);
                test.equal(null, err);
                test.equal(1,numrows);
                test.done();
              }
            });
          }
        });
      }
    });
  },
  testpreparedselectsettimestamp: function(test) {
    var myjava = jinst.getInstance();
    testconn.conn.prepareStatement("SELECT * FROM blah WHERE id = 4 AND timestamp = ?",function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        var sqlTimestamp = myjava.newInstanceSync("java.sql.Timestamp", myjava.newLong(testDate));
        statement.setTimestamp(1, sqlTimestamp, null, function(err) {
          if (err) {
            console.log(err);
          }
          else {
            statement.executeQuery(function(err, resultset) {
              if (err) {
                console.log(err);
              } else {
                test.expect(3);
                test.equal(null, err);
                test.ok(resultset);
                resultset.toObjArray(function(err, results) {
                  if (err) {
                    console.log(err);
                  } else {
                    test.equal(results.length, 1);
                    test.done();
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  testdelete: function(test) {
    testconn.conn.createStatement(function(err, statement) {
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
