"use strict";

var TestRunner      = require("./testRunner");
var MochaTestRunner = require("./mochaTestRunner");
var SbtTestRunner   = require("./sbtTestRunner");
var MavenTestRunner = require("./mavenTestRunner");

var frameworks = [
  "mocha",
  "sbt",
  "mvn",
  "maven"
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
    case "maven":
    case "mvn":
      return new MavenTestRunner(args, cwd);
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