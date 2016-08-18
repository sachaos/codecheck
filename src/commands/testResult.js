"use strict";

var SigninCommand = require("./internal/signin");
var Promise       = require("bluebird");
var CommandResult = require("../cli/commandResult");

var CloneChallengeCommand = require("./internal/cloneChallenge");
var CloneExamCommand      = require("./internal/cloneExam");

function TestResultCommand(api) {
  this.api = api;
}

TestResultCommand.prototype.shortHelp = function() {
  return "Run challenge on codecheck test server.";
};

TestResultCommand.prototype.usage = function() {
  console.log("Usage: test-result");
  console.log("  codecheck test-result <ResultId>");
  console.log("Arguments:");
  console.log("  ResultId: Challenge result id to run test.");
  console.log("Options:");
  console.log("  -u, --user    : username");
  console.log("  -p, --password: password");
};

TestResultCommand.prototype.checkArgs = function(args) {
  if (args.length === 0) {
    throw "ChallengeId is required";
  } else if (args.length > 1) {
    throw "Too many args" + JSON.stringify(args);
  }
};


TestResultCommand.prototype.run = function(args, options) {
  this.checkArgs(args);
  return new Promise(function(resolve){
    resolve(new CommandResult(true, "ToDo implement test-result"));
  });
};

module.exports = TestResultCommand;
