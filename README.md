node-jdbc
=========

JDBC Wrapper for node.js

Latest Version
--------------
0.0.13

Support for adding multiple JARs to the classpath has been added.  Use the libs array as shown in
the initialize section below.  As of release 0.0.9, the minimum version of node.js has been increased 
to v0.10.  If you need to use this with node.js v0.8, use version 0.0.8 of node-jdbc.

Please visit [node-jdbc](https://www.npmjs.org/package/jdbc) for information on installing with npm.

## Status
[![Build Status](https://travis-ci.org/CraZySacX/node-jdbc.svg?branch=0.0.13)](https://travis-ci.org/CraZySacX/node-jdbc)

Initialize
----------
```javascript
var jdbc = new ( require('jdbc') );

var config = {
  libpath: __dirname + 'path/to/jdbc.jar',
  libs: [__dirname + 'path/to/other/jars.jar'],
  drivername: 'com.java.driverclass',
  url: 'url/to/database',
  // optionally  
  user: 'user',
  password: 'secret',
};

jdbc.initialize(config, function(err, res) {
  if (err) {
    console.log(err);
  }
});
```

Open Connection, Execute Queries, Close
---------------------------------------
```javascript
var genericQueryHandler = function(err, results) {
  if (err) {
    console.log(err);
  } else if (results) {
    console.log(results);
  }
  
  jdbc.close(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Connection closed successfully!");
    }
  });

};

jdbc.open(function(err, conn) {
  if (conn) {
    // SELECT statements are called with executeQuery
    jdbc.executeQuery("SELECT * FROM table", genericQueryHandler);

    // Table modifying statements (UPDATE/INSERT/DELETE/etc) are called with executeUpdate
    jdbc.executeUpdate("UPDATE table SET column = value", genericQueryHandler);

    // Use non-generic callbacks to handle queries individually and/or to nest queries
    jdbc.executeUpdate("INSERT INTO table VALUES (value)", function(err, results) {
      
      if(results > some_arbitrary_value) {
        jdbc.executeQuery("SELECT * FROM table where column = value", genericQueryHandler);
      }
    
    });
  }
});


```

API
---------------------------------

### initialize(config, callback)
 - see above example for config object
 - callback(error)

### open(callback)
 - opens a new connection
 - callback(error)

### close(callback)
 - closes any existing connection
 - callback(error)

### executeQuery(sql, callback)
 - SELECT commands.
 - callback(error, rset)

### executeUpdate(sql, callback) 
 - table modifying commands (INSERT, UPDATE, DELETE, etc).
 - callback(error, num_rows) where @num_rows is the number of rows modified
