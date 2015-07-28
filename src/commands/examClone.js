"use strict";

var fs            = require("fs");
var mkdirp        = require("mkdirp");
// var request       = require("request");
var moment        = require("moment");
var Promise       = require("bluebird");
var CommandResult = require("../commandResult");

var ChallengeCloneCommand = require("./challengeClone");

function ExamCloneCommand(api) {
  this.api = api;
}

ExamCloneCommand.prototype.run = function(args, options) {
  var self = this;
  var id = args[0];
  var since = 0;
  if (options.since) {
    since = moment(options.since).valueOf();
  }

  return new Promise(function(resolve){
    self.cloneExam(id, since, resolve);
  });
};


ExamCloneCommand.prototype.cloneExam = function(examId, since, resolve) {
  var self = this;
  var api = this.api;
  api.examResults(examId, since).then(
    function(response) {
      var dirname = "exam-" + examId;
      mkdirp(dirname, function(err) {
        if (err) {
          resolve(new CommandResult(false, "Can not create directory: " + dirname));
        } else {
          var tasks = [];
          var challengeIds = response.body.result.challengeIds;
          var resultIds = response.body.result.resultIds;
          tasks.push(self.doCloneExam(dirname, challengeIds, resultIds));
          tasks.push(self.saveSettings(dirname, examId));
          Promise.all(tasks).then(function() {
            resolve(new CommandResult(true));
          });
        }
      });
    }, 
    function() {
      resolve(new CommandResult(false, "Fail getExam: " + examId));
    }
  );
};

ExamCloneCommand.prototype.saveSettings = function(dirname, examId) {
  var settings = {
    "examId": examId,
    "lastUpdated": moment().format()
  };
  var data = JSON.stringify(settings, null, "  ");
  return new Promise(function(resolve) {
    fs.writeFile(dirname + "/.codecheck", data, resolve);
  });
};

ExamCloneCommand.prototype.doCloneExam = function(parentDir, challengeIds, resultIds) {
  function getChallengeIndex(challengeId) {
    return challengeIds.indexOf(challengeId) + 1;
  }
  var self = this;
  var challengeClone = new ChallengeCloneCommand(this.api);
  var tasks = resultIds.map(function(resultId) {
    return new Promise(function(resolve) {
      self.api.resultFiles(resultId).then(function(response) {
        var username = response.body.result.username; 
        var challengeId = response.body.result.challengeId;
        var challengeIndex = getChallengeIndex(challengeId);
        var dirname = parentDir + "/" + username + "/challenge" + challengeIndex + "-" + resultId;
        mkdirp(dirname, function(err) {
          if (err) {
            resolve(new CommandResult(false, "Can not create directory: " + dirname));
          } else {
            var tasks = [];
            tasks.push(challengeClone.doCloneChallenge(dirname, response.body.result.files));
            tasks.push(challengeClone.saveSettings(dirname, challengeId, resultId, username));
            Promise.all(tasks).then(function() {
              resolve(new CommandResult(true));
            });
          }
        });
      });
    });
  });
  return Promise.all(tasks);
};

module.exports = ExamCloneCommand;
