"use strict";

const fs = require("fs");
const codecheck = require("../../src/codecheck");

describe("TestRunner", function() {
  describe("with judge", function() {
    describe("menial-attack - with default judge", function() {
      const settings = Object.assign({
        baseDirectory: "test/test_runner/menial-attack/test",
        language: "ja",
        judge: {
          command: "node test/test_runner/menial-attack/judge.js"
        }
      }, require("./menial-attack/test/settings.json"));
      const testcases = require("./menial-attack/test/basic_testcases.json");
      const runner = codecheck.testRunner(settings, "node test/test_runner/menial-attack/solution.partial.js");

      runner.runAll(testcases);
    });

    describe("menial-attack - with aoj judge", function() {
      const settings = Object.assign({
        baseDirectory: "test/test_runner/menial-attack/test",
        language: "ja",
        judge: {
          command: "node test/test_runner/menial-attack/judge.aoj.js",
          type: "aoj"
        }
      }, require("./menial-attack/test/settings.json"));
      const testcases = require("./menial-attack/test/basic_testcases.json");
      const runner = codecheck.testRunner(settings, "node test/test_runner/menial-attack/solution.partial.js");

      runner.runAll(testcases);
    });
  });
});
