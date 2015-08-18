"use strict";
var java = require('java');
var run = false;

function isJvmCreated() {
  return typeof java.onJvmCreated !== 'function';
}

module.exports = {
  isJvmCreated: function() {
    return isJvmCreated();
  },
  addOption: function(option) {
    if (!isJvmCreated() && option) {
      java.options.push(option);
    } else if (isJvmCreated()) {
      console.log("You've tried to add an option to an already running JVM!");
    }
  },
  setupClasspath: function(dependencyArr) {
    if (dependencyArr && !run) {
      java.classpath.push.apply(java.classpath, dependencyArr);
      run = true;
    }
  },
  getInstance: function() {
    return java;
  }
}
