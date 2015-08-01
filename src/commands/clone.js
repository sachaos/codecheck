"use strict";

var SigninCommand = require("./internal/signin");
var Promise       = require("bluebird");
var CommandResult = require("../cli/commandResult");

var CloneChallengeCommand = require("./internal/cloneChallenge");
var CloneExamCommand      = require("./internal/cloneExam");

function CloneCommand(api) {
  this.api = api;
}

CloneCommand.prototype.usage = function() {
  console.log("Usage: clone");
  console.log("  codecheck clone <ResultId>|<ExamId>");
  console.log("Arguments:");
  console.log("  ResultId: Challenge result id to download.");
  console.log("  ExamId  : Exam id to download. Specify with --exam option.");
  console.log("Options:");
  console.log("  -u, --user    : username");
  console.log("  -p, --password: password");
  console.log("  --exam        : Clone exam");
};

CloneCommand.prototype.checkArgs = function(args) {
  if (args.length === 0) {
    throw "ChallengeId or ExamId is required";
  } else if (args.length > 1) {
    throw "Too many args" + JSON.stringify(args);
  }
};

CloneCommand.prototype.run = function(args, options) {
  this.checkArgs(args);

  var self = this;
  return new Promise(function(resolve){
    new SigninCommand(self.api).run(null, options).then(
      function() {
        if (options.exam) {
          new CloneExamCommand(self.api).run(args, options).then(resolve);
        } else {
          new CloneChallengeCommand(self.api).run(args, options).then(resolve);
        }
      }, 
      function() {
        resolve(new CommandResult(false, "Fail signin"));
      }
    );
  });
};

module.exports = CloneCommand;
