"use strict";

var yaml   = require('js-yaml');
var fs     = require('fs');
var WebApp = require("./app/webApp");

function CodecheckYaml(data) {
  this.data = data;
}

CodecheckYaml.prototype.load = function(filename) {
  try {
    this.data = yaml.safeLoad(fs.readFileSync(filename, 'utf-8'));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

CodecheckYaml.prototype.hasWebApp = function() {
  if (this.data && this.data.web) {
    var web = this.data.web;
    return web.command && web.port;
  }
  return false;
};

CodecheckYaml.prototype.getWebAppCommand = function() {
  return this.hasWebApp() ? this.data.web.command : null;
};

CodecheckYaml.prototype.getWebAppPort = function() {
  return this.hasWebApp() ? this.data.web.port : null;
};

CodecheckYaml.prototype.getWebAppConsole = function() {
  return this.hasWebApp() ? this.data.web.console || false : false;
};

CodecheckYaml.prototype.getWebAppDirectory = function() {
  return this.hasWebApp() ? this.data.web.dir || null : null;
};

CodecheckYaml.prototype.createWebApp = function() {
  var args = this.getWebAppCommand().split(" ");
  var cmd = args.shift();
  var port = this.getWebAppPort();
  var dir = this.getWebAppDirectory();
  var consoleOut = this.getWebAppConsole();

  var app = new WebApp(port, cmd, args, dir);
  app.consoleOut(consoleOut);
  return app;
};

CodecheckYaml.prototype.getAsArray = function(key) {
  if (this.data && this.data[key]) {
    var value = this.data[key];
    return Array.isArray(value) ? value : [value];
  }
  return null;
};

CodecheckYaml.prototype.getBuildCommands = function() {
  return this.getAsArray("build");
};

CodecheckYaml.prototype.getTestCommands = function() {
  return this.getAsArray("test");
};

CodecheckYaml.prototype.getTestCommand = function() {
  var array = this.getAsArray("test");
  return array && array.length ? array[0] : null;
};

module.exports = CodecheckYaml;
