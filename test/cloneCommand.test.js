"use strict";

var config = require("./config.json");
var app    = require(config.code_main_dir + "/specs/utils/AppUtils");
var db     = require(app.fromSpecRoot("/utils/DBUtils"));
var assert = require("chai").assert;
var rimraf = require("rimraf");
var fs     = require("fs");

var API          = require("../src/api");
var CloneCommand = require("../src/commands/clone");

describe("CloneCommand", function() {
  this.timeout(5000);

  var api = new API(config.host);
  var resultId, challengeId;

  before(function(done) {
    initData(function(data) {
      challengeId = data.challenges[0].id;
      resultId = data.challenge_results[0].id;
      done();
    });
  });

  beforeEach(function(done) {
    rimraf("shunjikonishi-" + resultId, done);
  });

  after(function(done) {
    rimraf("shunjikonishi-" + resultId, done);
  });

  it("should be exception with no args", function(done) {
    var command = new CloneCommand(api);
    try {
      command.run([], {});
      assert.fail();
    } catch(e) {
      done();
    }
  });
  it("should be exception with multiple args", function(done) {
    var command = new CloneCommand(api);
    try {
      command.run([1, 2], {});
      assert.fail();
    } catch(e) {
      done();
    }
  });
  // it("should fail with exam option", function(done) {
  //   var command = new CloneCommand(api);
  //   command.run([1], {
  //     user: "shunjikonishi",
  //     password: "password",
  //     exam: true
  //   }).then(function(result) {
  //     assert.equal(result.succeed, false);
  //     done();
  //   });
  // });
  it("should fail with invalid password", function(done) {
    var command = new CloneCommand(api);
    command.run([1], {
      user: "shunjikonishi",
      password: "---"
    }).then(function(result) {
      assert.equal(result.succeed, false);
      done();
    });
  });
  it("should fail with invalid resultId", function(done) {
    var command = new CloneCommand(api);
    command.run([resultId + 9999], {
      user: "shunjikonishi",
      password: "password"
    }).then(function(result) {
      assert.equal(result.succeed, false);
      done();
    });
  });
  it("should succeed with valid resultId", function(done) {
    var command = new CloneCommand(api);
    command.run([resultId], {
      user: "shunjikonishi",
      password: "password"
    }).then(function(result) {
      assert.equal(result.succeed, true);
      var basePath = "shunjikonishi-" + resultId + "/";
      assert.ok(fs.existsSync(basePath + "README.md"));
      assert.ok(fs.existsSync(basePath + "test/test3.js"));

      var settings = JSON.parse(fs.readFileSync(basePath + ".codecheck"));
      assert.ok(settings.challengeId, challengeId);
      assert.ok(settings.resultId, resultId);
      assert.ok(settings.username, "shunjikonishi");
      done();
    });
  });
});

function initData(done) {
  db.deleteAll().then(function() {
    db.create(require(app.fromSpecRoot("/fixtures/challengeViewer.json"))).then(function(data) {
      done(data);
    });
  });
}
