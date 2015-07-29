"use strict";

var Promise       = require("bluebird");
var CommandResult = require("../commandResult");
var fs            = require("fs");
var TestUtils     = require("../tests/testUtils");

function RunCommand() {
}

RunCommand.prototype.usage = function() {
  console.log("Usage: run");
  console.log("  codecheck run [TestFramework] [Directory] [Options]*");
  console.log("Arguments:");
  console.log("  TestFramework: Option. The name of test framework.");
  console.log("                 Available frameworks: " + TestUtils.availableFrameworks().join(", "));
  console.log("                 If omiited, the value of test in challenge.json");
  console.log("  Directory    : Option. Base directory to run test.");
  console.log("  Options      : The arguments pass to TestFramework.");
};

RunCommand.prototype.run = function(args) {
  var self = this;
  return new Promise(function(resolve) {
    self.prepare(args, resolve);
  });
};

RunCommand.prototype.prepare = function(args, resolve) {
  var name = null;
  if (args.length > 0 && TestUtils.isTestFramework(args[0])) {
    name = args.shift();
  }
  var dir = null;
  if (args.length > 0) {
    try {
      var stat = fs.statSync(args[0]);
      if (stat && stat.isDirectory()) {
        dir = args.shift();
      }
    } catch (e) {
    }
  }
  if (!name) {
    var filename = "challenge.json";
    if (dir) {
      filename = dir + "/" + filename;
    }
    try {
      var settings = JSON.parse(fs.readFileSync(filename));
      if (settings && settings.test) {
        var testArgs = settings.test.split(" ");
        name = testArgs.shift();
        if (testArgs.length) {
          args = testArgs.concat(args);
        }
      }
    } catch (e) {
    }
  }
  if (!name) {
    resolve(new CommandResult(false, "Could not decide test framework"));
    return;
  }
  this.doRun(name, args, dir, resolve);
};

RunCommand.prototype.doRun = function(name, args, dir, resolve) {
  var runner = TestUtils.createTestRunner(name, args, dir);
  runner.consoleOut(true);
  runner.onEnd(function(code) {
    resolve(new CommandResult(true).withExitCode(code));
  });
  runner.run();
};

module.exports = RunCommand;
