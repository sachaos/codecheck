"use strict";

var assert = require("chai").assert;
var EventEmitter = require('events').EventEmitter;
var LineEventEmitter = require("../src/utils/lineEventEmitter");

describe("LineEventEmitter", function() {

  it("succeed with normal case", function(done) {
    var count = 0;
    var emitter = new EventEmitter();
    var line = new LineEventEmitter(emitter, "data");
    emitter.on("data", function(data) {
      count++;
      switch (count) {
        case 1: assert.equal(data, "test1"); break;
        case 2: assert.equal(data, "test2"); break;
        case 3: assert.equal(data, "test3"); done();
      }
    });
    line.add("test1\n");
    line.add("test2\n");
    line.add("test3\n");
    line.end();
  });

  it("succeed with crlf", function(done) {
    var count = 0;
    var emitter = new EventEmitter();
    var line = new LineEventEmitter(emitter, "data");
    emitter.on("data", function(data) {
      count++;
      switch (count) {
        case 1: assert.equal(data, "test1"); break;
        case 2: assert.equal(data, "test2"); break;
        case 3: assert.equal(data, "test3"); done();
      }
    });
    line.add("test1\r\n");
    line.add("test2\r\n");
    line.add("test3\r\n");
    line.end();
  });


  it("succeed with no linefeed", function(done) {
    var count = 0;
    var emitter = new EventEmitter();
    var line = new LineEventEmitter(emitter, "data");
    emitter.on("data", function(data) {
      count++;
      switch (count) {
        case 1: assert.equal(data, "test1"); break;
        case 2: assert.equal(data, "test2test3"); done();
      }
    });
    line.add("test1\n");
    line.add("test2");
    line.add("test3\n");
    line.end();
  });

  it("succeed with linefeed in middle", function(done) {
    var count = 0;
    var emitter = new EventEmitter();
    var line = new LineEventEmitter(emitter, "data");
    emitter.on("data", function(data) {
      count++;
      switch (count) {
        case 1: assert.equal(data, "test1"); break;
        case 2: assert.equal(data, "test2"); break;
        case 3: assert.equal(data, "test3test4"); done();
      }
    });
    line.add("test1\n");
    line.add("test2\ntest3");
    line.add("test4\n");
    line.end();
  });

  it("succeed with no linefeed with end", function(done) {
    var count = 0;
    var emitter = new EventEmitter();
    var line = new LineEventEmitter(emitter, "data");
    emitter.on("data", function(data) {
      count++;
      switch (count) {
        case 1: assert.equal(data, "test1"); break;
        case 2: assert.equal(data, "test2"); break;
        case 3: assert.equal(data, "test3test4"); done();
      }
    });
    line.add("test1\n");
    line.add("test2\ntest3");
    line.add("test4");
    line.end();
  });
});

