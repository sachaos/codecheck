"use strict";

const codecheck = require("../../src/codecheck");

/**
 * Test for https://github.com/code-check/codecheck/issues/97
 * This test will fail always
 * It should be completed in less thant 1sec.
 */
describe("Huge error message", function() {
  const settings = {
    input: {
      type: "arguments",
      source: "raw"
    },
    output: {
      type: "stdout",
      source: "raw"
    },
    limitations: {
      maxLines : 20,
      maxCharacters : 300,
    }
  };
  const testcases = [{
    description: "test",
    input: "dummy",
    output: "a".repeat(1024 * 1024)
  }];
  const command = "echo";
  const runner = codecheck.testRunner(settings, command);

  runner.runAll(testcases);
});
