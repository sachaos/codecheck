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
      var regex = /.* succeeded (\d+), failed (\d+), .*/;
      var match = data.match(regex);
      if (match) {
        self.successCount = parseInt(match[1]);
        self.failureCount = parseInt(match[2]);
        return true;
      }
      return false;
    }
    function specs2() {
      var regex = /.* Failed (\d+), Errors (\d+), Passed (\d+)/;
      var match = data.match(regex);
      if (match) {
        self.successCount = parseInt(match[3]);
        self.failureCount = parseInt(match[1]) + parseInt(match[2]);
        return true;
      }
      return false;
    }
    scalaTest() || specs2();
  }

  var self = this;
  this.init();
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