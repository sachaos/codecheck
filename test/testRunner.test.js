'use strict';

const codecheck = require("../src/codecheck");
const assert = require('chai').assert;

describe('TestRunner', function() {
  this.timeout(60 * 1000);

  it('aojJudge.test.js', async () => {
    const app = codecheck.consoleApp("mocha").consoleOut(false);
    const result = await app.codecheck("-R", "tap", "test/test_runner/aojJudge.test.js");
    assert.ok(result.stdout.some(v => v.indexOf("# tests 50") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("# pass 38") !== -1));
  });

  it('eps.test.js', async () => {
    const app = codecheck.consoleApp("mocha").consoleOut(false);
    const result = await app.codecheck("-R", "tap", "test/test_runner/eps.test.js");
    assert.ok(result.stdout.some(v => v.indexOf("# tests 5") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("# pass 3") !== -1));
  });

  it('hugeErrorMessage.test.js', async () => {
    const app = codecheck.consoleApp("mocha").consoleOut(false);
    const result = await app.codecheck("-R", "tap", "test/test_runner/hugeErrorMessage.test.js");
    assert.ok(result.stdout.some(v => v.indexOf("# tests 1") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("# pass 0") !== -1));
  });

  it('lang_en.test.js', async () => {
    const app = codecheck.consoleApp("mocha").consoleOut(false);
    const result = await app.codecheck("-R", "tap", "test/test_runner/lang_en.test.js");
    assert.ok(result.stdout.some(v => v.indexOf("# tests 25") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("# pass 25") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("It is English description") !== -1));
  });

  it('largeData.test.js', async () => {
    const app = codecheck.consoleApp("mocha").consoleOut(false);
    const result = await app.codecheck("-R", "tap", "test/test_runner/largeData.test.js");
    assert.ok(result.stdout.some(v => v.indexOf("# tests 10") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("# pass 10") !== -1));
  });

  it('testRunner.test.js', async () => {
    const app = codecheck.consoleApp("mocha").consoleOut(false);
    const result = await app.codecheck("-R", "tap", "test/test_runner/testRunner.test.js");
    assert.ok(result.stdout.some(v => v.indexOf("# tests 130") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("# pass 113") !== -1));
  });

  it('timeout.test.js', async () => {
    const app = codecheck.consoleApp("mocha").consoleOut(false);
    const result = await app.codecheck("-R", "tap", "test/test_runner/timeout.test.js");
    assert.ok(result.stdout.some(v => v.indexOf("# tests 4") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("# pass 2") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("Your application didn't finish in expected time") !== -1));
    assert.ok(result.stdout.some(v => v.indexOf("Error: Timeout of 6000ms exceeded. ") !== -1));
  });
});
