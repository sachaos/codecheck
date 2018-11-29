"use strict";

const fs = require("fs");

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
  constructor(input, output, description) {
    this._input = input;
    this._output = output;
    this._description = description;
  }

  input() { return this._input; }
  output() { return this._output; }
  description() { return this._description; }

  readInputFromFile() {
    return fs.readFileSync(this.input(), "utf-8");
  }

  readOutputFromFile() {
    return fs.readFileSync(this.output(), "utf-8");
  }
}

/**
 * @params filepath, language(ja/en)
 * @return Array<Testcase>
 */
function loadTestcases(filepath, baseDirectory, lang) { 
  const json = require(filepath);
  return json.map(v => {
    const input = baseDirectory ? `${baseDirectory}/${v.input}` : v.input;
    const output = baseDirectory && v.output ? `${baseDirectory}/${v.output}` : v.output;
    const description = v["description_" + lang] || v.description;
    if (!input || !description) {
      throw new Error(`Invalid testcase definition: filepath=${filepath}, content=${JSON.stringify(filepath)}`);
    }
    return new Testcase(input, output, description);
  });
}

module.exports = {
  load: loadTestcases
};
