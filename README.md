node-jdbc
=========

JDBC Wrapper for node.js

Initialize
----------
```javascript
var jdbc = require('jdbc');

var config = {
  libpath: __dirname + 'path/to/jdbc.jar',
  drivername: 'com.java.driverclass',
  url: 'url/to/database'
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
