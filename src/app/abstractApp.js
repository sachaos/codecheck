"use strict";

var _                = require("lodash");
var spawn            = require("child_process").spawn;
var EventEmitter     = require('events').EventEmitter;
var LineEventEmitter = require("../utils/lineEventEmitter");

function AbstractApp(cmd, cwd) {
  this.setCommand(cmd);
  this.cwd = cwd;
  this.env = null;

  this.exitCode = null;
  this.executed = false;
  this.childProcess = null;

  this._consoleOut = false;
  this._storeStdout = false;
  this._storeStderr = false;
  this._arrayStdout = [];
  this._arrayStderr = [];
}

AbstractApp.prototype.init = function() {
  this.emitter = new EventEmitter();
};

AbstractApp.prototype.setCommand = function(cmd) {
  if (cmd) {
    var array = cmd.split(" ");
    this.cmd = array.shift();
    this.args = array;
  }
};

AbstractApp.prototype.setEnvironment = function(env) {
  if (this.env) {
    this.env = _.extend(this.env, env);
  } else {
    this.env = env;
  }
};

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

AbstractApp.prototype.run = function() {
  var self = this;
  var args = this.args.concat(this.normalizeArgs(arguments));
  var env = _.extend({}, process.env, this.env);
  var options = {
    env: env
  };
  if (this.cwd) {
    options.cwd = this.cwd;
  }

  this._arrayStdout = [];
  this._arrayStderr = [];

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
  p.on("error", function(err) {
    console.error("Error: " + self.cmd + " " + args.join(" "));
    console.error(err);
    throw err;
  });
  self.childProcess = p;
  if (self.doRun) {
    self.doRun(p);
  }
};

AbstractApp.prototype.kill = function(signal) {
  if (this._childProcess) {
    this._childProcess.kill(signal);
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

AbstractApp.prototype.storeStdout = function() {
  function doStore(value) {
    if (!self._arrayStdout) {
      self._arrayStdout = [];
    }
    self._arrayStdout.push(value);
  }
  var self = this;
  if (arguments.length === 0) {
    return this._storeStdout;
  }
  if (arguments[0] === true) {
    this._storeStdout = true;
    this.emitter.on("stdout", doStore);
  } else {
    this._storeStdout = false;
    this.emitter.off("stdout", doStore);
  }
  return self;
};

AbstractApp.prototype.storeStderr = function() {
  function doStore(value) {
    if (!self._arrayStderr) {
      self._arrayStderr = [];
    }
    self._arrayStderr.push(value);
  }
  var self = this;
  if (arguments.length === 0) {
    return this._storeStderr;
  }
  if (arguments[0] === true) {
    this._storeStderr = true;
    this.emitter.on("stderr", doStore);
  } else {
    this._storeStderr = false;
    this.emitter.off("stderr", doStore);
  }
  return self;
};

AbstractApp.prototype.stdoutAsArray = function() {
  return [].concat(this._arrayStdout);
}

AbstractApp.prototype.stderrAsArray = function() {
  return [].concat(this._arrayStderr);
}

module.exports = AbstractApp;
