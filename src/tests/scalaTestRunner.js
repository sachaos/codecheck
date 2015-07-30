"use strict";

var TestRunner = require("./testRunner");

/**
 * scalatest outputs following line at end of test
 * [info] Tests: succeeded 114, failed 0, canceled 0, ignored 0, pending 0
 */
function ScalaTestRunner(args, cwd) {
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
  this.cmd = "sbt";
  this.args = ["test"].concat(args);
  this.cwd = cwd;

  this.onStdout(onStdout);
}

ScalaTestRunner.prototype = new TestRunner();

module.exports = ScalaTestRunner;