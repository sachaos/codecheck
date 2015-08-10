"use strict";

var _             = require("lodash");
var CloneCommand  = require("../commands/clone");
var PullCommand   = require("../commands/pull");
var RunCommand    = require("../commands/run");
var ScoreCommand  = require("../commands/score");
var HelpCommand   = require("../commands/help");

var repo = {
  run: RunCommand,
  score: ScoreCommand,
  clone: CloneCommand,
  pull: PullCommand,
  help: HelpCommand
};

function CommandRepository() {
  function isCommand(name) {
    return !!repo[name];
  }
  function getCommand(name) {
    return repo[name];
  }
  function getCommandNames() {
    return Object.keys(repo).sort();
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