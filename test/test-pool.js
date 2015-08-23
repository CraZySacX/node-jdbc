var _ = require('underscore');
var nodeunit = require('nodeunit');
var jinst = require('../lib/jinst');
var Pool = require('../lib/pool');
var java = jinst.getInstance();

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/hsqldb.jar',
                        './drivers/derby.jar',
                        './drivers/derbyclient.jar',
                        './drivers/derbytools.jar']);
}

var config = {
  url: 'jdbc:hsqldb:hsql://localhost/xdb',
  user : 'SA',
  password: '',
  minpoolsize: 2,
  maxpoolsize: 3
};

var testpool = null;
var testconn = null;

module.exports = {
  setUp: function(callback) {
    if (testpool === null) {
      testpool = new Pool(config);
    }
    callback();
  },
  testinitialize: function(test) {
    testpool.initialize(function(err) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testreserve: function(test) {
    testpool.reserve(function(err, conn) {
      test.expect(4);
      test.equal(null, err);
      test.ok(conn && typeof conn == 'object');
      test.equal(testpool._pool.length, 1);
      test.equal(testpool._reserved.length, 1);
      testconn = conn;
      test.done();
    });
  },
  testrelease: function(test) {
    testpool.release(testconn, function(err, conn) {
      test.expect(3);
      test.equal(null, err);
      test.equal(testpool._pool.length, 2);
      test.equal(testpool._reserved.length, 0);
      testconn = null;
      test.done();
    });
  },
  testreserverelease: function(test) {
    testpool.reserve(function(err, conn) {
      if (err) {
        console.log(err);
      } else {
        testpool.release(conn, function(err) {
          test.expect(3);
          test.equal(null, err);
          test.equal(testpool._pool.length, 2);
          test.equal(testpool._reserved.length, 0);
          test.done();
        });
      }
    });
  },
  testreservepastmin: function(test) {
    var conns = [];
    for(i = 0; i < 3; i++) {
      testpool.reserve(function(err, conn) {
        conns.push(conn);
        if (i == 3) {
          test.expect(2);
          test.equal(testpool._pool.length, 0);
          test.equal(testpool._reserved.length, 3);
          _.each(conns, function(conn) {
            testpool.release(conn, function(err) {});
          });
          test.done();
        }
      });
    }
  },
  testovermax: function(test) {
    var conns = [];
    for(i = 0; i < 4; i++) {
      testpool.reserve(function(err, conn) {
        if (err) {
          if (i == 3) {
            test.expect(3);
            test.ok(err);
            test.equal(testpool._reserved.length, 3);
            test.equal(testpool._pool.length, 0);
            _.each(conns, function(conn) {
              testpool.release(conn, function(err) {});
            });
            test.done();
          } else {
            console.log(err);
          }
        } else {
          conns.push(conn);
        }
      });
    }
  }
};
