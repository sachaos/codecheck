"use strict";

var TestRunner      = require("./testRunner");
var MochaTestRunner = require("./mochaTestRunner");
var ScalaTestRunner = require("./scalaTestRunner");

var frameworks = [
  "mocha",
  "scalatest"
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
    case "scalatest":
      return new ScalaTestRunner(args, cwd);
    default:
      return new TestRunner(name, args, cwd);
  }
}

module.exports = {
  availableFrameworks: availableFrameworks,
  isTestFramework: isTestFramework,
  createTestRunner: createTestRunner
};