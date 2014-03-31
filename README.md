node-jdbc
=========

JDBC Wrapper for node.js

Latest Version
--------------
0.0.5

## Status
[![Build Status](https://travis-ci.org/CraZySacX/node-jdbc.png)](https://travis-ci.org/CraZySacX/node-jdbc)
[![endorse](https://api.coderwall.com/crazysacx/endorsecount.png)](https://coderwall.com/crazysacx)

Initialize
----------
```javascript
var jdbc = require('jdbc');

var config = {
  libpath: __dirname + 'path/to/jdbc.jar',
  drivername: 'com.java.driverclass',
  url: 'url/to/database',

  //OPTIONAL AS NEEDED:
  user: 'username',
  password: 'password
};

jdbc.initialize(config);
jdbc.on("init", function(err, res) {
  if (err) {
    console.log(err);
  }
});
```

Open Connection, Execute Queries, Close
---------------------------------------
```javascript
var queryHandler = function(err, results) {
  if (err) {
    console.log(err);
  } else if (results) {
    console.log(results);
  }
};

jdbc.open();
jdbc.on("open", function(err, conn) {
  if (conn) {
    jdbc.on("executeQuery", queryHandler);
    jdbc.executeQuery("SELECT * FROM table");
    jdbc.executeQuery("SELECT * FROM anotherTable");
  }
});

jdbc.close();
```
