"use strict";

const fs = require("fs");
const readline = require("readline");
const Messages = require("./messages");
const StringData = require("./stringData");
const DataSource = require("./dataSource");

class MessageBuilder {
  constructor(settings) {
    this.settings = settings;
    this.msg = Messages.getMessages(settings.language());
  }

  clip(str) {
    const maxLen = this.settings.maxCharacters();
    const maxLines = this.settings.maxLines();

    let array = StringData.splitStrByLine(str);
    let omitted = false;
    if (array.length > maxLines) {
      array = array.slice(0, maxLines);
      omitted = true;
    }
    let result = array.join("\n");
    if (result.length > maxLen) {
      result = result.substring(0, maxLen);
      omitted = true;
    }
    if (omitted) {
      result += "...";
    }
    return result;
  }

  getClippedStringFromFile(filepath) {
    const self = this;
    return new Promise((resolve,reject) => {
      try {
        const result = [];
        let omitted = false;
        const rl = readline.createInterface(fs.createReadStream(filepath), {});
        rl.on('line', line => {
          result.push(line);
          if (result.length >= self.settings.maxLines()) {
            omitted = true;
            rl.close();
          }
        });
        rl.on("close", () => {
          let str = result.join("\n");
          if (str.length >= self.settings.maxCharacters()) {
            str = str.substring(0, self.settings.maxCharacters());
            omitted = true;
          }
          if (omitted) {
            str += "...";
          }
          resolve(str);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async noOutputFile() {
    return this.msg.format(this.msg.NO_OUTPUT_FILE, this.settings.outputFilename());
  }

  async nonZeroStatusCode() {
    return this.msg.NON_ZERO_STATUS_CODE;
  }

  async abnormalEnd(inputData, result) {
    const msg = this.msg;
    let ret = msg.SUMMARY_INPUT + "\n";
    ret += this.clip(inputData.raw()) + "\n";
    if (result.stdout.length > 0) {
      ret += msg.SUMMARY_STDOUT + "\n";
      ret += this.clip(result.stdout.join("\n")) + "\n";
    }
    if (result.stderr.length > 0) {
      ret += msg.SUMMARY_STDERR + "\n";
      ret += this.clip(result.stderr.join("\n")) + "\n";
    }
    return ret;
  }

  async summary(testcase, inputData, outputData) {
    const msg = this.msg;
    let ret = msg.SUMMARY_INPUT + "\n";
    if (this.settings.inputSource() === DataSource.File) {
      ret += (await this.getClippedStringFromFile(testcase.input())) + "\n";
    } else {
      ret += this.clip(inputData.raw()) + "\n";
    }
    try {
      let yourOutput = msg.SUMMARY_YOUR_OUTPUT + "\n";
      if (this.settings.outputFilename()) {
        yourOutput += (await this.getClippedStringFromFile(this.settings.outputFilename())) + "\n";
      } else {
        yourOutput += this.clip(outputData.raw()) + "\n";
      }
      ret += yourOutput;
    } catch (e) {
      // Ignore your output part
    }
    if (!this.settings.hasJudge()) {
      ret += msg.SUMMARY_EXPECTED_OUTPUT + "\n";
      if (this.settings.outputSource() === DataSource.File) {
        ret += (await this.getClippedStringFromFile(testcase.output())) + "\n";
      } else {
      ret += this.clip(testcase.output()) + "\n";
      }
    }
    return ret;
  }

  async invalidDataLength(testcase, inputData, outputData, expectedLength, usersLength) {
    const msg = this.msg;
    let ret = msg.format(msg.INVALID_DATA_LENGTH, expectedLength, usersLength);
    ret += await this.summary(testcase, inputData, outputData);
    return ret;
  }

  async unmatchToken(testcase, outputData, index, expected, users) {
    const msg = this.msg;
    let ordinals = "th";
    switch (index % 10) {
      case 1: ordinals = "st"; break;
      case 2: ordinals = "nd"; break;
      case 3: ordinals = "rd"; break;
    }
    let ret = msg.format(msg.INVALID_DATA_ROW, this.settings.language() === "en" ? index + ordinals : index, expected, users);
    ret += await this.summary(testcase, outputData);
    return ret;
  }

  async failToRunJudge(command, err) {
    const msg = this.msg;
    return msg.format(msg.FAIL_TO_RUN_JUDGE, command, err);
  }

}

module.exports = MessageBuilder;
