"use strict";

function CommandResult(succeed, message) {
  this.succeed = succeed;
  this.message = message;
}

module.exports = CommandResult;
