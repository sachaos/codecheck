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
    var regex = /.* run: (\d+),.* Failures: (\d+),.* Errors: (\d+),.*/;
    var match = data.match(regex);
    if (match) {
      self.failureCount = parseInt(match[2]) + parseInt(match[3]);
      self.successCount = parseInt(match[1]) - self.failureCount;
    }
  }

  var self = this;
  this.init();
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
