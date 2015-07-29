"use strict";

var spawn        = require("child_process").spawn;
var EventEmitter = require('events').EventEmitter;
var LineEventEmitter = require("../utils/lineEventEmitter");

function TestRunner(cmd, args, cwd) {
  this.cmd = cmd;
  this.args = args;
  this.cwd = cwd;

  this.emitter = new EventEmitter();

  this.childProcess = null;
  this.executed = false;
  this.exitCode = null;

  this.successCount = 0;
  this.failureCount = 0;

  this._consoleOut = false;
}

TestRunner.prototype.consoleOut = function() {
  if (arguments.length === 0) {
    return this._consoleOut;
  } else {
    this._consoleOut = arguments[0];
    return this;
  }
};

TestRunner.prototype.getExitCode = function() {
  return this.exitCode;
};

TestRunner.prototype.isExecuted = function() {
  return this.executed;
};

TestRunner.prototype.getSuccessCount = function() {
  return this.successCount;
};

TestRunner.prototype.getFailureCount = function() {
  return this.failureCount;
};

TestRunner.prototype.getExecuteCount = function() {
  return this.successCount + this.failureCount;
};

TestRunner.prototype.run = function() {
  var self = this;
  var options = {
    env: process.env
  };
  if (this.cwd) {
    options.cwd = this.cwd;
  }
  var emitter = this.emitter;
  var stdoutBuf = new LineEventEmitter(emitter, "stdout");
  var stderrBuf = new LineEventEmitter(emitter, "stderr");

  var p = spawn(this.cmd, this.args, options);
  p.stdout.on("data", function(data) {
    if (self._consoleOut) {
      process.stdout.write(data);
    }
    stdoutBuf.add(data);
  });
  p.stderr.on("data", function(data) {
    if (self._consoleOut) {
      process.stderr.write(data);
    }
    stderrBuf.add(data);
  });
  p.on('close', function(code) {
    stdoutBuf.end();
    stderrBuf.end();

    self.executed = true;
    self.exitCode = code;

    emitter.emit("end", code);
    if (self._consoleOut) {
      process.stdout.write("codecheck: Finish with code " + code + "\n");
      process.stdout.write("  tests  : " + self.getExecuteCount() + "\n");
      process.stdout.write("  success: " + self.getSuccessCount() + "\n");
      process.stdout.write("  failure: " + self.getFailureCount() + "\n");
    }
  });
  this.childProcess = p;
};

//Events
TestRunner.prototype.on = function(name, callback) {
  if (!name || !callback) {
    throw new Error("Illegal arguments: name=" + name + ", callback=" + callback);
  }
  this.emitter.on(name, callback);
};

TestRunner.prototype.onEnd = function(callback) {
  this.on("end", callback);
};

TestRunner.prototype.onStdout = function(callback) {
  this.on("stdout", callback);
};

TestRunner.prototype.onStderr = function(callback) {
  this.on("stderr", callback);
};

module.exports = TestRunner;