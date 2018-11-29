"use strict";

const InputType  = require("./inputType");
const OutputType = require("./outputType");

const DEFAULT_OUTPUT_FILENAME = "answer.txt";
const DEFAULT_MAX_LINES = 20;
const DEFAULT_MAX_CHARACTERS = 300;
const DEFAULT_TIMEOUT = 6000;

/**
## Basic Format
{
  "input": {
    "type": "arguments"
  },
  "output": {
    "type": "file",
    "filename": "answer.txt"
  },
  "judge": {
    "command": "test/judge"
  },
  "limitations": {
    "maxLines" : 20,
    "maxCharacters" : 300
  },
  "timeout": 6000
}

## Conversion from old format
- `isFileInput: true` -> `input/type: "file"`
- `isFileInput: false` -> `input/type: "arguments"`
- `isFileOutput: true` -> `output/type: "file", filename: "answer.txt"`
- `isFileOutput: false` -> `output/type: "stdout"`
- `isSpecial: true` -> `judge/command: "test/judge"`
- `maxLines` -> Move to under `limitations
- `maxCharacters` -> Move to under `limitations

## Default values
- input/type -> "arguments"
- output/type -> "stdout"
- output/filename -> "answer.txt"
- judge -> None
- limitations/maxLines -> 20
- limitations/maxCharacters -> 300
- timeout -> 6000
 */

function normalizeJson(json) {
  if (typeof(json.isFileInput) === "boolean") {
    const input = {
      type: json.isFileInput ? InputType.File : InputType.Arguments
    };
    json.input = input;
  }
  if (!json.input || !json.input.type) {
    json.input = {
      type: InputType.Arguments
    };
  }
  if (typeof(json.isFileOutput) === "boolean") {
    const output = {
      type: json.isFileOutput ? OutputType.File : OutputType.StdOut,
      filename: json.isFileOutput ? "answer.txt" : null
    };
    json.output = output;
  }
  if (!json.output || !json.output.type) {
    json.output = {
      type: OutputType.StdOut
    };
  }
  if (json.isSpecial) {
    json.judge = {
      command: "test/judge"
    };
  }
  if (!json.limitations) {
    json.limitations = {};
  }
  if (json.maxLines) {
    json.limitations.maxLines = json.maxLines;
  }
  if (json.maxCharacters) {
    json.limitations.maxCharacters = json.maxCharacters;
  }
  return json;
}

class Settings {
  constructor(json) {
    this.json = normalizeJson(json);
  }

  inputType() { return this.json.input.type; }

  outputType() { return this.json.output.type; }
  outputFilename() { 
    if (this.outputType === OutputType.File || this.hasJudge()) {
      return this.json.output.filename || DEFAULT_OUTPUT_FILENAME;
    }
    return null;
  }

  hasJudge() { return !!(this.json.judge && this.json.judge.command); }
  judgeCommand() { return this.hasJudge() ? this.json.judge.command : null; }

  maxLines() { return this.json.limitations.maxLines || DEFAULT_MAX_LINES; }
  maxCharacters() { return this.json.limitations.maxCharacters || DEFAULT_MAX_CHARACTERS; }

  timeout() { return this.json.timeout || DEFAULT_TIMEOUT; }
}

module.exports = Settings;
