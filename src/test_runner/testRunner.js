"use strict";

const fs = require("fs");
const assert = require("chai").assert;

const ConsoleApp = require("../app/consoleApp");
const MessageBuilder = require("./messageBuilder");
const StringData = require("./stringData");
const InputType = require("./inputType");
const OutputType = require("./outputType");
const JudgeType = require("./judgeType");
const DataSource = require("./dataSource");
const Testcase = require("./testcase");
const TokenComparator = require("./tokenComparator");

class TestRunner {
  constructor(settings, appCommand) {
    this.settings = settings;
    this.messageBuilder = new MessageBuilder(settings);
    this.appCommand = appCommand;
  }

  consoleApp(cmd, cwd) {
    var app = new ConsoleApp(cmd, cwd);
    app.storeStderr(true);
    app.consoleOut(false);
    app.storeStdMax(2000000);
    return app;
  }

  runAll(testcases) {
    testcases.forEach(testcase => {
      this.run(testcase);
    });
  }

  run(testcaseJson) {
    const self = this;
    const settings = self.settings;
    const testcase = Testcase.fromJson(testcaseJson, settings);
    const MSG = self.messageBuilder;
    /* eslint no-undef: 0 */
    describe("", function() {
      this.timeout(self.settings.timeout());

      beforeEach(done => {
        self.beforeEach(done);
      });

      afterEach(done => {
        self.afterEach(done);
      });

      it(testcase.description(), async () => {
        const app = self.consoleApp(self.appCommand);
        self.app = app;

        app.clearInput();
        const inputData = self.createInput(testcase);
        const inputParams = self.prepareInput(testcase, inputData);
        if (inputParams.stdin.length > 0) {
          app.input(inputParams.stdin);
        }
        if (inputParams.filename) {
          app.inputFile(inputParams.filename);
        }
        if (settings.outputType() === OutputType.StdOut) {
          app.stdoutFile(settings.outputFilename());
        } else {
          app.storeStdout(true);
        }
        const result = await app.codecheck(inputParams.arguments);
        const outputData = StringData.fromFile(settings.outputFilename());
        await self.verifyStatusCode(testcase, inputData, outputData, result);

        if (settings.outputType() === OutputType.File) {
          // Verify outputFile exists 
          try {
            fs.statSync(settings.outputFilename());
          } catch (e) {
            assert.fail(await MSG.noOutputFile());
          }
        }

        if (settings.hasJudge()) {
          await self.verifyByJudge(testcase, inputData, outputData);
        } else {
          await self.verifyOutputFile(testcase, inputData, outputData);
        }
      });
    });
  }

  async verifyStatusCode(testcase, inputData, outputData, result) {
    const MSG = this.messageBuilder;
    if (result.code !== 0) {
      console.log(await MSG.abnormalEnd(inputData, outputData, result));
      assert.fail(await MSG.nonZeroStatusCode());
    }
  }

  async verifyByJudge(testcase, inputData, outputData) {
    switch (this.settings.judgeType()) {
      case JudgeType.AOJ:
        await this.verifyByAOJJudge(testcase, inputData, outputData);
        break;
      default:
        await this.verifyByDefaultJudge(testcase, inputData, outputData);
        break;
    }
  }

  /**
   * Judge with default judge spec.
   * Input parameters
   * - arg1: Filename of input data.
   * - arg2: Filename of expect output. (It may not exist)
   * - arg3: Filename of user outoput.
   * - stdin: Not used
   * Result handling
   * - Success -> exit code is 0
   * - Failure -> exit code is not 0. In this case, error message is shown in stderrr.
   */
  async verifyByDefaultJudge(testcase, inputData, outputData) {
    const MSG = this.messageBuilder;
    const judge = this.consoleApp(this.settings.judgeCommand());
    judge.storeStdout(true);
    const arg1 = testcase.input();               // Filename of input data.
    const arg2 = testcase.output() || "null";    // Filename of expect output. (It may not exist)
    const arg3 = this.settings.outputFilename(); // Filename of user outoput.
    const result = await judge.codecheck([arg1, arg2, arg3]);
    if (result.code === 0) {
      return;
    }
    if (result.code === 1) {
      // Unexpected error
      assert.fail(await MSG.failToRunJudge(this.settings.judgeCommand(), result.stderr.join("\n")));
    } else {
      assert.fail(result.stderr.join("\n") + "\n" + (await MSG.summary(testcase, inputData, outputData)));
    }
  }

