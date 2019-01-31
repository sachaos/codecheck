"use strict";

const codecheck = require("../../src/codecheck");

/**
 * Test for https://github.com/code-check/codecheck/issues/97
 * This test will fail always
 * It should be completed in less thant 1sec.
 */
describe("EPS", function() {
  const eps = 0.00001;

  const settings = {
    input: {
      type: "arguments",
      source: "raw"
    },
    output: {
      type: "stdout",
      source: "raw"
    },
    eps,
    limitations: {
      maxLines : 20,
      maxCharacters : 300,
    }
  };
  const testcases = [{
    // Success cases
    description: "same value",
    input: "1",
    output: "1"
  }, {
    description: "+= eps - (eps / 10)",
    input: String(1 + eps - (eps / 10)),
    output: "1"
  }, {
    description: "-= eps + (eps / 10)",
    input: String(1 - eps + (eps / 10)),
    output: "1"
  }, {
    // Failure cases
    description: "+= eps + (eps / 10)",
    input: String(1 + eps + (eps / 10)),
    output: "1"
  }, {
    description: "-= eps - (eps / 10)",
    input: String(1 - eps - (eps / 10)),
    output: "1"
  }];
  const command = "echo";
  const runner = codecheck.testRunner(settings, command);

  runner.runAll(testcases);
});
