"use strict";

var TestRunner = require("./testRunner");

/**
 * mvn outputs following line at end of test
 * Tests run: 34, Failures: 3, Errors: 3, Skipped: 0
 */
function MavenTestRunner(args, cwd) {
  function hasTestArgument(args) {
    if (args.length === 0) {
      return false;
    }
    return args[0] === "test";
  }
  function onStdout(data) {
    var keys = ["run:", "Failures:", "Errors:"];
    var values = [-1, -1, -1];
    var array = data.split(" ");
    for (var i=0; i<keys.length; i++) {
      var n = array.indexOf(keys[i]);
      if (n !== -1 && n + 1 < array.length) {
        values[i] = parseInt(array[n + 1]);
      }
    }
    if (values.every(function(v) { return v !== -1;})) {
      self.failureCount = values[1] + values[2];
      self.successCount = values[0] - self.failureCount;
    }
  }

  var self = this;
  if (!args) {
    args = [];
  }
  if (!hasTestArgument(args)) {
    args = ["test"].concat(args);
  }
  this.cmd = "mvn";
  this.args = args;
  this.cwd = cwd;

  this.onStdout(onStdout);
}

MavenTestRunner.prototype = new TestRunner();

module.exports = MavenTestRunner;
