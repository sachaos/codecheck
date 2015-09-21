"use strict";

var TestRunner      = require("./testRunner");
var MochaTestRunner = require("./mochaTestRunner");
var SbtTestRunner   = require("./sbtTestRunner");
var MavenTestRunner = require("./mavenTestRunner");
var RSpecTestRunner = require("./rspecTestRunner");
var NoseTestRunner  = require("./noseTestRunner");
var CabalTestRunner = require("./cabalTestRunner");
var PhpUnitTestRunner = require("./phpUnitTestRunner");

var frameworks = [
  "mocha",
  "sbt",
  "mvn",
  "maven",
  "rspec",
  "nodestests",
  "cabal",
  "phpunit"
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
    case "rspec":
      return new RSpecTestRunner(args, cwd);
    case "nosetests":
      return new NoseTestRunner(args, cwd);
    case "cabal":
      return new CabalTestRunner(args, cwd);
    case "phpunit":
      return new PhpUnitTestRunner(args, cwd);
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
    var regex = /^(\d+) tests,.*, (\d+) failures,.* (\d+) errors,.*/;
    var match = data.match(regex);
    if (match) {
      runner.failureCount = parseInt(match[2]) + parseInt(match[3]);
      runner.successCount = parseInt(match[1]) - runner.failureCount;
      return true;
    }
    return false;
  }
  rubyTestUnit();
}

module.exports = {
  availableFrameworks: availableFrameworks,
  isTestFramework: isTestFramework,
  createTestRunner: createTestRunner
};