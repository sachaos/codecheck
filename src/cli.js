"use strict";

var packageJson   = require("../package.json");
var CommandParser = require("./cli/commandParser");
var CloneCommand  = require("./commands/clone");
var PullCommand   = require("./commands/pull");
var RunCommand    = require("./commands/run");
var API           = require("./api");

var DEFAULT_HOST  = "localhost:9000";

function createCommand(args) {
  var api = new API(args.options.host || DEFAULT_HOST);
  switch (args.command) {
    case "clone":
      return new CloneCommand(api);
    case "pull":
      return new PullCommand(api);
    case "run":
      return new RunCommand();
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
      try {
        command.run(args.args, args.options).then(function(result) {
          if (result.message) {
            console.log(result.message);
          }
          process.exit(result.exitCode);
        });
      } catch (e) {
        console.log(e);
        if (e.stack) {
          console.log(e.stack);
        }
        command.usage();
      }
    }
  } catch (e) {
    console.log(e);
    if (e.stack) {
      console.log(e.stack);
    }
    process.exit(1);
  }
}

module.exports = {
  start: start
};