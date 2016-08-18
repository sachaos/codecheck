"use strict";

var Promise       = require("bluebird");
var CommandResult = require("../cli/commandResult");

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

  var resultId = args[0];
  var d1= this.api.getResultToken(resultId);
  var d2 = this.api.resultFiles(resultId);

  return Promise.all([d1, d2]).then((results) => {
    var token = results[0].body.result;
    var files = results[1].body.result.files; 
    console.log("test1", token);
    console.log("test2", files);

    return new Promise((resolve) => {
      resolve(new CommandResult(true, "ToDo implement test-result"));
    });
  },
  () => {
    return new Promise((resolve) => {
      resolve(new CommandResult(false, "Result not found"));
    });
  });

};

module.exports = TestResultCommand;
