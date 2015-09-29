"use strict";

var TestRunner = require("./testRunner");

/**
 * nunit-console outputs following line at end of test
 * Tests run: 22, Failures: 0, Not run: 0, Time: 0.414 seconds
 */
function NUnitTestRunner(args, cwd) {
  function onStdout(data) {
    var regex = /^Tests run: (\d+), Failures: (\d+),/;
    var match = data.match(regex);
    if (match) {
      self.failureCount = parseInt(match[2]);
      self.successCount = parseInt(match[1]) - self.failureCount;
      return;
    }
    regex = /^Tests run: (\d+), Errors: (\d+), Failures: (\d+),/;
    match = data.match(regex);
    if (match) {
      self.failureCount = parseInt(match[2]) + parseInt(match[3]);
      self.successCount = parseInt(match[1]) - self.failureCount;
      return;
    }
  }

  var self = this;
  this.init();
  this.cmd = "nunit-console";
  this.args = args;
  this.cwd = cwd;

  this.onStdout(onStdout);
}

NUnitTestRunner.prototype = new TestRunner();

module.exports = NUnitTestRunner;
