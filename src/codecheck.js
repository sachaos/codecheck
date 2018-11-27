"use strict";

var ReadLine     = require("./utils/readLine");
var ConsoleApp   = require("./app/consoleApp");

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

module.exports = {
  readline: readline,
  consoleApp: consoleApp
};