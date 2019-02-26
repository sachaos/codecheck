"use strict";

const fs = require("fs");
const DataSource = require("./dataSource");

/*
 {
  "input": "in/basic/case01.in",
  "output": "out/basic/case01.out",
  "description": "Description for default",
  "description_ja": "Description for Japanese(Optional)",
  "description_en": "Description for English(Optional)",
 },
*/

class Testcase {
  constructor(input, output, description, json) {
    this._input = input;
    this._output = output;
    this._description = description;
    this._json = json;
  }

  input() { return this._input; }
  output() { return this._output; }
  description() { return this._description; }

  option(key) { return this._json[key]; }

  readInputFromFile() {
    return fs.readFileSync(this.input(), "utf-8");
  }

  readOutputFromFile() {
    return fs.readFileSync(this.output(), "utf-8");
  }
}

/**
 * Static functions
 */

Testcase.load = function(filepath, settings) {
  const json = require(process.cwd() + "/" + filepath);
  return json.map(v => {
    return Testcase.fromJson(v, settings);
  });
};

Testcase.fromJson = function(json, settings) {
  const lang = settings.language();
  let input = json.input;
  if (settings.inputSource() === DataSource.File && settings.baseDirectory()) {
    input = settings.baseDirectory() + "/" + input;
  }
  let output = json.output;
  if (output && settings.outputSource() === DataSource.File && settings.baseDirectory()) {
    output = settings.baseDirectory() + "/" + output;
  }
  const description = json["description_" + lang] || json.description || json.it;
  if (!input || !description) {
    throw new Error(`Invalid testcase definition: ${JSON.stringify(json)}`);
  }
  return new Testcase(input, output, description, json);
};

module.exports = Testcase;
