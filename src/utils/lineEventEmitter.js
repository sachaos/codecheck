"use strict";

var _ = require("lodash");

function LineEventEmitter(emitter, name) {
  function add(data) {
//console.log("add: <<<", data.toString() + ">>>");
    var array = data.toString().split(/\r?\n/g);
    if (buf) {
      array[0] = buf + array[0];
    }
    buf = array.pop();
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
