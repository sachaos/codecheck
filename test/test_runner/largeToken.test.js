"use strict";

const codecheck = require("../../src/codecheck");

const STR1 = "abcdefghijklmnopqrstuvwxyz";
const STR2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

describe("Large Token", function() {
  const settings = {
    input: {
      type: "arguments",
      source: "raw"
    },
    output: {
      type: "stdout",
      source: "file"
    },
    language: "en",
    timeout: 1000
  };
  const testcases = [{
    // Success cases
    description: "pass",
    input: STR1 + STR1 + STR1 + STR1 + STR1 + STR1 + STR1 + STR1,
    output: "test_runner/large_token/output1.txt",
  }, {
    description: "fail",
    input: STR1 + STR1 + STR1 + STR2 + STR1 + STR1 + STR1 + STR1,
    output: "test_runner/large_token/output1.txt",
  }, {
    description: "fail",
    input: STR1 + STR1 + STR1 + STR1 + STR2 + STR1 + STR1 + STR1,
    output: "test_runner/large_token/output1.txt",
  }];
  const command = "echo";
  const runner = codecheck.testRunner(settings, command);

  runner.runAll(testcases);
});
