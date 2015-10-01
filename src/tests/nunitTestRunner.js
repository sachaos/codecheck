"use strict";

var path       = require("path");
var TestRunner = require("./testRunner");

/**
 * nunit-console outputs following line at end of test
 * Tests run: 22, Failures: 0, Not run: 0, Time: 0.414 seconds
 */
function NUnitTestRunner(args, cwd) {
  function initArgs() {
    var ret = args || [];
    var monoPath = process.env.MONO_PATH;
    if (!monoPath) {
      return ret;
    }
    var added = false;
    for (var i=0; i<ret.length; i++) {
      if (ret[i].indexOf("-lib:") === 0) {
        ret[i] += path.sep + monoPath;
        added = true;
        break;
      }
    }
    if (!added) {
      ret.unshift("-lib:" + monoPath);
    }
    return ret;
  }
  function onStdout(data) {
    var regex = /^Tests run: (\d+), Failures: (\d+),/;
    var match = data.match(regex);
    if (match) {
      self.failureCount = parseInt(match[2]);
      self.successCount = parseInt(match[1]) - self.failureCount;
      return;
    }
    regex = /^Tests run: (\d+), Errors: (\d+), Failures: (\d+),/;
    match = data.match(regex);
    if (match) {
      self.failureCount = parseInt(match[2]) + parseInt(match[3]);
      self.successCount = parseInt(match[1]) - self.failureCount;
      return;
    }
  }

  var self = this;
  this.init();
  this.cmd = "nunit-console";
  this.args = initArgs();
  this.cwd = cwd;

  this.onStdout(onStdout);
}

NUnitTestRunner.prototype = new TestRunner();

module.exports = NUnitTestRunner;
