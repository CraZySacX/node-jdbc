var hsqldb = require("./common/hsqldb");
var jinst = require('../lib/jinst');

var testconn = null;
var testDate = Date.now();

module.exports = {
  setUp: function(callback) {
    if (testconn === null && hsqldb._pool.length > 0) {
      hsqldb.reserve().then(function(conn) {
        testconn = conn;
        callback();
      }).catch(function(err) {
        console.log(err);
        callback();
      });
    } else {
      callback();
    }
  },
  tearDown: function(callback) {
    if (testconn) {
      hsqldb.release(testconn).then(function() {
        callback();
      }).catch(function(err) {
        console.log(err);
        callback();
      });
    } else {
      callback();
    }
  },
  testinitialize: function(test) {
    test.expect(1);
    hsqldb.initialize().then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testcreatetable: function(test) {
    test.expect(2);
    testconn.conn.createStatement().then(function(statement) {
      return statement.executeUpdate("CREATE TABLE blah (id int, name varchar(10), date DATE, time TIME, timestamp TIMESTAMP);").then(function(result) {
        test.equal(0, result);
        return statement.close();
      });
    }).then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testinsert: function(test) {
    test.expect(1);
    testconn.conn.createStatement().then(function(statement) {
      return statement.executeUpdate("INSERT INTO blah VALUES (1, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP);");
    }).then(function(result) {
      test.ok(result && result == 1);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testupdate: function(test) {
    test.expect(1);
    testconn.conn.createStatement().then(function(statement) {
      return statement.executeUpdate("UPDATE blah SET id = 2 WHERE name = 'Jason';");
    }).then(function(result) {
      test.ok(result && result == 1);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testselect: function(test) {
    test.expect(6);
    testconn.conn.createStatement().then(function(statement) {
      return statement.executeQuery("SELECT * FROM blah;");
    }).then(function(resultset) {
      test.ok(resultset);
      return resultset.toObjArray();
    }).then(function(results) {
      test.equal(results.length, 1);
      test.equal(results[0].NAME, 'Jason');
      test.ok(results[0].DATE);
      test.ok(results[0].TIME);
      test.ok(results[0].TIMESTAMP);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testpreparedselectsetint: function(test) {
    test.expect(2);
    testconn.conn.prepareStatement("SELECT * FROM blah WHERE id=?").then(function(statement) {
      return statement.setInt(1, 2).then(function() {
        return statement.executeQuery();
      });
    }).then(function(resultset) {
      test.ok(resultset);
      return resultset.toObjArray();
    }).then(function(results) {
      test.equal(results.length, 1);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testpreparedselectsetstring: function(test) {
    test.expect(2);
    testconn.conn.prepareStatement("SELECT * FROM blah WHERE name=?").then(function(statement) {
      return statement.setString(1, 'Jason').then(function() {
        return statement.executeQuery();
      });
    }).then(function(resultset) {
      test.ok(resultset);
      return resultset.toObjArray();
    }).then(function(results) {
      test.equal(results.length, 1);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testpreparedinsertsetdate: function(test) {
    test.expect(1);
    var myjava = jinst.getInstance();
    testconn.conn.prepareStatement("INSERT INTO blah (id,name,date) VALUES (3,'Test',?)").then(function(statement) {
      var sqlDate = myjava.newInstanceSync("java.sql.Date", myjava.newLong(testDate));
      return statement.setDate(1, sqlDate, null).then(function() {
        return statement.executeUpdate();
      });
    }).then(function(numrows) {
      test.equal(1,numrows);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testpreparedselectsetdate: function(test) {
    test.expect(2);
    var myjava = jinst.getInstance();
    testconn.conn.prepareStatement("SELECT * FROM blah WHERE id = 3 AND date = ?").then(function(statement) {
      var sqlDate = myjava.newInstanceSync("java.sql.Date", myjava.newLong(testDate));
      return statement.setDate(1, sqlDate, null).then(function() {
        return statement.executeQuery();
      });
    }).then(function(resultset) {
      test.ok(resultset);
      return resultset.toObjArray();
    }).then(function(results) {
      test.equal(results.length, 1);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testpreparedinsertsettimestamp: function(test) {
    test.expect(1);
    var myjava = jinst.getInstance();
    testconn.conn.prepareStatement("INSERT INTO blah (id,name,timestamp) VALUES (4,'Test',?)").then(function(statement) {
      var sqlTimestamp = myjava.newInstanceSync("java.sql.Timestamp", myjava.newLong(testDate));
      return statement.setTimestamp(1, sqlTimestamp, null).then(function() {
        return statement.executeUpdate();
      });
    }).then(function(numrows) {
      test.equal(1,numrows);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testpreparedselectsettimestamp: function(test) {
    test.expect(2);
    var myjava = jinst.getInstance();
    testconn.conn.prepareStatement("SELECT * FROM blah WHERE id = 4 AND timestamp = ?").then(function(statement) {
      var sqlTimestamp = myjava.newInstanceSync("java.sql.Timestamp", myjava.newLong(testDate));
      return statement.setTimestamp(1, sqlTimestamp, null).then(function() {
        return statement.executeQuery();
      });
    }).then(function(resultset) {
      test.ok(resultset);
      return resultset.toObjArray();
    }).then(function(results) {
      test.equal(results.length, 1);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testdelete: function(test) {
    test.expect(1);
    testconn.conn.createStatement().then(function(statement) {
      return statement.executeUpdate("DELETE FROM blah WHERE id = 2;");
    }).then(function(result) {
      test.ok(result && result == 1);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testcancel: function (test) {
    test.expect(1);
    testconn.conn.createStatement().then(function(statement) {
      return statement.cancel();
    }).then(function() {
      test.ok(true);
      test.done();
    }).catch(function (err) {
      console.log(err);
      test.done();
    });
  },
  testdroptable: function(test) {
    test.expect(1);
    testconn.conn.createStatement().then(function(statement) {
      return statement.executeUpdate("DROP TABLE blah;");
    }).then(function(result) {
      test.equal(0, result);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  }
};
