"use strict";

var assert        = require("chai").assert;
var CodecheckYaml = require("../src/codecheckYaml");

describe("CodecheckYaml", function() {
  it("can load and can access its data", function() {
    var config = new CodecheckYaml();
    assert.ok(config.load("test/testdata/code-main.yml"));

    assert.ok(config.hasWebApp());
    assert.ok(config.getWebAppCommand().indexOf("sbt run") === 0);
    assert.equal(config.getWebAppPort(), 9000);
    assert.ok(config.getWebAppConsole());

    assert.ok(config.getBuildCommands().length, 1);
    assert.ok(config.getBuildCommands()[0].indexOf("npm install") === 0);

    assert.ok(config.getTestCommands().length, 1);
    assert.ok(config.getTestCommands()[0].indexOf("mocha") === 0);

  });
});
