"use strict";

var TestRunner = require("./testRunner");

function PhpUnitTestRunner(args, cwd) {
  function initArgs() {
    var ret = args || [];
    if (ret.indexOf("--tap") === -1) {
      ret.unshift("--tap");
    }
    return ret;
  }
  function onStdout(data) {
    function isOk() {
      return array.length > 0 && array[0] === "ok";
    }
    function isNotOk() {
      return array.length > 1 && array[0] === "not" && array[1] === "ok";
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
  this.cmd = "phpunit";
  this.args = initArgs();
  this.cwd = cwd;

  this.onStdout(onStdout);
}

PhpUnitTestRunner.prototype = new TestRunner();

module.exports = PhpUnitTestRunner;