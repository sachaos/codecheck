"use strict";

function CommandResult(succeed, message) {
  this.succeed = succeed;
  this.message = message;
  this.exitCode = 0;
}

CommandResult.prototype.withExitCode = function(code) {
  this.exitCode = code;
  return this;
};

module.exports = CommandResult;
