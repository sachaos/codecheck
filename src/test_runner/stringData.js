"use strict";

const fs = require("fs");

function splitStrByLine(str) {
  return str.split(/\n/).filter(v => v.length > 0);
}

function splitStrBySpace(str) {
  return str.split(/\s/).filter(v => v.length > 0);
}


class StringData {
  constructor(filename, raw) {
    this._filename = filename;
    this._raw = raw;
  }

  raw() { 
    if (!this._raw && this._filename) {
      this._raw = fs.readFileSync(this._filename, "utf-8");
    }
    return this._raw; 
  }

  length() {
    if (this._raw) {
      return this._raw.length;
    }
    if (this._filename) {
      return fs.statSync(this._filename).size;
    }
    return 0;
  }

  lines() { return splitStrByLine(this.raw()); }
  tokens() { return splitStrBySpace(this.raw()); }
  filename() { return this._filename; }

}

function fromFile(filename) {
  return new StringData(filename, null);
}

function fromRaw(raw) {
  return new StringData(null, raw);
}

function fromLines(lines) {
  const raw = lines.join("\n");
  return new StringData(null, raw);
}

module.exports = {
  splitStrByLine,
  splitStrBySpace,
  fromRaw,
  fromLines,
  fromFile
};