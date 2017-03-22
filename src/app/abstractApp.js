"use strict";

var _                = require("lodash");
var spawn            = require("child_process").spawn;
var exec             = require("child_process").exec;
var EventEmitter     = require('events').EventEmitter;
var LineEventEmitter = require("../utils/lineEventEmitter");
var Promise          = require("bluebird");
var psTree           = require("ps-tree");
var CBuffer          = require("CBuffer");
var shellQuote       = require("../utils/myQuote");
var pusage           = require("pidusage");

const MONITOR_INTERVAL = 2000;

function AbstractApp(cmd, cwd) {
  this.setCommand(cmd);
  this.cwd = cwd;
  this.init();
}

AbstractApp.prototype.init = function() {
  this.emitter = new EventEmitter();
  this.env = null;

  this.exitCode = null;
  this.executed = false;
  this.childProcess = null;
  this._maxCpu = 0;
  this._monitorHandle = 0;

  this._consoleOut = false;
  this._storeStdout = false;
  this._storeStderr = false;
  this._storeStdMax = 1000;
  this._ignoreError = false;
  this._arrayStdout = null;
  this._arrayStderr = null;

  this._doStoreToStdout = this.doStoreToArray.bind(this, "_arrayStdout");
  this._doStoreToStderr = this.doStoreToArray.bind(this, "_arrayStderr");
};

AbstractApp.prototype.setCommand = function(cmd) {
  if (cmd) {
    var array = shellQuote.parse(cmd);
    this.cmd = array.shift();
    this.args = array;
  } else {
    this.cmd = null;
    this.args = [];
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
        ret = ret.concat(args[i]);
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

  this._arrayStdout = new CBuffer(this._storeStdMax);
  this._arrayStderr = new CBuffer(this._storeStdMax);

  var emitter = this.emitter;
  var stdoutBuf = new LineEventEmitter(emitter, "stdout");
  var stderrBuf = new LineEventEmitter(emitter, "stderr");

  var p = spawn(this.cmd, args, options);
  if (this._maxCpu > 0) {
    this._monitorHandle = setInterval(this.monitor.bind(this), MONITOR_INTERVAL);
  }
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
  var ret = new Promise(function(resolve, reject) {
    p.on('close', function(code) {
      self.unmonitor(p.pid);
      stdoutBuf.close();
      stderrBuf.close();

      self.executed = true;
      self.exitCode = code;
      self.childProcess = null;

      emitter.emit("end", code);
      if (self.doClose) {
        self.doClose(code);
      }
      resolve([code, self.stdoutAsArray(), self.stderrAsArray()]);
    });
    p.on("error", function(err) {
      if (!self._ignoreError) {
        console.error("Error: " + self.cmd + " " + args.join(" "));
        console.error(err);
      }
      reject(err);
    });
  });
  self.childProcess = p;
  if (self.doRun) {
    self.doRun(p);
  }
  return ret;
};

AbstractApp.prototype.kill = function(callback) {
  if (this.childProcess) {
    var pid = this.childProcess.pid;
    psTree(pid, function(err, children) {
      exec(
        ['kill', '-9', pid].concat(children.map(function (p) { return p.PID; })).join(" "),
        callback
      );
    });
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

AbstractApp.prototype.storeStdout = function(bStore) {
  return this.doStoreFunc("stdout", bStore);
};

AbstractApp.prototype.storeStderr = function(bStore) {
  return this.doStoreFunc("stderr", bStore);
};

AbstractApp.prototype.storeStdMax = function(n) {
  if (typeof(n) === "number") {
    this._storeStdMax = n;
    return this;
  } else {
    return this._storeStdMax;
  }
};

AbstractApp.prototype.doStoreFunc = function(key, bStore) {
  var self = this;
  var storeKey = key === "stdout" ? "_storeStdout" : "_storeStderr";
  var func     = key === "stdout" ? self._doStoreToStdout : self._doStoreToStderr;
  if (typeof(bStore) === "undefined") {
    return self[storeKey];
  }
  if (bStore === self[storeKey]) {
    return self;
  }
  self[storeKey] = bStore;
  if (bStore) {
    this.emitter.on(key, func);
  } else {
    this.emitter.removeListener(key, func);
  }
  return self;
};

AbstractApp.prototype.ignoreError = function(b) {
  if (typeof(b) === "undefined") {
    return this._ignoreError;
  } else {
    this._ignoreError = b;
    return this;
  }
};

AbstractApp.prototype.doStoreToArray = function(arrayKey, value) {
  if (!this[arrayKey]) {
    this[arrayKey] = new CBuffer(this._storeStdMax);
  }
  this[arrayKey].push(value);
};

AbstractApp.prototype.stdoutAsArray = function() {
  return this._arrayStdout ? this._arrayStdout.toArray() : [];
};

AbstractApp.prototype.stderrAsArray = function() {
  return this._arrayStderr ? this._arrayStderr.toArray() : [];
};

AbstractApp.prototype.setMaxCpu = function(n) {
  if (n >= 0 && n <= 100) {
    this._maxCpu = n;
  }
};

AbstractApp.prototype.monitor = function() {
  if (this.childProcess) {
    console.log("monitor1: ", this.childProcess.pid);
    pusage.stat(this.childProcess.pid, function(err, stat) {
      console.log('Pcpu: %s', stat.cpu);
      console.log('Mem: %s', stat.memory); //those are bytes
    });
    psTree(this.childProcess.pid, function(err, children) {
      children.forEach(function(child) {
        pusage.stat(child.PID, function(err, stat) {
          console.log('Pcpu: %s', stat.cpu);
          console.log('Mem: %s', stat.memory); //those are bytes
        });
      });
    });
  }
};

AbstractApp.prototype.unmonitor = function(pid) {
  if (this._monitorHandle) {
    clearInterval(this._monitorHandle);
    this._monitorHandle = 0;
  }
  pusage.unmonitor(pid);
};

module.exports = AbstractApp;
