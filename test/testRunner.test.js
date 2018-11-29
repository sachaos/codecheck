"use strict";

const Settings = require("../src/test_runner/settings");
const TestRunner = require("../src/test_runner/testRunner");
const Testcase = require("../src/test_runner/testcase");

describe("TestRunner", function() {
  describe("menial-attack - all pass", function() {
    const settings = new Settings(require("./test_runner/menial-attack/test/settings.json"));
    const testcases = Testcase.load("test/test_runner/menial-attack/test/basic_testcases.json", "test/test_runner/menial-attack/test", "ja");
    const runner = new TestRunner(settings, "node test/test_runner/menial-attack/solution.js", "ja");

    runner.runAll(testcases);
  });

  describe("menial-attack - partial pass", function() {
    const settings = new Settings(require("./test_runner/menial-attack/test/settings.json"));
    const testcases = Testcase.load("test/test_runner/menial-attack/test/basic_testcases.json", "test/test_runner/menial-attack/test", "ja");
    const runner = new TestRunner(settings, "node test/test_runner/menial-attack/solution.partial.js", "ja");

    runner.runAll(testcases);
  });
});
