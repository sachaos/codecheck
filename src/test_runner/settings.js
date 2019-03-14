"use strict";

const InputType  = require("./inputType");
const OutputType = require("./outputType");
const JudgeType  = require("./judgeType");
const DataSource = require("./dataSource");

const DEFAULT_OUTPUT_FILENAME = "answer.txt";
const DEFAULT_MAX_LINES = 20;
const DEFAULT_MAX_CHARACTERS = 300;
const DEFAULT_TIMEOUT = 6000;

/**
## Basic Format
{
  "input": {
    "type": "arguments",
    "source": "file"
  },
  "output": {
    "type": "file",
    "source": "file",
    "filename": "answer.txt"
  },
  "eps": 0.00001,
  "judge": {
    "command": "test/judge",
    "type": "default"
  },
  "limitations": {
    "maxLines" : 20,
    "maxCharacters" : 300
  },
  "shellMode": false,
  "timeout": 6000,
  "baseDirectory":  "test",
  "language": "ja"
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
- input/source -> "file"
- output/type -> "stdout"
- output/source -> "file"
- output/filename -> "answer.txt"
- eps -> None
- judge -> None
- judge/type -> "default"
- limitations/maxLines -> 20
- limitations/maxCharacters -> 300
- timeout -> 6000
- baseDirectory -> "test",
- language -> "ja"
- shellMode -> false
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
  inputSource() { return this.json.input.source || DataSource.File; }

  outputType() { return this.json.output.type; }
  outputSource() { return this.json.output.source || DataSource.File; }
  outputFilename() { 
    return this.json.output.filename || DEFAULT_OUTPUT_FILENAME;
  }

  hasJudge() { return !!(this.json.judge && this.json.judge.command); }
  judgeCommand() { return this.hasJudge() ? this.json.judge.command : null; }
  judgeType() { return (this.hasJudge() ? this.json.judge.type : null) || JudgeType.Default; }

  maxLines() { return this.json.limitations.maxLines || DEFAULT_MAX_LINES; }
  maxCharacters() { return this.json.limitations.maxCharacters || DEFAULT_MAX_CHARACTERS; }

  timeout() { return this.json.timeout || DEFAULT_TIMEOUT; }

  baseDirectory() { return this.json.baseDirectory || "test"; }

  language() { return this.json.language || "ja"; }

  eps() { return this.json.eps; }
  hasEps() { return typeof(this.json.eps) === "number"; }

  shellMode() { return typeof(this.json.shellMode) === "boolean" ? this.json.shellMode : true; }
}

module.exports = Settings;
