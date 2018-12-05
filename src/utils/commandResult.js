"use strict";

function CommandResult(succeed, message) {
  this.succeed = succeed;
  this.message = message;
  this.exitCode = 0;
  this.errors = null;
}

CommandResult.prototype.withExitCode = function(code) {
  this.exitCode = code;
  return this;
};

CommandResult.prototype.withErrors = function(errors) {
  if (!Array.isArray(errors)) {
    errors = [errors];
  }
  this.errors = errors;
  return this;
};

CommandResult.prototype.getMessage = function() {
  if (this.message) {
    return this.message;
  }
  if (this.errors) {
    return this.errors.join("\n");
  }
  return null;
};

module.exports = CommandResult;
