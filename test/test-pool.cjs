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

module.exports = {
  setUp: function(callback) {
    testpool = new Pool(config);
    testpool.initialize(function(err) {
      callback();
    });
  },
  tearDown: function(callback) {
    testpool = null;
    callback();
  },
  teststatus: function(test) {
    testpool.reserve(function(err) {
      testpool.status(function(err, status) {
        test.expect(2);
        test.equal(status.available, 1);
        test.equal(status.reserved, 1);
        test.done();
      });
    });
  },
  testreserverelease: function(test) {
    testpool.reserve(function(err, conn) {
      testpool.release(conn, function(err, conn) {
        test.expect(3);
        test.equal(null, err);
        test.equal(testpool._pool.length, 2);
        test.equal(testpool._reserved.length, 0);
        test.done();
      });
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
  },
  testpurge: function(test) {
    testpool.purge(function(err) {
      test.expect(3);
      test.equal(null, err);
      test.equal(testpool._pool.length, 0);
      test.equal(testpool._reserved.length, 0);
      test.done();
    });
  },
};
