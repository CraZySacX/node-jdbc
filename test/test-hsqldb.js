var nodeunit = require('nodeunit');
var hsqldbConn = require('../lib/jdbc.js');

var config = {
  libpath: __dirname + '/hsqldb.jar',
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  url: 'jdbc:hsqldb:mem:testdb;user=SA;password='
};

module.exports['hsqldb'] = nodeunit.testCase({
  "test initialize": function(test) {  
    hsqldbConn.on('init', function(drivername) {
      test.equal(drivername, 'org.hsqldb.jdbc.JDBCDriver');
      test.done();
    });
    hsqldbConn.initialize(config);   
  },
  "test open": function(test) {
    hsqldbConn.on('open', function(conn) {
      test.ok(conn);
      test.done();
    });
    hsqldbConn.open();
  },
  "test close": function(test) {
    hsqldbConn.on('close', function() {
      test.done();
    });
    hsqldbConn.close();
  }
});
