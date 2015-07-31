"use strict";

var TestRunner = require("./testRunner");

/**
 * scalatest outputs following line at end of test
 * [info] Tests: succeeded 114, failed 0, canceled 0, ignored 0, pending 0
 */
function SbtTestRunner(args, cwd) {
  function hasTestArgument(args) {
    if (args.length === 0) {
      return false;
    }
    return args[0] === "test" || args[0] === "testOnly";
  }
  function onStdout(data) {
    var array = data.split(" ");
    var succeededIndex = array.indexOf("succeeded");
    var failedIndex = array.indexOf("failed");
    if (succeededIndex !== -1 && failedIndex !== -1 && failedIndex + 1 < array.length) {
      self.successCount = parseInt(array[succeededIndex + 1].replace(",", ""));
      self.failureCount = parseInt(array[failedIndex + 1].replace(",", ""));
    }
  }

  var self = this;
  if (!args) {
    args = [];
  }
  if (!hasTestArgument(args)) {
    args = ["test"].concat(args);
  }
  this.cmd = "sbt";
  this.args = args;
  this.cwd = cwd;

  this.onStdout(onStdout);
}

SbtTestRunner.prototype = new TestRunner();

module.exports = SbtTestRunner;