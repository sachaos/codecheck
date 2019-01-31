"use strict";

const fs = require("fs");
const codecheck = require("../../src/codecheck");

describe("TestRunner", function() {
  describe("input = arguments, output = stdout", function() {
    describe("menial-attack - all pass", function() {
      const settings = Object.assign({
        baseDirectory: "test/test_runner/menial-attack/test",
        language: "ja"
      }, require("./menial-attack/test/settings.json"));
      const testcases = require("./menial-attack/test/basic_testcases.json");
      const runner = codecheck.testRunner(settings, "node test/test_runner/menial-attack/solution.js");

      runner.runAll(testcases);
    });

    describe("menial-attack - partial pass", function() {
      const settings = Object.assign({
        baseDirectory: "test/test_runner/menial-attack/test",
        language: "ja"
      }, require("./menial-attack/test/settings.json"));
      const testcases = require("./menial-attack/test/basic_testcases.json");
      const runner = codecheck.testRunner(settings, "node test/test_runner/menial-attack/solution.partial.js");

      runner.runAll(testcases);
    });
  });

  describe("input = stdin, output = stdout", function() {
    describe("menial-attack - all pass", function() {
      const settings = Object.assign({
        baseDirectory: "test/test_runner/menial-attack/test",
        language: "ja"
      }, require("./menial-attack/test/settings.stdin.json"));
      const testcases = require("./menial-attack/test/basic_testcases.json");
      const runner = codecheck.testRunner(settings, "node test/test_runner/menial-attack/solution.stdin.js");

      runner.runAll(testcases);
    });

  });

  describe("input = file, output = file", function() {
    describe("menial-attack - all pass", function() {
      const settings = Object.assign({
        baseDirectory: "test/test_runner/menial-attack/test",
        language: "ja"
      }, require("./menial-attack/test/settings.file.json"));
      const testcases = require("./menial-attack/test/basic_testcases.json");
      const runner = codecheck.testRunner(settings, "node test/test_runner/menial-attack/solution.file.js");

      runner.runAll(testcases);
    });

  });

  describe("with judge", function() {
    describe("menial-attack - with judge", function() {
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

  });

  describe("with raw", function() {
    describe("menial-attack - with raw", function() {
      const settings = Object.assign({
        language: "ja"
      }, require("./menial-attack/test/settings.stdin.json"));
      settings.input = {
        type: "arguments",
        source: "raw"
      };
      settings.output = {
        type: "stdout",
        source: "raw"
      };
      const testcases = require("./menial-attack/test/basic_testcases.json").map(v => {
        const input = fs.readFileSync("./test/test_runner/menial-attack/test/" + v.input, "utf-8");
        const output = fs.readFileSync("./test/test_runner/menial-attack/test/" + v.output, "utf-8");
        return Object.assign({}, v, {
          input: input,
          output: output
        });
      });
      const runner = codecheck.testRunner(settings, "node test/test_runner/menial-attack/solution.partial.js");

      runner.runAll(testcases);
    });

  });

  describe("with infinite loop", function() {
    describe("menial-attack - infinite loop", function() {
      const settings = Object.assign({
        baseDirectory: "test/test_runner/menial-attack/test",
        language: "ja"
      }, require("./menial-attack/test/settings.json"));
      const testcases = require("./menial-attack/test/basic_testcases.json").slice(0, 5);
      const runner = codecheck.testRunner(settings, "node test/infinite/infinite.js");

      runner.runAll(testcases);
    });

  });

});