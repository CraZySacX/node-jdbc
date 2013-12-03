var _ = require('underscore');
var p = require('promise');
var EventEmitter = require('events').EventEmitter;
var java = require('java');
var sys = require('sys');

function trim1 (str) {
    return (str || '').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function JDBCConn() {
    EventEmitter.call(this);
    this._config = {};
    this._conn = null;
}

sys.inherits(JDBCConn, EventEmitter);

JDBCConn.prototype.initialize = function(config) {
    var self = this;
    self._config = config;

    var minPoolSize = self._config.minpoolsize | 5;
    _(config.libpath).each(function(p){java.classpath.push(p)});
    java.newInstance(self._config.drivername, function( err, driver ){
        if (err) {
            self.emit('init', err, null);
        } else {
            java.callStaticMethod('java.sql.DriverManager','registerDriver', driver, function(err, result) {
                if (err) {
                    self.emit('init', err);
                } else {
                    java.callStaticMethod('java.sql.DriverManager','getConnection', self._config.url, function(err, conn) {
                        if (err) {
                            console.log(err);
                            self.emit('init', err);
                        } else {
                            self._conn = conn;
                            self.emit('init',null);
                        }
                    });
                }
            });
        }
    });
};

JDBCConn.prototype.close = function() {
    var self = this;
    self.emit('close', null);
};

JDBCConn.prototype.execute = function(sql) {
    var self = this;

    self._conn.createStatement(function(err, statement) {
        if (err) {
            self.emit('execute', err, null);
        } else {
            statement.executeQuery(sql ,function(err,resultset) {
                var resultset = resultset;
                if (err) {
                    self.emit('execute', err, null);
                } else {
                    self.emit('delivered', err, null);
                    resultset.getMetaData(function(err,rsmd) {
                        if (err) {
                            self.emit('execute', err, null);
                        } else {
                            var cc = rsmd.getColumnCountSync();
                            var columns = [''];
                            for(var i = 1; i <= cc; i++) {
                                var colname = rsmd.getColumnNameSync(i);
                                columns.push(colname);
                            }
                            var results = [];
                            var next = resultset.nextSync();

                            while(next) {
                                var row = {};

                                for(var i = 1; i <= cc; i++) {
                                    row[columns[i]] = trim1(resultset.getStringSync(i));
                                }
                                results.push(row);
                                next = resultset.nextSync();
                            }
                            self.emit('execute', null, results);
                        }
                    });
                }
            });
        }
    });
};

function JDBCPool(config ){
    var props = java.callStaticMethodSync('java.lang.System', 'getProperties');
//    props.setPropertySync("java.awt.headless", "true");
    _(config.libpath).each(function(p){java.classpath.push(p)});

    console.log(java.classpath);

    var cpds = java.newInstanceSync('com.mchange.v2.c3p0.ComboPooledDataSource');
    cpds.setDriverClassSync(config.drivername);
    cpds.setJdbcUrlSync( config.url );
    cpds.setMinPoolSizeSync(5);
    cpds.setAcquireIncrementSync(5);
    cpds.setMaxPoolSizeSync(20);
    this.cpds = cpds;

    return this;
};

JDBCPool.prototype.getConnection = function(){
    var denofied = p.denodeify(this.cpds.getConnection);
    return new JDBCConn2(denofied());
};

function JDBCConn2(conn){
    this.conn = conn;
};

JDBCConn2.prototype.execute = function(sql){
    return this.conn.then(function(conn){
        return "22";
    })
}
module.exports = [JDBCConn, JDBCPool];
