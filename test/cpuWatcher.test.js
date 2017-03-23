"use strict";

var assert = require("chai").assert;
var codecheck = require("../src/codecheck");

describe("CpuWatcher", function() {

  this.timeout(20000);

  it("node app should killed around 5sec.", function(done) {
    var app = codecheck.consoleApp("node infinite.js", "test/app");
    app.cpuWatcher.limit(90).frequency(5).interval(1000).debug(true);
    app.codecheck().then(() => {
      //Should execute before timeout
      assert(true);
      done();
    });
  });

  it("scala app should killed around 5sec.", function(done) {
    var app = codecheck.consoleApp("scala infinite.scala", "test/app");
    app.cpuWatcher.limit(90).frequency(5).interval(1000).debug(true);
    app.codecheck().then(() => {
      //Should execute before timeout
      assert(true);
      done();
    });
  });
});

