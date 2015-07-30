"use strict";

var spawn        = require("child_process").spawn;
var LineEventEmitter = require("../utils/lineEventEmitter");

function AbstractApp(cmd, args, cwd) {
  this.cmd = cmd;
  this.args = this.normalizeArgs(args);
  this.cwd = cwd;

  this.exitCode = null;
  this.executed = false;
  this.childProcess = null;

  this._consoleOut = false;
}

AbstractApp.prototype.normalizeArgs = function(args) {
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

AbstractApp.prototype.getCommandLine = function() {
  return this.cmd + " " + this.args.join(" ");
};

AbstractApp.prototype.consoleOut = function() {
  if (arguments.length === 0) {
    return this._consoleOut;
  } else {
    this._consoleOut = arguments[0];
    return this;
  }
};

AbstractApp.prototype.isExecuted = function() {
  return this.executed;
};

AbstractApp.prototype.getExitCode = function() {
  return this.exitCode;
};

AbstractApp.prototype.run = function(additionalArgs) {
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
    if (self.doClose) {
      self.doClose(code);
    }
  });
  this.childProcess = p;
  if (self.doRun) {
    self.doRun(p);
  }
};

//Events
AbstractApp.prototype.on = function(name, callback) {
  if (!name || !callback) {
    throw new Error("Illegal arguments: name=" + name + ", callback=" + callback);
  }
  this.emitter.on(name, callback);
};

AbstractApp.prototype.onEnd = function(callback) {
  this.on("end", callback);
};

AbstractApp.prototype.onStdout = function(callback) {
  this.on("stdout", callback);
};

AbstractApp.prototype.onStderr = function(callback) {
  this.on("stderr", callback);
};

module.exports = AbstractApp;
