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

  // clip(maxLen, maxLines) {
  //   let result = "";
  //   let omitted = false;
  //   if (this._raw) {
  //     const str = this._raw;
  //     let array = splitStrByLine(str);
  //     if (array.length > maxLines) {
  //       array = array.slice(0, maxLines);
  //       omitted = true;
  //     }
  //     result = array.join("\n");
  //   }
  //   if (this._filename) {
  //     let line = null;
  //     let count = 0;
  //     const reader = new LineByLine(this._filename);
  //     while (line = reader.next()) {
  //       result += line.toString("utf8") + "\n";
  //       count++;
  //       if (count >= maxLines || result.length > maxLen) {
  //         omitted = true;
  //         break;
  //       } 
  //     }
  //     reader.close();
  //   }
  //   if (result.length > maxLen) {
  //     result = result.substring(0, maxLen);
  //     omitted = true;
  //   }
  //   if (omitted) {
  //     result += "...";
  //   }
  //   return result;
  // }
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