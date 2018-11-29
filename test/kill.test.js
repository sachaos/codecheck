"use strict";

var assert       = require("chai").assert;
var codecheck    = require("../src/codecheck");

var CMD = "node killTest.js";
var DIR = "test/app";

/**
 * About checking time with 2000 and 7000
 * This test runs a console app that sleeps for 5000ms, twice.
 * Second execution, which will be executed after 1000ms, should kill previous running app.
 * It should be happen within a second, which specified 2000 as threshold.
 * Thus 7000 is specified on second assertion.
 */
 describe("KillTest", function() {

  it("success to kill", function(done) {
    var app = codecheck.consoleApp(CMD, DIR);
    app.run("hoge", "fuga");
    setTimeout(() => {
      app.kill(() => {
        console.log("killed");
        done();
      });
    }, 1000);
  });

  it("killed previous app before run", function(done) {
    this.timeout(10000);
    var onEndCount = 0;
    var app = codecheck.consoleApp(CMD, DIR);
    var start = new Date().getTime();
    app.onEnd(code => {
      switch (onEndCount++) {
        case 0:
          assert.isNull(code);
          const killedTime = new Date().getTime() - start;
          assert(killedTime < 2000);
          break;
        case 1:
          assert(code === 0);
          const finishedTime = new Date().getTime() - start;
          assert(finishedTime < 7000);
          done();
          break;
        default:
          assert.fail();
      }
    });
    app.run(1, 2, 3);
    setTimeout(() => {
      app.run(4, 5, 6);
    }, 1000);
  });
});
