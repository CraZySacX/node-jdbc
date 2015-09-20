var _ = require('lodash');
var asyncjs = require('async');
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
    asyncjs.times(3, function(n, next) {
      testpool.reserve(function(err, conn) {
        next(err, conn);
      });
    }, function(err, results) {
      test.expect(2);
      test.equal(testpool._pool.length, 0);
      test.equal(testpool._reserved.length, 3);
      _.each(results, function(conn) {
        testpool.release(conn, function(err) {});
      });
      test.done();
    });
  },
  testovermax: function(test) {
    asyncjs.times(4, function(n, next) {
      testpool.reserve(function(err, conn) {
        next(err, conn);
      });
    }, function(err, results) {
      test.expect(3);
      test.ok(err);
      test.equal(testpool._reserved.length, 3);
      test.equal(testpool._pool.length, 0);
      _.each(results, function(conn) {
        testpool.release(conn, function(err) {});
      });
      test.done();
    });
  }
};
