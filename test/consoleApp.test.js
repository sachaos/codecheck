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

describe("FizzBuzzApp", function() {
  it("with storeOutput", function(done) {
    var app = codecheck.consoleApp(CMD, DIR);
    app.storeStdout(true);
    app.input("1", "2", "3", "4", "5");
    app.onEnd(function() {
      assert.deepEqual(app.stdoutAsArray(), ["1", "2", "Fizz", "4", "Buzz"]);
      done();
    });
    app.run();
  });
});
