"use strict";
const fs = require('fs');
const chalk = require('chalk');
const CommandResult = require("../cli/commandResult");

function out(type, message) {
  if (arguments.length < 2) {
    message = type;
    type = "info";
  }
  let prefix = "";
  switch (type) {
    case "err":
    case "error":
      prefix = chalk.red("error");
      break;
    case "warn":
    case "warning":
      prefix = chalk.yellow("warn");
      break;
    case "success":
      prefix = chalk.green("success");
      break;
    case "info":
    default:
      prefix = chalk.blue("info");
      break;
  }
  return `[${prefix}] ${message}`;
}

class ValidateCommand {
  constructor() {
    this._cwd = process.cwd();
  }

  shortHelp() {
    return "Validate if the challenges are valid or not";
  }

  usage() {
    console.log("Usage: validate");
    console.log("  codecheck validate");
  }

  run () {
    return new Promise((resolve, reject) => {
      fs.readFile(`${this._cwd}/challenge.json`, {encoding: 'utf8'}, (err, content) => {
        if (err) {
          return reject(err);
        }
        return resolve(content);
      });
    }).then(content => {
      const json = JSON.parse(content);
      if (!json.editable || json.editable.filter(v => !!v).length === 0) {
        return new CommandResult(false, out("error", "No editable files contained!!"));
      }
      if (json.cli && json.cli.filter(v => !!v).length === 0) {
        return new CommandResult(false, out("error", "No available language!!"));
      }
      if (json.cli && !json.test) {
        return new CommandResult(false, out("error", "You must have test command for cli test"));
      }
      if (!json.cli && !json.test) {
        return new CommandResult(true, out("warn", "No `test` command; make sure you really don't need it"));
      }
      return new CommandResult(true, json);
    }).catch(err => {
      console.error(err);
      return err;
    });
  }
}

module.exports = ValidateCommand;
