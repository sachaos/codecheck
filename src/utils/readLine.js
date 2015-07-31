"use strict";

var _                = require("lodash");
var EventEmitter     = require('events').EventEmitter;
var LineEventEmitter = require("../utils/lineEventEmitter");

function ReadLine() {
  function onData(func) {
    emitter.on("data", func);
  }
  function onEnd(func) {
    emitter.on("end", func);
  }
  var emitter = new EventEmitter();
  var line = new LineEventEmitter(emitter, "data");
  process.stdin.on("data", function(data) {
    line.add(data);
  });
  process.stdin.on("end", function() {
    line.close();
    emitter.emit("end");
  });
  _.extend(this, {
    onData: onData,
    onEnd: onEnd
  });
}

module.exports = ReadLine;
