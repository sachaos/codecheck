"use strict";

var packageJson   = require("../package.json");
var CommandParser = require("./commandParser");
var CloneCommand  = require("./commands/clone");
var API           = require("./api");

var DEFAULT_HOST  = "localhost:9000";

function createCommand(args) {
  var api = new API(args.options.host || DEFAULT_HOST);
  switch (args.command) {
    case "clone":
      return new CloneCommand(api);
  }
  return null;
}

function start() {
  console.log("codecheck version " + packageJson.version);
  try {
    var args = CommandParser.parse(process.argv.slice(2));

    var command = createCommand(args);
    if (!command) {
      throw "Unknown command: " + args.command;
    } else {
      command.run(args.args, args.options);
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  start: start
};