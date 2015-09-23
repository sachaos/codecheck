"use strict";

var TestRunner = require("./testRunner");

function ProveTestRunner(args, cwd) {
  function initArgs() {
    var ret = args || [];
    if (ret.indexOf("-v") === -1) {
      ret.unshift("-v");
    }
    return ret;
  }
  function onStdout(data) {
    function isOk() {
      return array.length > 1 && array[0] === "ok";
    }
    function isNotOk() {
      return array.length > 2 && array[0] === "not" && array[1] === "ok";
    }
    var array = data.split(" ");
    if (isOk()) {
      self.successCount++;
    } else if (isNotOk()) {
      self.failureCount++;
    }
  }

  var self = this;
  this.init();
  this.cmd = "prove";
  this.args = initArgs();
  this.cwd = cwd;

  this.onStdout(onStdout);
}

ProveTestRunner.prototype = new TestRunner();

module.exports = ProveTestRunner;