"use strict";

var _ = require("lodash");
var LF = 10;

function LineEventEmitter(emitter, name) {
  function add(data) {
    var array = data.toString().split(/\r?\n/g).filter(function(v) {
      return v.length > 0;
    });
    if (array.length === 0) {
      return;
    }
    if (buf) {
      array[0] = buf + array[0];
      buf = "";
    }
    if (data[data.length - 1] !== LF) {
      buf += array.pop();
    }
    array.forEach(function(v) {
      emitter.emit(name, v);
    });
  }
  function close() {
    if (buf) {
      emitter.emit(name, buf);
      buf = "";
    }
  }
  var buf = "";

  _.extend(this, {
    add: add,
    close: close
  });
}

module.exports = LineEventEmitter;
