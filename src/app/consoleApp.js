"use strict";

var AbstractApp      = require("./abstractApp");
var CommandResult    = require("../commandResult");
var EventEmitter     = require('events').EventEmitter;

function ConsoleApp(cmd, args, cwd) {
  this.cmd = cmd;
  this.args = this.normalizeArgs(args);
  this.cwd = cwd;

  this._input = [];
  this._expected = [];

  this.emitter = new EventEmitter();
}

ConsoleApp.prototype = new AbstractApp();

ConsoleApp.prototype.input = function() {
  if (arguments.length === 0) {
    return [].concat(this._input);
  }
  this._input = this._input.concat(this.normalizeArgs(arguments));
  return this;
};

ConsoleApp.prototype.expected = function() {
  if (arguments.length === 0) {
    return [].concat(this._expected);
  }
  this._expected = this._expected.concat(this.normalizeArgs(arguments));
  return this;
};

ConsoleApp.prototype.doClose = function(code) {
  if (this._consoleOut) {
    process.stdout.write("codecheck: Finish '" + this.getCommandLine() + "with code " + code + "\n");
  }
};

ConsoleApp.prototype.doRun = function(process) {
console.log("doRun");
  process.stdin.setEncoding("utf-8");
  var values = this.input();
  while (values.length) {
    var value = values.shift();
    process.stdin.write(value + "\n");
  }
  process.stdin.end();
};

ConsoleApp.prototype.runAndVerify = function(additionalArgs, done) {
  if (typeof(additionalArgs) === "function") {
    done = additionalArgs;
    additionalArgs = null;
  }
  var errors = [];
  var values = this.expected();
console.log("verify", values);
  this.onStdout(function(data) {
    if (values.length === 0) {
      errors.push("Expected vlaue is nothing, but output is " + data);
      return;
    }
    var value = values.shift();
    if (value !== data) {
      errors.push("Expected value is " + value + ", but output is " + data);
    }
  });
  this.onEnd(function(code) {
    while (values.length) {
      var value = values.shift();
      errors.push("Expected value is " + value + ", but no outpu");
    }
    if (code !== 0) {
      errors.push("Exit code is not 0: " + code);
    }
    var result = new CommandResult(errors.length === 0);
    if (errors.length) {
      result = result.withErrors(errors);
    }
    if (done) {
console.log("Done", result);
      done(result);
    }
  });
  this.run(additionalArgs);
};

module.exports = ConsoleApp;