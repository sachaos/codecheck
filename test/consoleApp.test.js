"use strict";

var assert       = require("chai").assert;
var codecheck    = require("../src/codecheck");

var CMD = process.env.APP_COMMAND;
var DIR = process.env.APP_DIRECTORY;

console.log(CMD, DIR);

describe("Env vars", function() {
  it("can read", function() {
    assert(CMD);
    assert(DIR);
  });
});

describe("FizzBuzzApp", function() {

  it("succeed with normal case", function(done) {
    var app = codecheck.consoleApp(CMD, DIR);
    app.input("1", "2", "3", "4", "5");
    app.expected("1", "2", "Fizz", "4", "Buzz");
    app.runAndVerify(function(result) {
      assert.ok(result.succeed);
      done();
    });
  });

  it("fail with wrong expected", function(done) {
    var app = codecheck.consoleApp(CMD, DIR);
    app.consoleOut(true);
    app.input("1", "2", "3", "4", "5");
    app.expected("1", "2", "3", "4", "Buzz");
    app.runAndVerify(function(result) {
      assert.notOk(result.succeed);
      assert.equal(result.errors.length, 1);
      done();
    });
  });

  it("fail with not enough expected", function(done) {
    var app = codecheck.consoleApp(CMD, DIR);
    app.consoleOut(true);
    app.input("1", "2", "3", "4", "5");
    app.expected("1", "2", "Fizz", "4");
    app.runAndVerify(function(result) {
      assert.notOk(result.succeed);
      assert.equal(result.errors.length, 1);
      done();
    });
  });

  it("fail with excess expected", function(done) {
    var app = codecheck.consoleApp(CMD, DIR);
    app.consoleOut(true);
    app.input("1", "2", "3", "4", "5");
    app.expected("1", "2", "Fizz", "4", "Buzz", "Fizz");
    app.runAndVerify(function(result) {
      assert.notOk(result.succeed);
      assert.equal(result.errors.length, 1);
      done();
    });
  });
});

describe("PromiseTest", function() {
  it("should success", function(done) {
    var app = codecheck.consoleApp(CMD, DIR);
    app.input("1", "2", "3", "4", "5");
    app.run().spread(function(code, stdout) {
      assert.equal(code, 0);
      assert.deepEqual(stdout, ["1", "2", "Fizz", "4", "Buzz"]);
      done();
    });
  });

  it("should fail", function(done) {
    var app = codecheck.consoleApp("dummy");
    app.input("1", "2", "3", "4", "5");
    app.run().caught(function(err) {
      assert(err);
      done();
    });
  });
});

describe("CalcApp", function() {
  var app = codecheck.consoleApp("node test/app/calcApp.js");

  it("should success with plus", function(done) {
    app.run(3, 5).spread(function(code, stdout) {
      assert.equal(code, 0);
      assert.equal(stdout[0], 8);
      done();
    });
  });

  it("should success with minus", function(done) {
    app.run(3, 5, "-").spread(function(code, stdout) {
      assert.equal(code, 0);
      assert.equal(stdout[0], -2);
      done();
    });
  });

  it("should success with mul", function(done) {
    app.run(3, 5, "*").spread(function(code, stdout) {
      assert.equal(code, 0);
      assert.equal(stdout[0], 15);
      done();
    });
  });

  it("should success with div", function(done) {
    app.run(12, 5, "/").spread(function(code, stdout) {
      assert.equal(code, 0);
      assert.equal(stdout[0], 2.4);
      done();
    });
  });

  it("should success with mod", function(done) {
    app.run(3, 5, "%").spread(function(code, stdout) {
      assert.equal(code, 0);
      assert.equal(stdout[0], 3);
      done();
    });
  });
});
