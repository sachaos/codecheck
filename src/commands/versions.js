"use strict";

var Promise           = require("bluebird");
var CommandResult     = require("../cli/commandResult");
var ConsoleApp        = require("../app/consoleApp");

var commands = {
  "NodeJS": "node -v",
  "Ruby": "ruby -v",
  "Java": "javaxxx -v",

}

function VersionsCommand() {
}

VersionsCommand.prototype.getCommandRepository = function() {
};

VersionsCommand.prototype.shortHelp = function() {
  return "Show versions";
};

VersionsCommand.prototype.usage = function() {
  console.log("Show versions");
  console.log("  codecheck versions");
  console.log("  codecheck -v");
};

VersionsCommand.prototype.run = function(args) {
  return Promise.reduce(Object.keys(commands), function(supported, name) {
    var command = commands[name];
    var app = new ConsoleApp(command).storeStdout(true).storeStderr(true).ignoreError(true);
    console.log("[" + name + "]");
    return app.run().spread(function(code, stdout, stderr) {
      if (stdout) stdout.forEach(v => console.log(v));
      if (stderr) stderr.forEach(v => console.log(v));
      return supported + 1;
    }).catch(function() {
      console.log("Not supported");
      return supported;
    });
  }, 0).then(function(supported) {
    console.log(supported + " languages are supported.");
    return new CommandResult(true);
  })
};


module.exports = VersionsCommand;
