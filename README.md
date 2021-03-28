# node-jdbc
JDBC API Wrapper for node.js

## Looking for a more active maintainer
As you've probably noticed, I've not been able to actively maintain this project in a few years.  The project looks to be used by
quite a few people, so I'm willing to add collaborators to this project who are interested in more active maintenance.  You can
message me at jason.g.ozias@gmail.com.

## Latest Version
- 0.7.5

## Installation
- Release: ```npm i --save jdbc```
- Development: ```npm i --save jdbc@next``` (this will install code from the master branch).

Please visit [node-jdbc](https://www.npmjs.org/package/jdbc) for information on installing with npm.

## Status
[![Build Status](https://travis-ci.org/CraZySacX/node-jdbc.svg?branch=master)](https://travis-ci.org/CraZySacX/node-jdbc)
## Major API Refactor

- **One Instance to Rule Them All (JVM)**

[node-java](https://github.com/joeferner/node-java) spins up one JVM instance only.  Due to this fact, any JVM options
and classpath setup have to happen before the first java call.  I've created a
small wrapper (jinst.js) to help out with this.  See below for example
usage.  I usually add this to every file that may be an entry point.  The
[unit tests](https://github.com/CraZySacX/node-jdbc/tree/master/test)
are setup like this due to the fact that order can't be guaranteed.

```javascript
var jinst = require('jdbc/lib/jinst');

// isJvmCreated will be true after the first java call.  When this happens, the
// options and classpath cannot be adjusted.
if (!jinst.isJvmCreated()) {
  // Add all java options required by your project here.  You get one chance to
  // setup the options before the first java call.
  jinst.addOption("-Xrs");
  // Add all jar files required by your project here.  You get one chance to
  // setup the classpath before the first java call.
  jinst.setupClasspath(['./drivers/hsqldb.jar',
                        './drivers/derby.jar',
                        './drivers/derbyclient.jar',
                        './drivers/derbytools.jar']);
}
```


- **Connection Pooling**

Everyone gets a pool now.  By default with no extra configuration, the pool
is created with one connection that can be reserved/released.  Currently, the
pool is configured with two options: `minpoolsize` and `maxpoolsize`.  If
`minpoolsize` is set, when the pool is initialized, `minpoolsize` connections
will be created.  If `maxpoolsize` is set (the default value is `minpoolsize`),
and you try and reserve a connection and there aren't any available, the pool
will be grown.  This can happen until `maxpoolsize` connections have been
reserved.  The pool should be initialized after configuration is set with the
`initialize()` function.  JDBC connections can then be acquired with the
`reserve()` function and returned to the pool with the `release()` function.
Below is the unit test for the pool that demonstrates this behavior.

```javascript
var _ = require('lodash');
var nodeunit = require('nodeunit');
var jinst = require('../lib/jinst');
var Pool = require('../lib/pool');

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
    // Initialize the pool (create minpoolsize connections)
    testpool.initialize(function(err) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testreserve: function(test) {
    // Reserve a connection.
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
    // Release a connection.
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
    // Reserve then release a connection.
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
    // Reserve connections past minpoolsize.  This will grow the pool.
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
    // Reserve connections past maxpoolsize.  This will max out the pool, and
    // throw an error when the last reserve request is made.
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
```


- **Fully Wrapped Connection API**

The Java Connection API has almost been completely wrapped.  See
[connection.js](https://github.com/CraZySacX/node-jdbc/blob/master/lib/connection.js)
for a full list of functions.

```javascript
conn.setAutoCommit(false, function(err) {
  if (err) {
    callback(err);
  } else {
    callback(null);
  }
});
```


- **ResultSet processing separated from statement execution**

ResultSet processing has been separated from statement execution to allow for
more flexibility.  The ResultSet returned from executing a select query can
still be processed into an object array using the `toObjArray()` function on the
resultset object.

```javascript
// Select statement example.
conn.createStatement(function(err, statement) {
  if (err) {
    callback(err);
  } else {
    statement.executeQuery("SELECT * FROM blah;", function(err, resultset) {
      if (err) {
        callback(err)
      } else {
        // Convert the result set to an object array.
        resultset.toObjArray(function(err, results) {
          if (results.length > 0) {
            console.log("ID: " + results[0].ID);
          }
          callback(null, resultset);
        });
      }
    });
  }
});
```
- **Oracle and Closing Statements**

If you are experiencing the "ORA-01000: maximum open cursors exceeded" error, you can avoid it by closing your statements with:
```javascript
statement.close()
```

- **Automatically Closing Idle Connections**

If you pass a **maxidle** property in the config for a new connection pool,
`pool.reserve()` will close stale connections, and will return a sufficiently fresh connection, or a new connection.  **maxidle** can be number representing the maximum number of milliseconds since a connection was last used, that a connection is still considered alive (without making an extra call to the database to check that the connection is valid).  If **maxidle** is a falsy value or is absent from the config, this feature does not come into effect.  This feature is useful, when connections are automatically closed from the server side after a certain period of time, and when it is not appropriate to use the connection keepalive feature.

## Usage
Some mininal examples are given below.  I've also created a
[node-example-jdbc](https://github.com/CraZySacX/node-jdbc-example) project with more thorough examples.

### Initialize
```javascript
var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/hsqldb.jar',
                        './drivers/derby.jar',
                        './drivers/derbyclient.jar',
                        './drivers/derbytools.jar']);
}

var config = {
  // Required
  url: 'jdbc:hsqldb:hsql://localhost/xdb',

  // Optional
  drivername: 'my.jdbc.DriverName',
  minpoolsize: 10,
  maxpoolsize: 100,

  // Note that if you sepecify the user and password as below, they get
  // converted to properties and submitted to getConnection that way.  That
  // means that if your driver doesn't support the 'user' and 'password'
  // properties this will not work.  You will have to supply the appropriate
  // values in the properties object instead.
  user: 'SA',
  password: '',
  properties: {}
};

// or user/password in url
// var config = {
//   // Required
//   url: 'jdbc:hsqldb:hsql://localhost/xdb;user=SA;password=',
//
//   // Optional
//   drivername: 'my.jdbc.DriverName',
//   minpoolsize: 10
//   maxpoolsize: 100,
//   properties: {}
// };

// or user/password in properties
// var config = {
//   // Required
//   url: 'jdbc:hsqldb:hsql://localhost/xdb',
//
//   // Optional
//   drivername: 'my.jdbc.DriverName',
//   minpoolsize: 10,
//   maxpoolsize: 100,
//   properties: {
//     user: 'SA',
//     password: ''
//     // Other driver supported properties can be added here as well.
//   }
// };

var hsqldb = new JDBC(config);

hsqldb.initialize(function(err) {
  if (err) {
    console.log(err);
  }
});
```

### Reserve Connection, Execute Queries, Release Connection
```javascript
// This assumes initialization as above.
// For series execution.
var asyncjs = require('async');

hsqldb.reserve(function(err, connObj) {
  // The connection returned from the pool is an object with two fields
  // {uuid: <uuid>, conn: <Connection>}
  if (connObj) {
    console.log("Using connection: " + connObj.uuid);
    // Grab the Connection for use.
    var conn = connObj.conn;

    // Adjust some connection options.  See connection.js for a full set of
    // supported methods.
    asyncjs.series([
      function(callback) {
        conn.setAutoCommit(false, function(err) {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      },
      function(callback) {
        conn.setSchema("test", function(err) {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      }
    ], function(err, results) {
      // Check for errors if need be.
      // results is an array.
    });

    // Query the database.
    asyncjs.series([
      function(callback) {
        // CREATE SQL.
        conn.createStatement(function(err, statement) {
          if (err) {
            callback(err);
          } else {
            statement.executeUpdate("CREATE TABLE blah "
                                  + "(id int, name varchar(10), date DATE, "
                                  + " time TIME, timestamp TIMESTAMP);",
                                  function(err, count) {
              if (err) {
                callback(err);
              } else {
                callback(null, count);
              }
            });
          }
        });
      },
      function(callback) {
        conn.createStatement(function(err, statement) {
          if (err) {
            callback(err);
          } else {
            statement.executeUpdate("INSERT INTO blah "
                                  + "VALUES (1, 'Jason', CURRENT_DATE, "
                                  + "CURRENT_TIME, CURRENT_TIMESTAMP);",
                                  function(err, count) {
              if (err) {
                callback(err);
              } else {
                callback(null, count);
              }
            });
          }
        });
      },
      function(callback) {
        // Update statement.
        conn.createStatement(function(err, statement) {
          if (err) {
            callback(err);
          } else {
            statement.executeUpdate("UPDATE blah "
                                  + "SET id = 2 "
                                  + "WHERE name = 'Jason';",
                                  function(err, count) {
              if (err) {
                callback(err);
              } else {
                callback(null, count);
              }
            });
          }
        });
      },
      function(callback) {
        // Select statement example.
        conn.createStatement(function(err, statement) {
          if (err) {
            callback(err);
          } else {
            // Adjust some statement options before use.  See statement.js for
            // a full listing of supported options.
            statement.setFetchSize(100, function(err) {
              if (err) {
                callback(err);
              } else {
                statement.executeQuery("SELECT * FROM blah;",
                                       function(err, resultset) {
                  if (err) {
                    callback(err)
                  } else {
                    resultset.toObjArray(function(err, results) {
                      if (results.length > 0) {
                        console.log("ID: " + results[0].ID);
                      }
                      callback(null, resultset);
                    });
                  }
                });
              }
            });
          }
        });
      },
      function(callback) {
        conn.createStatement(function(err, statement) {
          if (err) {
            callback(err);
          } else {
            statement.executeUpdate("DELETE FROM blah "
                                  + "WHERE id = 2;", function(err, count) {
              if (err) {
                callback(err);
              } else {
                callback(null, count);
              }
            });
          }
        });
      },
      function(callback) {
        conn.createStatement(function(err, statement) {
          if (err) {
            callback(err);
          } else {
            statement.executeUpdate("DROP TABLE blah;", function(err, count) {
              if (err) {
                callback(err);
              } else {
                callback(null, count);
              }
            });
          }
        });
      }
    ], function(err, results) {
      // Results can also be processed here.
      // Release the connection back to the pool.
      hsqldb.release(connObj, function(err) {
        if (err) {
          console.log(err.message);
        }
      });
    });
  }
});
```
