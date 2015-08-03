"use strict";

var Promise           = require("bluebird");
var CommandResult     = require("../cli/commandResult");

function HelpCommand() {
}

HelpCommand.prototype.getCommandRepository = function() {
  //To avoid circular reference
  return require("../cli/commandRepository");
};

HelpCommand.prototype.shortHelp = function() {
  return "Show help";
};

HelpCommand.prototype.usage = function() {
  var self = this;

  console.log("codecheck");
  console.log("  - run several kinds of test framework with one commmand.");
  console.log("  - command line client of codecheck.io");
  console.log("Available commands:");
  self.getCommandRepository().getCommandNames().forEach(function(name) {
    var Command = self.getCommandRepository().getCommand(name);
    var shortHelp = new Command().shortHelp();
    console.log("  " + name + ": " + shortHelp);
  });
};

HelpCommand.prototype.run = function(args) {
  var self = this;
  return new Promise(function(resolve) {
    var Command = null;
    if (args.length > 0) {
      Command = self.getCommandRepository().getCommand(args[0]);
    }
    if (Command) {
      new Command().usage();
    } else {
      self.usage();
    }
    resolve(new CommandResult(true));
  });
};


module.exports = HelpCommand;
