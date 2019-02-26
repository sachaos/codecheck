"use strict";

const fs = require("fs");
const codecheck = require("../../src/codecheck");

describe("TestRunner", function() {
  describe("input = arguments, output = stdout", function() {
    describe("menial-attack - all pass(25/25", function() {
      const settings = Object.assign({
        baseDirectory: "test/test_runner/menial-attack/test",
        language: "en"
      }, require("./menial-attack/test/settings.json"));
      const testcases = require("./menial-attack/test/basic_testcases.json");
      const runner = codecheck.testRunner(settings, "node test/test_runner/menial-attack/solution.js");

      runner.runAll(testcases);
    });
  });
});
