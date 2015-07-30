"use strict";

var AbstractApp      = require("./abstractApp");
var EventEmitter     = require('events').EventEmitter;
var request          = require("request");

function WebApp(port, cmd, args, cwd) {
  this.port = port;
  this.cmd = cmd;
  this.args = this.normalizeArgs(args);
  this.cwd = cwd;

  this._testUrl = null;
  this._testPath = "/";
  this._readyCheckInterval = 2000;

  this.emitter = new EventEmitter();
}

WebApp.prototype = new AbstractApp();

WebApp.prototype.ready = function(callback) {
  this.on("ready", callback);
};

WebApp.prototype.testUrl = function() {
  if (arguments.length === 0) {
    if (this._testUrl) {
      return this._testUrl;
    }
    var port = this.port === 80 ? "" : ":" + this.port;
    return "http://localhost" + port + this.testPath;
  } else {
    this._testUrl = arguments[0];
    return this;
  }
};

WebApp.prototype.readyCheckInterval = function() {
  if (arguments.length === 0) {
    return this._readyCheckInterval;
  } else {
    this._readyCheckInterval = arguments[0];
    return this;
  }
};

WebApp.prototype.doClose = function(code) {
  if (this._consoleOut) {
    process.stdout.write("codecheck: Finish web app with code " + code + "\n");
  }
};

WebApp.prototype.doRun = function() {
  function checkReady() {
    var testUrl = self.testUrl();
    request(testUrl, function(err, response) {
      if (!err && response.statusCode >= 200 && response.statusCode < 300) {
        self.emitter.emit("ready");
      } else {
        setTimeout(checkReady, self._readyCheckInterval);
      }
    });
  }
  var self = this;
  setTimeout(checkReady, this._readyCheckInterval);
};

module.exports = WebApp;