  /**
   * Judge with AOJ judge spec.
   * Input parameters
   * - arg1: Filename of input data.
   * - arg2: Filename of user outoput.
   * - arg3: Filename of expect output. (It may not exist)
   * - stdin: user output
   *     User output is provided by both stdin and arguments
   *     The judge can choose which to use
   * Result handling
   * - Success -> exit code is 0 and no stdout output.
   * - Failure -> There are some messages in stdout.
   */
  async verifyByAOJJudge(testcase, inputData, outputData) {
    const MSG = this.messageBuilder;
    const judge = this.consoleApp(this.settings.judgeCommand());
    judge.storeStdout(true);
    const arg1 = testcase.input();               // Filename of input data.
    const arg2 = this.settings.outputFilename(); // Filename of user outoput.
    const arg3 = testcase.output() || "null";    // Filename of expect output. (It may not exist)
    judge.inputFile(outputData.filename()); // Pass user output to stdin. 
    const result = await judge.codecheck([arg1, arg2, arg3]);
    if (result.code === 0 && result.stdout.length === 0) {
      return;
    } 
    assert.fail(result.stdout.join("\n") + "\n" + (await MSG.summary(testcase, inputData, outputData)));
  }

  async verifyOutputFile(testcase, inputData, outputData) {
    const MSG = this.messageBuilder;
    const comparator = new TokenComparator(this.settings.eps());
    const result = this.settings.outputSource() === DataSource.Raw ?
      comparator.compareStrings(testcase.output(), outputData.raw()) :      
      await(comparator.compareFiles(testcase.output(), outputData.filename()));
    if (result.index !== -1) {
      assert.fail(await MSG.unmatchToken(testcase, inputData, outputData, result.index, result.token1, result.token2));
    }
  }

  beforeEach(done) {
    if (this.settings.outputFilename()) {
      try {
        fs.unlinkSync(this.settings.outputFilename());
      } catch (e) {
        // Ignore errors
      }
    }
    done();
  }

  afterEach(done) {
    if (this.app) {
      this.app.kill().then(() => {
        done();
      }).catch(() => {
        done();
      });
      this.app = null;
    } else {
      done();
    }
  }

  createInput(testcase) {
    switch (this.settings.inputSource()) {
      case DataSource.File:
        return StringData.fromFile(testcase.input());
      case DataSource.Raw:
        return StringData.fromRaw(testcase.input());
      default:
        throw new Error("Unknown input source: " + this.settings.inputSource());
    }
  }

  prepareInput(testcase, inputData) {
    let filename = null;
    let stdin = [];
    let args = [];
    switch (this.settings.inputType()) {
      case InputType.File:
        args = inputData.filename();
        break;
      case InputType.StdIn:
        if (this.settings.inputSource() === DataSource.Raw) {
          stdin = inputData.lines();
        } else {
          filename = inputData.filename();
        }
        break;
      case InputType.Arguments:
        args = inputData.tokens();
        break;
      default:
        throw new Error("Unknown input type: " + this.settings.inputType());
    }
    return {
      filename: filename,
      stdin: stdin,
      arguments: args
    };
  }

  calcExpected(testcase, inputData) {
    /* eslint no-unused-vars: 0 */
    switch (this.settings.outputSource()) {
      case DataSource.File:
        return StringData.fromFile(testcase.output());
      case DataSource.Raw:
        return StringData.fromRaw(testcase.output());
      default:
        throw new Error("Unknown output source: " + this.settings.outputSource());
    }
  }
}

module.exports = TestRunner;
