"use strict";

var packageJson       = require("../package.json");
var CommandParser     = require("./cli/commandParser");
var CommandRepository = require("./cli/commandRepository");
var API               = require("./api");

var DEFAULT_HOST  = process.env.CODECHECK_HOST || "code-main.herokuapp.com";

function createCommand(args) {
  var Command = CommandRepository.getCommand(args.command);
  if (Command === null) {
    return null;
  }
  var api = null;
  if (CommandRepository.isAPI(args.command)) {
    api = new API(args.options.host || DEFAULT_HOST);
  }
  return new Command(api);
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