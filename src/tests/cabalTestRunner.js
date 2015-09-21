"use strict";

var TestRunner = require("./testRunner");

/**
 * cabal test (hspec)
 * hspec outputs following line at end of test
 * 22 examples, 0 failures
 */
function CabalTestRunner(args, cwd) {
  function initArgs() {
    var ret = args || [];
    if (ret.indexOf("test") === -1) {
      ret.push("test");
    }
    if (ret.indexOf("--show-details=streaming") === -1) {
      ret.push("--show-details=streaming");
    }
    return ret;
  }
  function onStdout(data) {
    var regex = /(\d+) examples, (\d+) failures/;
    var match = data.match(regex);
    if (match) {
      self.failureCount = parseInt(match[2]);
      self.successCount = parseInt(match[1]) - self.failureCount;
    }
  }

  var self = this;
  this.init();
  this.cmd = "cabal";
  this.args = initArgs();
  this.cwd = cwd;

  this.onStdout(onStdout);
}

CabalTestRunner.prototype = new TestRunner();

module.exports = CabalTestRunner;
