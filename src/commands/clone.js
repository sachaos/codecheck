"use strict";

var SigninCommand = require("./signin");
var fs            = require("fs");
var mkdirp        = require("mkdirp");
var request       = require("request");
var moment        = require("moment");

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
      console.log("Not implemented yet");
    } else {
      self.cloneChallenge(id);
    }
  });
};

CloneCommand.prototype.cloneChallenge = function(resultId) {
  var self = this;
  var api = this.api;
  api.resultFiles(resultId).then(function(response) {
    var username = response.body.result.username; 
    var dirname = username + "-" + resultId;
    mkdirp(dirname, function(err) {
      if (err) {
        console.error("Can not create directory: " + dirname);
      } else {
        self.doCloneChallenge(dirname, response.body.result.files);
        self.saveSettings(dirname, resultId, username);
      }
    });
  });
};

CloneCommand.prototype.saveSettings = function(dirname, resultId, username) {
  var settings = {
    "id": resultId,
    "username": username,
    "lastUpdated": moment().format()
  };
  var data = JSON.stringify(settings, null, "  ");
  fs.writeFile(dirname + "/.codecheck", data);
};

CloneCommand.prototype.doCloneChallenge = function(dirname, files) {
  function getParentDirectory(filename) {
    var array = filename.split("/");
    array.pop();
    return array.join("/");
  }
  var self = this;
  Object.keys(files).sort().forEach(function(filename) {
    var url = files[filename];
    var fullname = dirname + "/" + filename;
    mkdirp(getParentDirectory(fullname), function(err) {
      if (err) {
        console.err("Can not create directory: " + getParentDirectory(fullname));
      } else {
        self.download(fullname, url);
      }
    });
  });

};

CloneCommand.prototype.download = function(filename, url) {
  request(url)
    .on('response', function(response) {
      console.log("Success download: " + response.statusCode + ", " + filename);
    })
    .on("error", function(err) {
      console.err("Fail download: " + filename + ", " + err);
    })
    .pipe(fs.createWriteStream(filename));
};

module.exports = CloneCommand;
