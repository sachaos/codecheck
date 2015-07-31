"use strict";

var Promise       = require("bluebird");
var CommandResult = require("../commandResult");
var fs            = require("fs");
var TestUtils     = require("../tests/testUtils");
var ConsoleApp    = require("../app/consoleApp");
var CodecheckYaml = require("../codecheckYaml");

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
  var config = this.getConfig(dir);
  if (!name) {
    name = config.getTestCommand();
    if (name) {
      var configArgs = name.split(" ");
      name = configArgs.shift();
      args = configArgs.concat(args);
    }
  }
  if (!name) {
    resolve(new CommandResult(false, "Could not decide test framework"));
    return;
  }
  this.doRun(name, args, dir, config, resolve);
};

RunCommand.prototype.getConfig = function(dir) {
  var config = new CodecheckYaml();
  var filename = "codecheck.yml";
  if (dir) {
    filename = dir + "/" + filename;
  }
  if (fs.existsSync(filename)) {
    config.load(filename);
  }
  return config;
};

RunCommand.prototype.doBuild = function(config, dir, callback) {
  function build() {
    var next = commands.shift();
    if (next) {
      var start = new Date().getTime();
      console.log("Start build: " + next);
      var app = new ConsoleApp(next, dir);
      app.setEnvironment(config.getEnvironment());
      app.onEnd(function(code) {
        if (code !== 0) {
          callback(new CommandResult(false, "Fail build: " + next).withExitCode(code));
        } else {
          console.log("Finish build: " + next + " (" + (new Date().getTime() - start) + "ms)");
          build();
        }
      });
      app.run();
    } else {
      callback();
    }
  }
  var commands = config.getBuildCommands() || [];
  build();
};

RunCommand.prototype.doWebApp = function(webapp, callback) {
  var start = new Date().getTime();
  console.log("Start webapp: " + webapp.getCommandLine());
  webapp.ready(function() {
    console.log("Ready webapp: " + webapp.getCommandLine() + " (" + (new Date().getTime() - start) + "ms)");
    callback();
  });
  webapp.run();
};

RunCommand.prototype.doRun = function(name, args, dir, config, resolve) {
  function afterWebApp(result) {
    if (result) {
      resolve(result);
    } else {
      var runner = TestUtils.createTestRunner(name, args, dir);
      runner.setEnvironment(config.getEnvironment());
      runner.consoleOut(true);
      runner.onEnd(function(code) {
        if (webapp) {
          webapp.kill();
        }
        resolve(new CommandResult(true).withExitCode(code));
      });
      runner.run();
    }
  }
  function afterBuild(result) {
    if (result) {
      resolve(result);
    } else {
      if (config.hasWebApp()) {
        webapp = config.createWebApp();
        self.doWebApp(webapp, afterWebApp);
      } else {
        afterWebApp();
      }
    }
  }
  var self = this;
  var webapp = null;
  setTimeout(function() {
    resolve(new CommandResult(false, "Timeout").withExitCode(1));
  }, config.getTimeout() * 1000);
  this.doBuild(config, dir, afterBuild);
};

module.exports = RunCommand;
