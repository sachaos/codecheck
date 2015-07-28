"use strict";

var SigninCommand = require("./signin");
var Promise       = require("bluebird");
var CommandResult = require("../commandResult");

var ChallengeCloneCommand = require("./challengeClone");

function CloneCommand(api) {
  this.api = api;
}

CloneCommand.prototype.usage = function() {
  console.log("Usage: clone");
  console.log("  codecheck clone <ChallengeId>|<ExamId>");
  console.log("Options:");
  console.log("  -u, --user    : username");
  console.log("  -p, --password: password");
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
          resolve(new CommandResult(false, "Not implemented yet"));
        } else {
          new ChallengeCloneCommand(self.api).run(args, options).then(resolve);
        }
      }, 
      function() {
        resolve(new CommandResult(false, "Fail signin"));
      }
    );
  });
};

module.exports = CloneCommand;
