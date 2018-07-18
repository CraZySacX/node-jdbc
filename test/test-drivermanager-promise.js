var config = require("./common/drivermanager");
var dm = require('../lib/drivermanager.js');
var jinst = require('../lib/jinst');
require("../lib/jdbc").Promise = global.Promise || require("bluebird");

var java = jinst.getInstance();

module.exports = {
  testgetconnection: function(test) {
    test.expect(1);
    dm.getConnection(config.url + ';user=' + config.user + ';password=' + config.password).then(function(conn) {
      test.ok(conn);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetconnectionwithprops: function(test) {
    test.expect(1);
    var Properties = java.import('java.util.Properties');
    var props = new Properties();

    props.putSync('user', config.user);
    props.putSync('password', config.password);

    dm.getConnection(config.url, props).then(function(conn) {
      test.ok(conn);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetconnectionwithuserpass: function(test) {
    test.expect(1);
    dm.getConnection(config.url, config.user, config.password).then(function(conn) {
      test.ok(conn);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testsetlogintimeout: function(test) {
    test.expect(1);
    dm.setLoginTimeout(60).then(function() {
      test.ok(true);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  },
  testgetlogintimeout: function(test) {
    test.expect(2);
    dm.getLoginTimeout().then(function(seconds) {
      test.ok(seconds);
      test.equal(60, seconds);
      test.done();
    }).catch(function(err) {
      console.log(err);
      test.done();
    });
  }
};
