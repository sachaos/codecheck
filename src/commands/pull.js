"use strict";

var SigninCommand = require("./signin");
var Promise       = require("bluebird");
var CommandResult = require("../commandResult");
var moment        = require("moment");
var fs            = require("fs");

var CloneChallengeCommand = require("./cloneChallenge");
var CloneExamCommand      = require("./cloneExam");

function PullCommand(api) {
  this.api = api;
}

PullCommand.prototype.usage = function() {
  console.log("Usage: pull");
  console.log("  codecheck pull");
  console.log("Options:");
  console.log("  -u, --user    : username");
  console.log("  -p, --password: password");
};

PullCommand.prototype.checkArgs = function(args) {
  if (args.length > 0) {
    throw "pull command doesn't take arguments.";
  }
};

PullCommand.prototype.run = function(args, options) {
  this.checkArgs(args);

  var self = this;
  return new Promise(function(resolve){
    fs.readFile(".codecheck", function(err, data) {
      if (err) {
        resolve(new CommandResult(false, "Can not read .codecheck file."));
        return;
      }
      var settings = null;
      try {
        settings = JSON.parse(data);
      } catch (e) {
        err = e;
      }
      if (err) {
        resolve(new CommandResult(false, "Can not parse .codecheck file.: " + err));
        return;
      }
      if (!(settings.examId || settings.resultId)) {
        resolve(new CommandResult(false, ".codecheck file is not correct.: " + data));
        return;
      }
      new SigninCommand(self.api).run(null, options).then(
        function() {
          if (settings.examId) {
            var since = moment(settings.lastUpdated).valueOf();
            self.pullExam(settings.examId, since, resolve);
          } else {
            self.pullChallenge(settings.resultId, resolve);
          }
        }, 
        function() {
          resolve(new CommandResult(false, "Fail signin"));
        }
      );
    });
  });
};

PullCommand.prototype.pullExam = function(examId, since, resolve) {
  var self = this;
  var cloneExam = new CloneExamCommand(self.api);
  self.api.examResults(examId, since).then(
    function(response) {
      var tasks = [];
      var challengeIds = response.body.result.challengeIds;
      var resultIds = response.body.result.resultIds;
      tasks.push(cloneExam.doCloneExam(null, challengeIds, resultIds));
      tasks.push(cloneExam.saveSettings(null, examId));
      Promise.all(tasks).then(function() {
        resolve(new CommandResult(true));
      });
    },
    function() {
      resolve(new CommandResult(false, "Fail getExam: " + examId));
    }
  );
};

PullCommand.prototype.pullChallenge = function(resultId, resolve) {
  var self = this;
  var cloneChallenge = new CloneChallengeCommand(self.api);
  self.api.resultFiles(resultId).then(
    function(response) {
      var username = response.body.result.username; 
      var challengeId = response.body.result.challengeId; 
      var files = response.body.result.files; 
      var tasks = [];
      tasks.push(cloneChallenge.doCloneChallenge(null, files));
      tasks.push(cloneChallenge.saveSettings(null, challengeId, resultId, username));
      Promise.all(tasks).then(function() {
        resolve(new CommandResult(true));
      });
    }, 
    function() {
      resolve(new CommandResult(false, "Fail getChallengeResult: " + resultId));
    }
  );
};

module.exports = PullCommand;
