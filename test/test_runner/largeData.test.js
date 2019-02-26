const codecheck = require("../../src/codecheck");

const language = "ja";
const appCommand = "test/test_runner/large_data/a.out";
 
const settings = require("./large_data/test/settings.json");
settings.language = language;
settings.baseDirectory = "test/test_runner/large_data/test";
const testcases = require("./large_data/test/testcases.json");
 
const testRunner = codecheck.testRunner(settings, appCommand);
testRunner.runAll(testcases);