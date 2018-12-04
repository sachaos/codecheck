"use strict";

const fs = require("fs");
const assert = require("chai").assert;

const ConsoleApp = require("../app/consoleApp");
const MessageBuilder = require("./messageBuilder");
const StringData = require("./stringData");
const InputType = require("./inputType");
const OutputType = require("./outputType");
const Testcase = require("./testcase");
const FileComparator = require("./fileComparator");

class TestRunner {
  constructor(settings, appCommand) {
    this.settings = settings;
    this.messageBuilder = new MessageBuilder(settings);
    this.appCommand = appCommand;
  }

  consoleApp(cmd, cwd) {
    var app = new ConsoleApp(cmd, cwd);
    app.consoleOut(true);
    app.storeStdout(true);
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
    const testcase = Testcase.fromJson(testcaseJson, settings.baseDirectory(), settings.language());
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
        const inputData = StringData.fromRaw(testcase.readInputFromFile());
        const inputParams = self.prepareInput(testcase, inputData);
        if (inputParams.stdin.length > 0) {
          app.input(inputParams.stdin);
        }
        const result = await app.codecheck(inputParams.arguments);
        const outputData = StringData.fromLines(result.stdout);
        await self.verifyStatusCode(testcase, inputData, result);

        if (settings.outputType() === OutputType.File) {
          // Verify outputFile exists 
          try {
            fs.statSync(settings.outputFilename());
          } catch (e) {
            assert.fail(await MSG.noOutputFile());
          }
        } else if (settings.hasJudge()) {
          // If it uses judge and not File type, make outputFile.
          fs.writeFileSync(settings.outputFilename(), outputData.raw(), "utf-8");
        }

        if (settings.hasJudge()) {
          await self.verifyByJudge(testcase, inputData, outputData);
        } else if (settings.outputType() === OutputType.StdOut) {
          await self.verifyStdout(testcase, inputData, outputData);
        } else {// settings.outputType() === OutputType.File
          await self.verifyOutputFile(testcase, inputData, outputData);
        }
      });
    });
  }

  async verifyStatusCode(testcase, inputData, result) {
    const MSG = this.messageBuilder;
    if (result.code !== 0) {
      console.log(await MSG.abnormalEnd(inputData, result));
      assert.fail(await MSG.nonZeroStatusCode());
    }
  }

  async verifyByJudge(testcase, inputData, outputData) {
    const MSG = this.messageBuilder;
    const judge = this.consoleApp(this.settings.judgeCommand());
    const result = await judge.codecheck([testcase.input(), testcase.output() || "null", this.settings.outputFilename()]);
    if (result.code === 0) {
      return;
    }
    if (result.code === 1) {
      // Unexpected error
      assert.fail(await MSG.failToRunJudge(this.settings.judgeCommand(), result.stderr.join("\n")));
    } else {
      assert.fail(result.stderr.join("\n") + "\n" + (await MSG.summary(testcase, outputData)));
    }
  }

  async verifyStdout(testcase, inputData, outputData) {
    const MSG = this.messageBuilder;
    const expected = StringData.fromRaw(fs.readFileSync(testcase.output(), "utf-8")).tokens();
    const users = outputData.tokens();

    if (expected.length !== users.length) {
      assert.fail(await MSG.invalidDataLength(testcase, outputData, expected.length, users.length));
    }
    for (let i=0; i<expected.length; i++) {
      const expected_token = expected[i];
      const user_token = users[i];
      if (expected_token !== user_token) {
        assert.fail(null, null, await MSG.unmatchToken(testcase, outputData, i + 1, expected_token, user_token));
      }
    }
  }

  async verifyOutputFile(testcase, inputData, outputData) {
    const MSG = this.messageBuilder;
    const comparator = new FileComparator();
    const result = await(comparator.compare(testcase.output(), this.settings.outputFilename()));
    if (result.index !== -1) {
      assert.fail(await MSG.unmatchToken(testcase, outputData, result.index, result.file1, result.file2));
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
        done()
      });
      this.app = null;
    } else {
      done();
    }
  }

  prepareInput(testcase, inputData) {
    let stdin = [];
    let args = [];
    switch (this.settings.inputType()) {
      case InputType.File:
        args = testcase.input();
        break;
      case InputType.StdIn:
        stdin = inputData.lines();
        break;
      case InputType.Arguments:
        args = inputData.tokens();
        break;
      default:
        throw new Error("Unknown input type: " + this.settings.inputType());
    }
    return {
      stdin: stdin,
      arguments: args
    };
  }

}

module.exports = TestRunner;
