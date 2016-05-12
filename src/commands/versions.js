"use strict";

var Promise           = require("bluebird");
var CommandResult     = require("../cli/commandResult");

var commands = {
  "nodejs": "node -v",
  "ruby": "ruby -v"
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
  return new Promise(function(resolve) {
    Object.keys(commands).forEach(function(key) {
      var command = commands[key];
      console.log(key, command);
    });
    resolve(new CommandResult(true));
  });
};


module.exports = VersionsCommand;
