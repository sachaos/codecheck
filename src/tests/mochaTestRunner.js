"use strict";

var TestRunner = require("./testRunner");

function MochaTestRunner(args, cwd) {
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
  if (!args) {
    args = [];
  }
  this.cmd = "mocha";
  this.args = args.concat(["-R", "tap"]);
  this.cwd = cwd;

  this.onStdout(onStdout);
}

MochaTestRunner.prototype = new TestRunner();

module.exports = MochaTestRunner;