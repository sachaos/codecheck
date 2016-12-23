"use strict";

const CloneCommand       = require("../commands/clone");
const PullCommand        = require("../commands/pull");
const RunCommand         = require("../commands/run");
const ScoreCommand       = require("../commands/score");
const HelpCommand        = require("../commands/help");
const VersionsCommand    = require("../commands/versions");
const TestResultCommand  = require("../commands/testResult");

const repo = {
  run: RunCommand,
  score: ScoreCommand,
  clone: CloneCommand,
  pull: PullCommand,
  help: HelpCommand,
  versions: VersionsCommand,
  "test-result": TestResultCommand
};

function CommandRepository() {
  function isCommand(name) {
    return !!repo[name];
  }
  function getCommand(name) {
    const ret = repo[name];
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
    return name === "clone" || name === "pull" || name === "test-result";
  }

  Object.assign(this, {
    isCommand: isCommand,
    getCommand: getCommand,
    getCommandNames: getCommandNames,
    isAPI: isAPI
  });
}

module.exports = new CommandRepository();