var jinst = require('../lib/jinst.js');
var nodeunit = require('nodeunit');
var derbyConn = new( require('../lib/jdbc.js') );

jinst.setupClasspath(['./drivers/hsqldb.jar',
                      './drivers/derby.jar',
                      './drivers/derbyclient.jar',
                      './drivers/derbytools.jar']);

var config = {
  drivername: 'org.apache.derby.jdbc.ClientDriver',
  url: 'jdbc:derby://localhost:1527/testdb'
};

module.exports = {
  testinitderby: function(test) {
    derbyConn.initialize(config, function(err, drivername) {
      test.expect(2);
      test.equal(null, err);
      test.equal(drivername, 'org.apache.derby.jdbc.ClientDriver');
      test.done();
    });
  }
};
