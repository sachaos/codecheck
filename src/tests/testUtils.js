"use strict";

var TestRunner      = require("./testRunner");
var MochaTestRunner = require("./mochaTestRunner");
var SbtTestRunner   = require("./sbtTestRunner");

var frameworks = [
  "mocha",
  "sbt"
];

function availableFrameworks() {
  return frameworks;
}

function isTestFramework(str) {
  return frameworks.indexOf(str) !== -1;
}

function createTestRunner(name, args, cwd) {
  switch (name) {
    case "mocha":
      return new MochaTestRunner(args, cwd);
    case "sbt":
      return new SbtTestRunner(args, cwd);
    default:
      var cmd = [name].concat(args).join(" ");
      return new TestRunner(cmd, cwd);
  }
}

module.exports = {
  availableFrameworks: availableFrameworks,
  isTestFramework: isTestFramework,
  createTestRunner: createTestRunner
};