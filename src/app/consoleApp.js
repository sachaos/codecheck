"use strict";

const fs               = require("fs");
const readline         = require("readline");
const AbstractApp      = require("./abstractApp");
const CommandResult    = require("../utils/commandResult");
const CodecheckResult  = require("../utils/codecheckResult");

function ConsoleApp(cmd, cwd) {
  this.init();
  this.setCommand(cmd);
  this.cwd = cwd;

  this._input = [];
  this._expected = [];
  this._inputFile = null;
  this._stdoutFile = null;
  this._stdoutStream = null;
  this._stderrFile = null;
  this._stderrStream = null;
}

ConsoleApp.prototype = new AbstractApp();

ConsoleApp.prototype.input = function() {
  if (arguments.length === 0) {
    return [].concat(this._input);
  }
  this._input = this._input.concat(this.normalizeArgs(arguments));
  return this;
};

ConsoleApp.prototype.inputFile = function() {
  if (arguments.length === 0) {
    return this._inputFile;
  }
  this._inputFile = arguments[0];
  return this;
};

ConsoleApp.prototype.stdoutFile = function() {
  if (arguments.length === 0) {
    return this._stdoutFile;
  }
  this._stdoutFile = arguments[0];
  return this;
};

ConsoleApp.prototype.stderrFile = function() {
  if (arguments.length === 0) {
    return this._stderrFile;
  }
  this._stderrFile = arguments[0];
  return this;
};

ConsoleApp.prototype.clearInput = function() {
  this._input = [];
  this._inputFile = null;
  return this;
};

ConsoleApp.prototype.expected = function() {
  if (arguments.length === 0) {
    return [].concat(this._expected);
  }
  this._expected = this._expected.concat(this.normalizeArgs(arguments));
  return this;
};

ConsoleApp.prototype.doRun = function(process) {
  if (this._stdoutFile) {
    this._stdoutStream = fs.createWriteStream(this._stdoutFile, { flags: "a"});
    this.onStdout(line => {
      if (this._stdoutStream) {
        this._stdoutStream.write(line + "\n")
      }
    });
    this.onEnd(() => {
      if (this._stdoutStream) {
        this._stdoutStream.end();
        this._stdoutStream = null;
      }
    })
  }
  if (this._stderrFile) {
    this._stderrStream = fs.createWriteStream(this._stderrFile, { flags: "a"});
    this.onStderr(line => {
      if (this._stderrStream) {
        this._stderrStream.write(line + "\n")
      }
    });
    this.onEnd(() => {
      if (this._stderrStream) {
        this._stderrStream.end();
        this._stderrStream = null;
      }
    })
  }
  process.stdin.on("error", () => {
      // ignore
  });
  process.stdin.setEncoding("utf-8");
  var values = this.input();
  for (var i=0; i<values.length; i++) {
    var value = values[i];
    process.stdin.write(value + "\n");
  }
  if (!this._inputFile) {
    process.stdin.end();
    return;
  }
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(this._inputFile, "utf8")
    });
    rl.on("line", data => {
      process.stdin.write(data + "\n");
    });
    rl.on("close", () => {
      process.stdin.end();
    });
  } catch (e) {
    console.error(e);
    process.stdin.end();
  }
};

ConsoleApp.prototype.runAndVerify = function(additionalArgs, done) {
  if (typeof(additionalArgs) === "function") {
    done = additionalArgs;
    additionalArgs = null;
  }
  var errors = [];
  var values = this.expected();
  this.onStdout(function(data) {
    if (values.length === 0) {
      errors.push("Expected vlaue is nothing, but output is " + data);
      return;
    }
    var value = values.shift();
    if (value !== data) {
      errors.push("Expected value is " + value + ", but output is " + data);
    }
  });
  this.onEnd(function(code) {
    while (values.length) {
      var value = values.shift();
      errors.push("Expected value is " + value + ", but no output");
    }
    if (code !== 0) {
      errors.push("Expected exit code is 0, but exit code is " + code);
    }
    var result = new CommandResult(errors.length === 0);
    if (errors.length) {
      result = result.withErrors(errors);
    }
    if (done) {
      done(result);
    }
  });
  this.run(additionalArgs);
};

ConsoleApp.prototype.codecheck = function() {
  return this.run.apply(this, arguments).then(function(args) {
    const code = args[0];
    const stdout = args[1];
    const stderr = args[2];
    console.log("" /* to avoid code printed as `xxok ~~~`; code will fail on detecting test cases */);
    return new CodecheckResult(code, stdout, stderr);
  });
};

module.exports = ConsoleApp;