var nodeunit = require('nodeunit');
var jdbcConn = require('../lib/jdbc.js');

var config = {
  libpath: './drivers/hsqldb.jar',
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  url: 'jdbc:hsqldb:hsql://localhost/xdb;user=SA;password='
};

module.exports = {
  tearDown: function(callback) {
    jdbcConn.removeAllListeners();
    callback();
  },
  testinit: function(test) {  
    jdbcConn.on('init', function(err, drivername) {
      test.expect(2);
      test.equal(null, err)
      test.equal(drivername, 'org.hsqldb.jdbc.JDBCDriver');
      test.done();
    });
    jdbcConn.initialize(config);   
  },
  testopen: function(test) {
    jdbcConn.on('open', function(err, conn) {
      test.expect(2);
      test.equal(null, err);
      test.ok(conn);
      test.done();
    });
    jdbcConn.open();
  },
  testcreatetable: function(test) {
    jdbcConn.on('executeQuery', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
    jdbcConn.executeQuery("CREATE TABLE blah (id int, name varchar(10));");
  },
  testeqinsert: function(test) {
    jdbcConn.on('executeQuery', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
    jdbcConn.executeQuery("INSERT INTO blah VALUES (1, 'Jason');");
  },
  testeuinsert: function(test) {
    jdbcConn.on('executeUpdate', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
    jdbcConn.executeUpdate("INSERT INTO blah VALUES (3, 'Temp');");
  },
  testequpdate: function(test) {
    jdbcConn.on('executeQuery', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
    jdbcConn.executeQuery("UPDATE blah SET id = 2 WHERE name = 'Jason';");
  },
  testeuupdate: function(test) {
    jdbcConn.on('executeUpdate', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
    jdbcConn.executeUpdate("UPDATE blah SET id = 4 WHERE name = 'Temp';");
  },
  testselect: function(test) {
    jdbcConn.on('executeQuery', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result.length == 2);
      test.done();
    });
    jdbcConn.executeQuery("SELECT * FROM blah;");
  },
  testeqdelete: function(test) {
    jdbcConn.on('executeQuery', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
    jdbcConn.executeQuery("DELETE FROM blah WHERE id = 2;");
  },
  testeudelete: function(test) {
    jdbcConn.on('executeUpdate', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
    jdbcConn.executeUpdate("DELETE FROM blah WHERE id = 4;");
  },
  testdroptable: function(test) {
    jdbcConn.on('executeQuery', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
    jdbcConn.executeQuery("DROP TABLE blah;");
  },
  testshutdown: function(test) {
    jdbcConn.on('executeQuery', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
    jdbcConn.executeQuery("SHUTDOWN");
  },
};
