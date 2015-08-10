"use strict";

var Promise       = require("bluebird");
var CommandResult = require("../cli/commandResult");

function ScoreCommand(api) {
  this.api = api;
}

ScoreCommand.prototype.shortHelp = function() {
  return "Mark score to challenge. Internal use only.";
};

ScoreCommand.prototype.usage = function() {
  console.log("Internal use only");
};

ScoreCommand.prototype.internalOnly = true;

ScoreCommand.prototype.checkArgs = function(args) {
  var json = null;
  if (args.length === 1) {
    json = JSON.parse(args);
  }
  if (!json) {
    throw "score command takes json argumentpull command doesn't take arguments.";
  }
  return json;
};

ScoreCommand.prototype.run = function(args) {
  var json = this.checkArgs(args);
  console.log("Score", json);

  return new Promise(function(resolve){
    resolve(new CommandResult(true));
  });
};

module.exports = ScoreCommand;
