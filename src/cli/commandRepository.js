"use strict";

var _               = require("lodash");
var CloneCommand    = require("../commands/clone");
var PullCommand     = require("../commands/pull");
var RunCommand      = require("../commands/run");
var ScoreCommand    = require("../commands/score");
var HelpCommand     = require("../commands/help");
var VersionsCommand = require("../commands/versions");

var repo = {
  run: RunCommand,
  score: ScoreCommand,
  clone: CloneCommand,
  pull: PullCommand,
  help: HelpCommand,
  versions: VersionsCommand
};

function CommandRepository() {
  function isCommand(name) {
    return !!repo[name];
  }
  function getCommand(name) {
    var ret = repo[name];
    if (typeof(ret) === "string") {
      return getCommand(ret);
    }
    return ret;
  }
  function getCommandNames() {
    return Object.keys(repo).filter(function(key) {
      return typeof(repo[key]) === "function";
    }).sort();
  }
  function isAPI(name) {
    return name === "clone" || name === "pull";
  }

  _.extend(this, {
    isCommand: isCommand,
    getCommand: getCommand,
    getCommandNames: getCommandNames,
    isAPI: isAPI
  });
}

module.exports = new CommandRepository();