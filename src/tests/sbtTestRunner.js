"use strict";

var TestRunner = require("./testRunner");

/**
 * scalatest outputs following line at end of test
 * [info] Tests: succeeded 114, failed 0, canceled 0, ignored 0, pending 0
 * specs2 outputs folllowing line at end of test
 * [error] Failed: Total 4, Failed 1, Errors 0, Passed 3
 */
function SbtTestRunner(args, cwd) {
  function hasTestArgument(args) {
    if (args.length === 0) {
      return false;
    }
    return args[0] === "test" || args[0] === "testOnly";
  }
  function onStdout(data) {
    function scalaTest() {
      var succeededIndex = array.indexOf("succeeded");
      var failedIndex = array.indexOf("failed");
      if (succeededIndex !== -1 && failedIndex !== -1 && failedIndex + 1 < array.length) {
        self.successCount = parseInt(array[succeededIndex + 1].replace(",", ""));
        self.failureCount = parseInt(array[failedIndex + 1].replace(",", ""));
        return true;
      }
      return false;
    }
    function specs2() {
      var passedIndex = array.indexOf("Passed");
      var failedIndex = array.indexOf("Failed");
      var errorsIndex = array.indexOf("Errors");
      if (passedIndex !== -1 && failedIndex !== -1 && errorsIndex !== -1 && passedIndex + 1 < array.length) {
        self.successCount = parseInt(array[passedIndex + 1].replace(",", ""));
        self.failureCount = parseInt(array[failedIndex + 1].replace(",", "")) +
                            parseInt(array[errorsIndex + 1].replace(",", ""));
        return true;
      }
      return false;
    }
    var array = data.split(" ");
    if (scalaTest()) { return;}
    if (specs2()) { return;}
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