var jinst = require('../lib/jinst.js');
var nodeunit = require('nodeunit');
var jdbcConn = new ( require('../lib/jdbc.js') );

if (!jinst.isJvmCreated()) {
  jinst.setupClasspath(['./drivers/hsqldb.jar',
                        './drivers/derby.jar',
                        './drivers/derbyclient.jar',
                        './drivers/derbytools.jar']);
}

var config = {
  drivername: 'org.apache.derby.jdbc.ClientDriver',
  url: 'jdbc:derby://localhost:1527/testdb;create=true',
};

module.exports = {
  testinit: function(test) {
    jdbcConn.initialize(config, function(err, drivername) {
      test.expect(2);
      test.equal(null, err);
      test.equal(drivername, 'org.apache.derby.jdbc.ClientDriver');
      test.done();
    });
  },
  testopen: function(test) {
    jdbcConn.open(function(err, conn) {
      test.expect(2);
      test.equal(null, err);
      test.ok(conn);
      test.done();
    });
  },
  testgetautocommit: function(test) {
    jdbcConn.getAutoCommit(function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == true);
      test.done();
    });
  },
  testsetautocommit: function(test) {
    jdbcConn.setAutoCommit(false, function(err) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testsetsavepoint: function(test) {
    jdbcConn.setSavepoint("SVP", function(err, savepoint) {
      test.expect(2);
      test.equal(null, err);
      test.ok(savepoint);
      jdbcConn.releaseSavepoint(savepoint, function(err) {});
      test.done();
    });
  },
  testreleasesavepoint: function(test) {
    jdbcConn.setSavepoint("SVP", function(err, savepoint) {
      jdbcConn.releaseSavepoint(savepoint, function(err) {
        test.expect(1);
        test.equal(null, err);
        test.done();
      });
    });
  },
  testcreatetable: function(test) {
    jdbcConn.executeUpdate("CREATE TABLE blah (id int, name varchar(10), date DATE, time TIME, timestamp TIMESTAMP)", function(err, result) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testinsert: function(test) {
    jdbcConn.executeUpdate("INSERT INTO blah VALUES (1, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP)", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      jdbcConn.commit(function(err) { if (err) { console.log(err); }});
      test.done();
    });
  },
  testupdate: function(test) {
    jdbcConn.executeUpdate("UPDATE blah SET id = 2 WHERE name = 'Jason'", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      jdbcConn.commit(function(err) { if (err) { console.log(err); }});
      test.done();
    });
  },
  testselect: function(test) {
    jdbcConn.executeQuery("SELECT * FROM blah", function(err, result) {
      test.expect(7);
      test.equal(null, err);
      test.ok(result && result.length == 1);
      test.equal(result[0].ID, 2);
      test.equal(result[0].NAME, 'Jason');
      test.ok(result[0].DATE);
      test.ok(result[0].TIME);
      test.ok(result[0].TIMESTAMP);
      test.done();
    });
  },
  // testeqdelete: function(test) {
  //   jdbcConn.executeQuery("DELETE FROM blah WHERE id = 2;", function(err, result) {
  //     test.expect(2);
  //     test.equal(null, err);
  //     test.ok(result);
  //     test.done();
  //   });
  // },
  // testeudelete: function(test) {
  //   jdbcConn.executeUpdate("DELETE FROM blah WHERE id = 4;", function(err, result) {
  //     test.expect(2);
  //     test.equal(null, err);
  //     test.ok(result && result == 1);
  //     test.done();
  //   });
  // },
  testdroptable: function(test) {
    jdbcConn.executeUpdate("DROP TABLE blah", function(err, result) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  }
};
