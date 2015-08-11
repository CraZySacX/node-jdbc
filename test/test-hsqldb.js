var nodeunit = require('nodeunit');
var jdbcConn = new ( require('../lib/jdbc.js') ),
    jdbcConnWithProps = new ( require('../lib/jdbc.js') );

var configWithUserInUrl = {
  libpath: './drivers/hsqldb.jar',
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  url: 'jdbc:hsqldb:hsql://localhost/xdb;user=SA;password='
};

var configWithUserInConfig = {
  libpath: './drivers/hsqldb.jar',
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  url: 'jdbc:hsqldb:hsql://localhost/xdb',
  user : 'SA',
  password: ''
};

var configWithPropertiesInConfig = {
  libpath: './drivers/hsqldb.jar',
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  url: 'jdbc:hsqldb:hsql://localhost/xdb',
  properties: [
    ['user', 'SA'],
    ['password','']
  ]
};

module.exports = {
  tearDown: function(callback) {
    callback();
  },
  testinit: function(test) {  
    jdbcConn.initialize(configWithUserInUrl, function(err, drivername) {
      test.expect(2);
      test.equal(null, err);
      test.equal(drivername, 'org.hsqldb.jdbc.JDBCDriver');
      test.done();
    });
  },
  testinitwithproperties: function(test) {
    jdbcConnWithProps.initialize(configWithPropertiesInConfig, function(err, drivername) {
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
  testopenwithproperties: function(test) {
    jdbcConnWithProps.open(function(err, conn) {
      test.expect(2);
      test.equal(null, err);
      test.ok(conn);
      test.done();
    });
  },
  testcreatetable: function(test) {
    jdbcConn.executeQuery("CREATE TABLE blah (id int, name varchar(10));", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testcreatetablewithproperties: function(test) {
    jdbcConnWithProps.executeQuery("CREATE TABLE blahP (id int, name varchar(10));", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeqinsert: function(test) {
    jdbcConn.executeQuery("INSERT INTO blah VALUES (1, 'Jason');", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeqinsertwithproperties: function(test) {
    jdbcConnWithProps.executeQuery("INSERT INTO blahP VALUES (1, 'Jason');", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeuinsert: function(test) {
    jdbcConn.executeUpdate("INSERT INTO blah VALUES (3, 'Temp');", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testeuinsertwithproperties: function(test) {
    jdbcConnWithProps.executeUpdate("INSERT INTO blahP VALUES (3, 'Temp');", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testequpdate: function(test) {
    jdbcConn.executeQuery("UPDATE blah SET id = 2 WHERE name = 'Jason';", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testequpdatewithproperties: function(test) {
    jdbcConnWithProps.executeQuery("UPDATE blahP SET id = 2 WHERE name = 'Jason';", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeuupdate: function(test) {
    jdbcConn.executeUpdate("UPDATE blah SET id = 4 WHERE name = 'Temp';", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testeuupdatewithproperties: function(test) {
    jdbcConnWithProps.executeUpdate("UPDATE blahP SET id = 4 WHERE name = 'Temp';", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testselect: function(test) {
    jdbcConn.executeQuery("SELECT * FROM blah;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result.length == 2);
      test.done();
    });
  },
  testselectwithproperties: function(test) {
    jdbcConnWithProps.executeQuery("SELECT * FROM blahP;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result.length == 2);
      test.done();
    });
  },
  testeqdelete: function(test) {
    jdbcConn.executeQuery("DELETE FROM blah WHERE id = 2;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeqdeletewithproperties: function(test) {
    jdbcConnWithProps.executeQuery("DELETE FROM blahP WHERE id = 2;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testeudelete: function(test) {
    jdbcConn.executeUpdate("DELETE FROM blah WHERE id = 4;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testeudeletewithproperties: function(test) {
    jdbcConnWithProps.executeUpdate("DELETE FROM blahP WHERE id = 4;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testdroptable: function(test) {
    jdbcConn.executeQuery("DROP TABLE blah;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testdroptablewithproperties: function(test) {
    jdbcConnWithProps.executeQuery("DROP TABLE blahP;", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  },
  testshutdown: function(test) {
    jdbcConn.executeQuery("SHUTDOWN", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result);
      test.done();
    });
  }
};
