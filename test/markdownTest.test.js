"use strict";

var fs        = require("fs");
var codecheck = require("../src/codecheck");
var assert    = require("chai").assert;

describe("MarkdownTest - all correct", function() {
  var test, result;

  before(function() {
    test = codecheck.markdownTest([
      0,
      1,
      2,
      3,
      [4],
      [],
      [0, 4],
      [0, 1, 2, 3, 4],
      [],
      [0],
      [2]
    ]);
    result = test.score(fs.readFileSync("./test/testdata/markdownTest1.md", "utf-8"));
  });

  it("test has 11 test", function() {
    assert.equal(test.testCount(), 11);
  });
  it("result has 11 test", function() {
    assert.equal(result.testCount(), 11);
  });
  it("result has 11 correct", function() {
    assert.equal(result.correctCount(), 11);
    assert.equal(result.wrongCount(), 0);
  });

  it("result has 11 correct", function() {
    assert(result.isCorrect(0));
    assert(result.isCorrect(1));
    assert(result.isCorrect(2));
    assert(result.isCorrect(3));
    assert(result.isCorrect(4));
    assert(result.isCorrect(5));
    assert(result.isCorrect(6));
    assert(result.isCorrect(7));
    assert(result.isCorrect(8));
    assert(result.isCorrect(9));
    assert(result.isCorrect(10));

    assert(result.isWrong(11));
  });
});

describe("MarkdownTest - has wrong answer", function() {
  var test, result;

  before(function() {
    test = codecheck.markdownTest([
      0,
      1,
      3,//wrong
      4,//wrong
      [4],
      [],
      [0, 4, 5],//wrong
      [0, 1, 2, 3, 4],
      [],
      [0],
      [2]
    ]);
    result = test.score(fs.readFileSync("./test/testdata/markdownTest1.md", "utf-8"));
  });

  it("test has 11 test", function() {
    assert.equal(test.testCount(), 11);
  });
  it("result has 11 test", function() {
    assert.equal(result.testCount(), 11);
  });
  it("result has 8 correct", function() {
    assert.equal(result.correctCount(), 8);
    assert.equal(result.wrongCount(), 3);
  });

  it("result has 8 correct", function() {
    assert(result.isCorrect(0));
    assert(result.isCorrect(1));
    assert(result.isWrong(2));
    assert(result.isWrong(3));
    assert(result.isCorrect(4));
    assert(result.isCorrect(5));
    assert(result.isWrong(6));
    assert(result.isCorrect(7));
    assert(result.isCorrect(8));
    assert(result.isCorrect(9));
    assert(result.isCorrect(10));

    assert(result.isWrong(11));
  });
});

describe("MarkdownTest - has more answers", function() {
  var test, result;

  before(function() {
    test = codecheck.markdownTest([
      0,
      1,
      2,
      3,
      [4],
      [],
      [0, 4],
      [0, 1, 2, 3, 4],
      [],
      [0],
      [2],
      [3, 4], //no question
      5 //no question
    ]);
    result = test.score(fs.readFileSync("./test/testdata/markdownTest1.md", "utf-8"));
  });

  it("test has 13 test", function() {
    assert.equal(test.testCount(), 13);
  });
  it("result has 13 test", function() {
    assert.equal(result.testCount(), 13);
  });
  it("result has 11 correct", function() {
    assert.equal(result.correctCount(), 11);
    assert.equal(result.wrongCount(), 2);
  });

  it("result has 11 correct", function() {
    assert(result.isCorrect(0));
    assert(result.isCorrect(1));
    assert(result.isCorrect(2));
    assert(result.isCorrect(3));
    assert(result.isCorrect(4));
    assert(result.isCorrect(5));
    assert(result.isCorrect(6));
    assert(result.isCorrect(7));
    assert(result.isCorrect(8));
    assert(result.isCorrect(9));
    assert(result.isCorrect(10));

    assert(result.isWrong(11));
    assert(result.isWrong(12));

    assert(result.isWrong(13));
  });
});

describe("MarkdownTest - has less answers", function() {
  var test, result;

  before(function() {
    test = codecheck.markdownTest([
      0,
      1,
      2,
      3,
      [4],
      [],
      [0, 4],
      [0, 1, 2, 3, 4]
    ]);
    result = test.score(fs.readFileSync("./test/testdata/markdownTest1.md", "utf-8"));
  });

  it("test has 8 test", function() {
    assert.equal(test.testCount(), 8);
  });
  it("result has 8 test", function() {
    assert.equal(result.testCount(), 8);
  });
  it("result has 8 correct", function() {
    assert.equal(result.correctCount(), 8);
    assert.equal(result.wrongCount(), 0);
  });

  it("result has 11 correct", function() {
    assert(result.isCorrect(0));
    assert(result.isCorrect(1));
    assert(result.isCorrect(2));
    assert(result.isCorrect(3));
    assert(result.isCorrect(4));
    assert(result.isCorrect(5));
    assert(result.isCorrect(6));
    assert(result.isCorrect(7));

    assert(result.isWrong(8));
  });
});
