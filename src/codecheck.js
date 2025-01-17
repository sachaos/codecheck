"use strict";

const ReadLine     = require("./utils/readLine");
const ConsoleApp   = require("./app/consoleApp");
const Settings     = require("./test_runner/settings");
const TestRunner   = require("./test_runner/testRunner");
const StringData   = require("./test_runner/stringData");

function readline() {
  return new ReadLine();
}

function consoleApp(cmd, cwd) {
  var app = new ConsoleApp(cmd, cwd);
  app.consoleOut(true);
  app.storeStdout(true);
  app.storeStderr(true);
  return app;
}

function testRunner(settings, appCommand) {
  return new TestRunner(new Settings(settings), appCommand);
}

function stringData(str) {
  return StringData.fromRaw(str);
}

module.exports = {
  readline: readline,
  consoleApp: consoleApp,
  testRunner: testRunner,
  stringData: stringData
};