'use strict';

var _ = require("lodash");
var quote = require('shell-quote').quote;
var parse = require('shell-quote').parse;
var assert = require('chai').assert;

var data = [
  {
    'cmd': 'python3 -m nose',
    'split': ['python3', '-m', 'nose'],
    'quote': ['python3', '-m', 'nose'],
  },
  {// quote without space
    'cmd': 'python3 -m "nose"',
    'split': ['python3', '-m', '"nose"'],
    'quote': ['python3', '-m', 'nose'],
  },
  {// multiple space
    'cmd': 'hoge fuga "aaa bbb" ccc "ddd eee   fff"',
    'split': ['hoge', 'fuga', '"aaa', 'bbb"', 'ccc', '"ddd', 'eee', '', '', 'fff"'],
    'quote': ['hoge', 'fuga', 'aaa bbb', 'ccc', 'ddd eee   fff'],
  },
  {// single quote
    'cmd': "hoge fuga 'aaa bbb' ccc 'ddd eee   fff'",
    'split': ['hoge', 'fuga', "'aaa", "bbb'", 'ccc', "'ddd", 'eee', '', '', "fff'"],
    'quote': ['hoge', 'fuga', 'aaa bbb', 'ccc', 'ddd eee   fff'],
  },
];

describe('shell-quote', () => {
  it('parse', () => {
    data.forEach(v => {
      var a1 = v.cmd.split(" ");
      var a2 = parse(v.cmd);
      assert.ok(_.isEqual(a1, v.split));
      assert.ok(_.isEqual(a2, v.quote));
    });
  });

  it('qoute', () => {
    data.forEach((v, idx) => {
      var a = quote(v.quote);
      if (idx === 1) {
        assert.equal(a, 'python3 -m nose');
      } else {
        assert.equal(a, v.cmd.replace(/"/g, "'"));
      }
    });
  });
});
