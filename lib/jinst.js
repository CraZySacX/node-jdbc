import { EventEmitter } from 'events';
const java = require("java");

function isJvmCreated() {
  return typeof java.onJvmCreated !== 'function';
}

var jinst = {
  isJvmCreated: function() {
    return isJvmCreated();
  },
  addOption: function(option) {
    if (!isJvmCreated() && option) {
      java.options.push(option);
    } else if (isJvmCreated()) {
      console.error("You've tried to add an option to an already running JVM!");
      console.error("This isn't currently supported.  Please add all option entries before calling any java methods");
      console.error("You can test for a running JVM with the isJvmCreated funtion.");
    }
  },
  setupClasspath: function(dependencyArr) {
    if (!isJvmCreated() && dependencyArr) {
      java.classpath.push.apply(java.classpath, dependencyArr);
    } else if (isJvmCreated()) {
      console.error("You've tried to add an entry to the classpath of an already running JVM!");
      console.error("This isn't currently supported.  Please add all classpath entries before calling any java methods");
      console.error("You can test for a running JVM with the isJvmCreated funtion.");
    }
  },
  getInstance: function() {
    return java;
  },
  events: new EventEmitter(),
};

export default jinst;