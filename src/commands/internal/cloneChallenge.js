"use strict";

var fs            = require("fs");
var mkdirp        = require("mkdirp");
var request       = require("request");
var moment        = require("moment");
var Promise       = require("bluebird");
var CommandResult = require("../../cli/commandResult");

function CloneChallengeCommand(api) {
  this.api = api;
}

CloneChallengeCommand.prototype.run = function(args) {
  var self = this;
  var id = args[0];

  return new Promise(function(resolve){
    self.cloneChallenge(id, resolve);
  });
};

CloneChallengeCommand.prototype.cloneChallenge = function(resultId, resolve) {
  var self = this;
  var api = this.api;
  api.resultFiles(resultId).then(
    function(response) {
      var username = response.body.result.username; 
      var dirname = username + "-" + resultId;
      mkdirp(dirname, function(err) {
        if (err) {
          resolve(new CommandResult(false, "Can not create directory: " + dirname));
        } else {
          var tasks = [];
          tasks.push(self.doCloneChallenge(dirname, response.body.result.files));
          tasks.push(self.saveSettings(dirname, response.body.result.challengeId, resultId, username));
          Promise.all(tasks).then(function() {
            resolve(new CommandResult(true));
          });
        }
      });
    }, 
    function() {
      resolve(new CommandResult(false, "Fail getChallengeResult: " + resultId));
    }
  );
};

CloneChallengeCommand.prototype.saveSettings = function(dirname, challengeId, resultId, username) {
  var settings = {
    "challengeId": challengeId,
    "resultId": resultId,
    "username": username,
    "lastUpdated": moment().format()
  };
  var data = JSON.stringify(settings, null, "  ");
  return new Promise(function(resolve) {
    var filename = ".codecheck";
    if (dirname) {
      filename = dirname + "/" + filename;
    }
    fs.writeFile(filename, data, resolve);
  });
};

CloneChallengeCommand.prototype.doCloneChallenge = function(dirname, files) {
  function getParentDirectory(filename) {
    var array = filename.split("/");
    array.pop();
    return array.join("/");
  }
  var self = this;
  return new Promise(function(resolve) {
    var tasks = [];
    Object.keys(files).sort().forEach(function(filename) {
      var url = files[filename];
      var fullpath = filename;
      if (dirname) {
        fullpath = dirname + "/" + fullpath;
      }
      tasks.push(new Promise(function(resolve) {
        mkdirp(getParentDirectory(fullpath), function(err) {
          if (err) {
            console.err("Can not create directory: " + getParentDirectory(fullpath));
            resolve(err);
          } else {
            self.download(fullpath, url, resolve);
          }
        });
      }));
    });
    Promise.all(tasks).then(resolve);
  });
};

CloneChallengeCommand.prototype.download = function(filename, url, resolve) {
  var result = null;
  request(url)
    .on('response', function(response) {
      result = {
        status: response.statusCode,
        filename: filename
      };
    })
    .on("end", function() {
      if (result) {
        var prefix = result.status === 200 ? "Success" : "Fail";
        console.log(prefix + " download: " + result.status + ", " + filename);
        resolve(result);
      }
    })
    .on("error", function(err) {
      console.err("Fail download: " + filename + ", " + err);
      resolve(err);
    })
    .pipe(fs.createWriteStream(filename));
};

module.exports = CloneChallengeCommand;
