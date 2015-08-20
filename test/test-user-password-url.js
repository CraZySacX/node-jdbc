var jinst = require('../lib/jinst.js');
var nodeunit = require('nodeunit');
var jdbcConn = new ( require('../lib/jdbc.js') );

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/hsqldb.jar',
                        './drivers/derby.jar',
                        './drivers/derbyclient.jar',
                        './drivers/derbytools.jar']);
}

var config = {
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  url: 'jdbc:hsqldb:hsql://localhost/xdb;user=SA;password='
};

module.exports = {
  testinit: function(test) {
    jdbcConn.initialize(config, function(err, drivername) {
      test.expect(2);
      test.equal(null, err);
      test.equal(drivername, 'org.hsqldb.jdbc.JDBCDriver');
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
  testcreatetable: function(test) {
    jdbcConn.executeQuery("CREATE TABLE blahU (id int, name varchar(10), date DATE, time TIME, timestamp TIMESTAMP);", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeqinsert: function(test) {
    jdbcConn.executeQuery("INSERT INTO blahU VALUES (1, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP);", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeuinsert: function(test) {
    jdbcConn.executeUpdate("INSERT INTO blahU VALUES (3, 'Temp', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP);", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testequpdate: function(test) {
    jdbcConn.executeQuery("UPDATE blahU SET id = 2 WHERE name = 'Jason';", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeuupdate: function(test) {
    jdbcConn.executeUpdate("UPDATE blahU SET id = 4 WHERE name = 'Temp';", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testselect: function(test) {
    jdbcConn.executeQuery("SELECT * FROM blahU;", function(err, result) {
      test.expect(6);
      test.equal(null, err);
      test.ok(result && result.length == 2);
      test.equal(result[0].NAME, 'Jason');
      test.ok(result[0].DATE);
      test.ok(result[0].TIME);
      test.ok(result[0].TIMESTAMP);
      test.done();
    });
  },
  testeqdelete: function(test) {
    jdbcConn.executeQuery("DELETE FROM blahU WHERE id = 2;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeudelete: function(test) {
    jdbcConn.executeUpdate("DELETE FROM blahU WHERE id = 4;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testdroptable: function(test) {
    jdbcConn.executeQuery("DROP TABLE blahU;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  }
};
