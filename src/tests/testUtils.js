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
      var runner = new TestRunner(cmd, cwd);
      runner.onStdout(function(data) {
        commonTestCounter(runner, data);
      });
      return runner;
  }
}

function commonTestCounter(runner, data) {
  //Ruby tes-tunit
  //2 tests, 2 assertions, 0 failures, 0 errors, 0 pendings, 0 omissions, 0 notifications
  function rubyTestUnit() {
    var testsIndex = array.indexOf("tests,");
    var failuresIndex = array.indexOf("failures,");
    var errorsIndex = array.indexOf("errors,");
    if (testsIndex !== -1 && failuresIndex !== -1 && errorsIndex !== -1) {
      runner.failureCount = parseInt(array[failuresIndex - 1]) + parseInt(array[errorsIndex - 1]);
      runner.successCount = parseInt(array[testsIndex - 1]) - runner.failureCount;
      return true;
    }
    return false;
  }
  var array = data.split(" ");
  if (rubyTestUnit()) { return;}
}

module.exports = {
  availableFrameworks: availableFrameworks,
  isTestFramework: isTestFramework,
  createTestRunner: createTestRunner
};