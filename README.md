node-jdbc
=========

JDBC Wrapper for node.js

Initialize
----------
```javascript
var config = {
    libpath: __dirname + 'path/to/jdbc.jar',
    drivername: 'com.java.driverclass',
    url: 'url/to/database'
};

jdbc.initialize(config);
jdbc.on("init", function(res, err) {
    if (err) {
        console.log(err);
    }
});
```

Open Connection and Execute
---------------------------
```javascript
jdbc.open();
jdbc.on("open", function(conn, err) {
	jdbc.execute("SELECT * FROM table");
    jdbc.on("execute", function(err, results) {
        console.log(results);
    });
});
```