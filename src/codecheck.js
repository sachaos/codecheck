"use strict";

var ReadLine = require("./utils/readLine");

function readline() {
  return new ReadLine();
}

module.exports = {
  readline: readline
};