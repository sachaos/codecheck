"use strict";

var spawn        = require("child_process").spawn;
var EventEmitter = require('events').EventEmitter;
var LineEventEmitter = require("../utils/lineEventEmitter");
var CommandResult    = require("../commandResult");

function ConsoleApp(cmd, args, cwd) {
  this.cmd = cmd;
  this.args = this.normalizeArgs(args);
  this.cwd = cwd;

  this.emitter = new EventEmitter();

  this._input = [];
  this._expected = [];
  this.exitCode = null;

  this._consoleOut = false;
}

ConsoleApp.prototype.normalizeArgs = function(args) {
  var ret = [];
  if (args) {
    for (var i=0; i<args.length; i++) {
      if (Array.isArray(args[i])) {
        ret.concat(args[i]);
      } else {
        ret.push(args[i]);
      }
    }
  }
  return ret;
};

ConsoleApp.prototype.getCommandLine = function() {
  return this.cmd + " " + this.args.join(" ");
};

ConsoleApp.prototype.input = function() {
  if (arguments.length === 0) {
    return [].concat(this._input);
  }
  for (var i=0; i<arguments.length; i++) {
    this._input.push(arguments[i]);
  }
  return this;
};

ConsoleApp.prototype.expected = function() {
  if (arguments.length === 0) {
    return [].concat(this._expected);
  }
  for (var i=0; i<arguments.length; i++) {
    this._expected.push(arguments[i]);
  }
  return this;
};

ConsoleApp.prototype.consoleOut = function() {
  if (arguments.length === 0) {
    return this._consoleOut;
  } else {
    this._consoleOut = arguments[0];
    return this;
  }
};

ConsoleApp.prototype.getExitCode = function() {
  return this.exitCode;
};

ConsoleApp.prototype.run = function(additionalArgs) {
  var self = this;
  var args = this.args.concat(this.normalizeArgs(additionalArgs));
  var options = {
    env: process.env
  };
  if (this.cwd) {
    options.cwd = this.cwd;
  }

  var emitter = this.emitter;
  var stdoutBuf = new LineEventEmitter(emitter, "stdout");
  var stderrBuf = new LineEventEmitter(emitter, "stderr");

  var p = spawn(this.cmd, args, options);
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
    stdoutBuf.close();
    stderrBuf.close();

    self.executed = true;
    self.exitCode = code;
    self.childProcess = null;

    emitter.emit("end", code);
    if (self._consoleOut) {
      process.stdout.write("codecheck: Finish '" + self.getCommandLine() + "with code " + code + "\n");
    }
  });
  p.stdin.setEncoding("utf-8");
  this.childProcess = p;
  var values = self.input();
  while (values.length) {
    var value = values.shift();
    p.stdin.write(value + "\n");
  }
  p.stdin.end();
};

ConsoleApp.prototype.runAndVerify = function(done) {
  var errors = [];
  var values = this.expected();
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
      done(result);
    }
  });
  this.run();
};

//Events
ConsoleApp.prototype.on = function(name, callback) {
  if (!name || !callback) {
    throw new Error("Illegal arguments: name=" + name + ", callback=" + callback);
  }
  this.emitter.on(name, callback);
};

ConsoleApp.prototype.onEnd = function(callback) {
  this.on("end", callback);
};

ConsoleApp.prototype.onStdout = function(callback) {
  this.on("stdout", callback);
};

ConsoleApp.prototype.onStderr = function(callback) {
  this.on("stderr", callback);
};

module.exports = ConsoleApp;