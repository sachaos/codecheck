"use strict";

function splitStrByLine(str) {
  return str.split(/\n/).filter(v => v.length > 0);
}

function splitStrBySpace(str) {
  return str.split(/\s/).filter(v => v.length > 0);
}


class StringData {
  constructor(raw) {
    this._raw = raw;
  }

  raw() { return this._raw; }
  lines() { return splitStrByLine(this._raw); }
  tokens() { return splitStrBySpace(this._raw); }
}

function fromRaw(raw) {
  return new StringData(raw);
}

function fromLines(lines) {
  const raw = lines.join("\n");
  return new StringData(raw);
}

module.exports = {
  splitStrByLine,
  splitStrBySpace,
  fromRaw,
  fromLines
};