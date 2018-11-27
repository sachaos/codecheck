"use strict";

const glob       = require("glob");
const shellQuote = require("shell-quote");

class MyQuote {
  constructor(cwd) {
    this._cwd = cwd || '.';
  }

  bind(newCwd) {
    return new MyQuote(newCwd);
  }

  quote(xs) {
    const ret = shellQuote.quote(xs);
    return ret.replace(/\\\*/g, '*');
  }

  parse(str) {
    return shellQuote.parse(str).map(v => {
      if (v.op === "glob" && v.pattern) {
        var expanded = glob.sync(v.pattern, {
          cwd: this._cwd
        });
        return expanded.length > 0 ? expanded : v.pattern;
      } else {
        return v;
      }
    }).reduce((a, b) => a.concat(b), []);
  }
}

module.exports = new MyQuote(process.cwd());
