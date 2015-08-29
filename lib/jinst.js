var java = require('java');

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
      console.log("This isn't currently supported.  Please add all option entries before calling any java methods");
      console.log("You can test for a running JVM with the isJvmCreated funtion.");
    }
  },
  setupClasspath: function(dependencyArr) {
    if (!isJvmCreated() && dependencyArr) {
      java.classpath.push.apply(java.classpath, dependencyArr);
    } else if (isJvmCreated()) {
      console.log("You've tried to add an entry to the classpath of an already running JVM!");
      console.log("This isn't currently supported.  Please add all classpath entries before calling any java methods");
      console.log("You can test for a running JVM with the isJvmCreated funtion.");
    }
  },
  getInstance: function() {
    return java;
  }
};
