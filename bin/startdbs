#!/bin/bash
java -cp drivers\/hsqldb.jar org.hsqldb.server.Server --database.0 file:test\/mydb --dbname.0 xdb >test\/hsqldb.log 2>&1 &
java -Dderby.system.home=./test -classpath drivers\/derby.jar:drivers\/derbynet.jar:drivers\/derbytools.jar -jar drivers\/derbyrun.jar server start >test\/derby.log 2>&1 &
sleep 10
