"use strict";

var fs         = require("fs-extra");
var path       = require("path");
var TestRunner = require("./testRunner");

var testAddition = 
      'test {\n' + 
      '  afterTest { desc, result -> \n' +
      '    if (result.resultType == org.gradle.api.tasks.testing.TestResult.ResultType.SUCCESS) {\n' + 
      '      println "ok - ${desc.name}"\n' +
      '    } else {\n' + 
      '      println "not ok - ${desc.name}"\n' +
      '    }\n' +
      '  }\n' +
      '}\n';

function GradleTestRunner(args, cwd) {
  function getBuildFilePath() {
    var ret = "build.gradle";
    if (cwd) {
      ret = cwd + path.sep + ret;
    }
    return ret;
  }
  function initialize() {
    var filename = getBuildFilePath();
    if (fs.existsSync(filename)) {
      fs.copySync(filename, filename + ".temp");
      fs.appendFileSync(filename, testAddition);
    }
  }
  function finalize() {
    var filename = getBuildFilePath();
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
      fs.renameSync(filename + ".temp", filename);
    }
  }
  function onStdout(data) {
    function isOk() {
      return array.length > 1 && array[0] === "ok";
    }
    function isNotOk() {
      return array.length > 2 && array[0] === "not" && array[1] === "ok";
    }
    var array = data.split(" ");
    if (isOk()) {
      self.successCount++;
    } else if (isNotOk()) {
      self.failureCount++;
    }
  }

  var self = this;
  this.init();

  if (!args) {
    args = [];
  }
  this.cmd = "gradle";
  this.args = args || [];
  this.cwd = cwd;

  initialize();
  this.onStdout(onStdout);
  this.onEnd(finalize);
}

GradleTestRunner.prototype = new TestRunner();

module.exports = GradleTestRunner;