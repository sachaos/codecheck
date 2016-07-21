"use strict";

var _             = require("lodash");
var glob          = require("glob");
var shellQuote    = require("shell-quote");

function quote(xs) {
  var ret = shellQuote.quote(xs);
  return ret.replace(/\\\*/g, '*');
}

function parse(str) {
  return _.flatten(shellQuote.parse(str).map(function(v) {
    if (v.op === "glob" && v.pattern) {
      var expanded = glob.sync(v.pattern);
      return expanded.length > 0 ? expanded : v.pattern;
    } else {
      return v;
    }
  }));
}

module.exports = {
  quote: quote,
  parse: parse
};