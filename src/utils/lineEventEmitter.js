"use strict";

var _ = require("lodash");

function LineEventEmitter(emitter, name) {
  function add(data) {
    var array = data.toString().split(/\r?\n/g);
    if (array.length === 0) {
      return;
    }
    if (buf) {
      array[0] = buf + array[0];
      buf = "";
    }
    if (data[data.length] !== 10) {
      buf += array.pop();
    }
    array.forEach(function(v) {
      emitter.emit(name, v);
    });
  }
  function end() {
    if (buf) {
      emitter.emit(name, buf);
      buf = "";
    }
  }
  var buf = "";

  _.extend(this, {
    add: add,
    end: end
  });
}

module.exports = LineEventEmitter;
