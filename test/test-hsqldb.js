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
  testinsert: function(test) {
    jdbcConn.on('executeQuery', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
    jdbcConn.executeQuery("INSERT INTO blah VALUES (1, 'Jason');");
  },
  testselect: function(test) {
    jdbcConn.on('executeQuery', function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result.length == 1);
      test.done();
    });
    jdbcConn.executeQuery("SELECT * FROM blah;");
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
