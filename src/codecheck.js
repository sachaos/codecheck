"use strict";

var ReadLine     = require("./utils/readLine");
var MarkdownTest = require("./utils/markdownTest");
var ConsoleApp   = require("./app/consoleApp");

function readline() {
  return new ReadLine();
}
function markdownTest(answers) {
  return new MarkdownTest(answers);
}
function consoleApp(cmd, cwd) {
  return new ConsoleApp(cmd, cwd);
}

module.exports = {
  readline: readline,
  markdownTest: markdownTest,
  consoleApp: consoleApp
};