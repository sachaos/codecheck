"use strict";

var shellQuote    = require("shell-quote");

function quote(xs) {
  var ret = shellQuote.quote(xs);
  return ret.replace(/\\\*/g, '*');
}

function parse(str) {
  return shellQuote.parse(str).map(function(v) {
    if (v.op === "glob" && v.pattern) {
      return v.pattern;
    } else {
      return v;
    }
  });
}

module.exports = {
  quote: quote,
  parse: parse
};