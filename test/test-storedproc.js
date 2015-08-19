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
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  url: 'jdbc:hsqldb:hsql://localhost/xdb',
  user : 'SA',
  password: ''
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
    jdbcConn.executeUpdate("CREATE TABLE blah (id int, name varchar(10), date DATE, time TIME, timestamp TIMESTAMP);", function(err, result) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testeqinsert: function(test) {
    jdbcConn.executeQuery("INSERT INTO blah VALUES (1, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP);", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testcreateprocedure: function(test) {
    jdbcConn.executeUpdate("CREATE PROCEDURE new_blah(id int, name varchar(10))"
                         + "MODIFIES SQL DATA "
                         + "BEGIN ATOMIC "
                         + "  INSERT INTO blah VALUES (id, name, CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP); "
                         + "END;", function(err, result) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testcallprocedure: function(test) {
    jdbcConn.callProcedure("{ call new_blah(2, 'Another')}", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.equal(result, false);
      test.done();
    });
  },
  testselectaftercall: function(test) {
    jdbcConn.executeQuery("SELECT * FROM blah;", function(err, result) {
      test.expect(7);
      test.equal(null, err);
      test.ok(result && result.length == 2);
      test.equal(result[1].ID, 2);
      test.equal(result[1].NAME, 'Another');
      test.ok(result[1].DATE);
      test.ok(result[1].TIME);
      test.ok(result[1].TIMESTAMP);
      test.done();
    });
  },
  testdropprocedure: function(test) {
    jdbcConn.executeUpdate("DROP PROCEDURE IF EXISTS new_blah;", function(err, result) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testdroptable: function(test) {
    jdbcConn.executeUpdate("DROP TABLE IF EXISTS blah;", function(err, result) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  }
};
