"use strict";

function isCommand(str) {
  var commands = [
    "clone",
    "pull",
    "run",
    "help"
  ];
  return commands.indexOf(str) !== -1;
}

function convertShortOption(str) {
  var options = {
    "-e": "exam",
    "-p": "password",
    "-u": "username",
    "-h": "host"
  };
  return options[str];
}

function parseOptions(ret, args) {
  for (var i=0; i<args.length; i++) {
    var str = args[i];
    var option = null;
    if (str.indexOf("--") === 0) {
      option = str.substring(2);
    } else if (str.indexOf("-") === 0) {
      option = convertShortOption(str);
      if (!option) {
        throw "Invalid optoin: " + str;
      }
    }
    if (option) {
      var value = true;
      if (i+1 < args.length && args[i+1].indexOf("-") !== 0) {
        value = args[i+1];
        i++;
      }
      ret.options[option] = value;
    } else {
      ret.args.push(str);
    }
  }
}

function parse(args) {
  var ret = {
    "command": null,
    "args": [],
    "options": {}
  };
  if (args.length === 0) {
    ret.command = "run";
    return ret;
  }
  var command = args[0];
  if (isCommand(command)) {
    args = args.slice(1);
  } else {
    command = "run";
  }
  ret.command = command;
  parseOptions(ret, args);
  return ret;
}

module.exports = {
  parse: parse
};