"use strict";

var SigninCommand = require("./signin");

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
  var id = args[0];
  new SigninCommand(this.api).run(null, options).then(function() {
    if (options.exam) {
      self.test(id);
    } else {
      self.test(id);
    }
  });
};

CloneCommand.prototype.test = function(challengeId) {
  var api = this.api;
  api.getChallenge(challengeId).then(function(data) {
    var response = data[0];
    console.log("getChallenge", challengeId, response.statusCode);
    console.log(response.body);
  });
};

module.exports = CloneCommand;
