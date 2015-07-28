"use strict";

var SigninCommand = require("./signin");
var fs            = require("fs");
var mkdirp        = require("mkdirp");
var request       = require("request");
var moment        = require("moment");
var Promise       = require("bluebird");
var CommandResult = require("../commandResult");

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
  return new Promise(function(resolve){
    new SigninCommand(self.api).run(null, options).then(
      function() {
        if (options.exam) {
          resolve(new CommandResult(false, "Not implemented yet"));
        } else {
          self.cloneChallenge(id, resolve);
        }
      }, 
      function() {
        resolve(new CommandResult(false, "Fail signin"));
      }
    );
  });
};

CloneCommand.prototype.cloneChallenge = function(resultId, resolve) {
  var self = this;
  var api = this.api;
  api.resultFiles(resultId).then(
    function(response) {
      var username = response.body.result.username; 
      var dirname = username + "-" + resultId;
      mkdirp(dirname, function(err) {
        var tasks = [];
        if (err) {
          console.error("Can not create directory: " + dirname);
        } else {
          tasks.push(self.doCloneChallenge(dirname, response.body.result.files));
          tasks.push(self.saveSettings(dirname, resultId, username));
        }
        Promise.all(tasks).then(function() {
          resolve(new CommandResult(true));
        });
      });
    }, 
    function() {
      resolve(new CommandResult(false, "Fail getChallengeResult: " + resultId));
    }
  );
};

CloneCommand.prototype.saveSettings = function(dirname, resultId, username) {
  var settings = {
    "id": resultId,
    "username": username,
    "lastUpdated": moment().format()
  };
  var data = JSON.stringify(settings, null, "  ");
  return new Promise(function(resolve) {
    fs.writeFile(dirname + "/.codecheck", data, resolve);
  });
};

CloneCommand.prototype.doCloneChallenge = function(dirname, files) {
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
      var fullpath = dirname + "/" + filename;
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

CloneCommand.prototype.download = function(filename, url, resolve) {
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

module.exports = CloneCommand;
