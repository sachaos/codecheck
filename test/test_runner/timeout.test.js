"use strict";

const codecheck = require("../../src/codecheck");

/**
 * Test for https://github.com/code-check/codecheck/issues/97
 * This test will fail always
 * It should be completed in less thant 1sec.
 */
describe("Timeout", function() {
  const settings = {
    input: {
      type: "arguments",
      source: "raw"
    },
    output: {
      type: "stdout",
      source: "raw"
    },
    language: "en",
    timeout: 1000
  };
  const testcases = [{
    // Success cases
    description: "wait 20ms",
    input: "20",
    output: "Hello"
  }, {
    description: "wait 800ms",
    input: "800",
    output: "Hello"
  }, {
    description: "wait 2000ms",
    input: "2000",
    output: "Hello"
  }, {
    description: "wait 8000ms",
    input: "8000",
    output: "Hello"
  }];
  const command = "node test/app/timeoutTest.js";
  const runner = codecheck.testRunner(settings, command);

  runner.runAll(testcases);
});
