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
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  user: 'SA',
  password: '',
  minpoolsize: 10
};

var hsqldb = new JDBC(config);
var testconn = null;
var testDate = Date.now();

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
  testinitialize: function(test) {
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
          statement.close(function(err) {
            if (err) {
              console.log(err);
            } else {
              test.done();
            }
          });
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
        statement.executeUpdate("UPDATE blah SET id = 2 WHERE name = 'Jason';", function(err, result) {
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
  testpreparedselectsetint: function(test) {
    testconn.conn.prepareStatement("SELECT * FROM blah WHERE id=?",function(err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.setInt(1,2, function(err) {
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
        statement.executeUpdate("DELETE FROM blah WHERE id = 2;", function(err, result) {
          test.expect(2);
          test.equal(null, err);
          test.ok(result && result == 1);
          test.done();
        });
      }
    });
  },
  testcancel: function (test) {
    testconn.conn.createStatement(function (err, statement) {
      if (err) {
        console.log(err);
      } else {
        statement.cancel(function(err) {
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
