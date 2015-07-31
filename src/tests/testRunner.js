"use strict";

var EventEmitter = require('events').EventEmitter;
var AbstractApp  = require("../app/abstractApp");

function TestRunner(cmd, cwd) {
  this.setCommand(cmd);
  this.cwd = cwd;

  this.successCount = 0;
  this.failureCount = 0;

  this.emitter = new EventEmitter();
}

TestRunner.prototype = new AbstractApp();

TestRunner.prototype.getSuccessCount = function() {
  return this.successCount;
};

TestRunner.prototype.getFailureCount = function() {
  return this.failureCount;
};

TestRunner.prototype.getExecuteCount = function() {
  return this.successCount + this.failureCount;
};

TestRunner.prototype.doClose = function(code) {
  if (this._consoleOut) {
    process.stdout.write("codecheck: Finish with code " + code + "\n");
    process.stdout.write("  tests  : " + this.getExecuteCount() + "\n");
    process.stdout.write("  success: " + this.getSuccessCount() + "\n");
    process.stdout.write("  failure: " + this.getFailureCount() + "\n");
  }
};

module.exports = TestRunner;