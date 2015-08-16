"use strict";

var _                = require("lodash");
var util             = require("util");

function normalizeArray(array) {
  for (var i=0; i<array.length; i++) {
    var v = array[i];
    if (!util.isArray(v)) {
      array[i] = [v];
    }
  }
}

function MarkdownTest(answers) {
  function isCheckbox(str) {
    if (str.indexOf("- [ ]") === 0) {
      return true;
    }
    if (str.indexOf("- [x]") === 0) {
      return true;
    }

    return false;
  }
  function isChecked(str) {
    return str.indexOf("- [x]") === 0;
  }
  function makeResult(text) {
    var ret = [];
    var current = [];
    var inQuestion = false;
    var index = 0;
    var lines = text.split("\n");
    lines.forEach(function(str) {
      str = str.trim();
      if (isCheckbox(str)) {
        inQuestion = true;
        if (isChecked(str)) {
          current.push(index);
        }
        index++;
      } else if (inQuestion) {
        ret.push(current);
        current = [];
        inQuestion = false;
        index = 0;
      }
    });
    if (inQuestion) {
      ret.push(current);
    }
    return ret;
  }
  function score(text) {
    var users = makeResult(text);
    while (users.length < answers.length) {
      users.push([]);
    }
    var ret = [];
    for (var i=0; i<answers.length; i++) {
      ret.push(_.isEqual(users[i], answers[i]));
    }
    return new Result(ret);
  }
  function testCount() {
    return answers.length;
  }
  normalizeArray(answers);

  _.extend(this, {
      testCount: testCount,
      score: score
  });
}

function Result(results) {
  function testCount() {
    return results.length;
  }
  function correctCount() {
    return results.filter(function(v) {
      return v;
    }).length;
  }
  function wrongCount() {
    return results.length - correctCount();
  }
  function isCorrect(idx) {
    return idx < results.length && results[idx];
  }
  function isWrong(idx) {
    return !isCorrect(idx);
  }

  _.extend(this, {
    testCount: testCount,
    correctCount: correctCount,
    wrongCount: wrongCount,
    isCorrect: isCorrect,
    isWrong: isWrong
  });
}

module.exports = MarkdownTest;
