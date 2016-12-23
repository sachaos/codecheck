"use strict";

class CommandResult {
  constructor(succeed, message) {
    this._succeed = succeed;
    this._message = message;
    this._exitCode = 0;
    this._errors = [];
  }

  get succeed() {
    return this._succeed;
  }
  get message() {
    return this._message;
  }
  get exitCode() {
    return this._exitCode;
  }
  get errors() {
    return this._errors;
  }

  withExitCode(code) {
    this._exitCode = code;
    return this;
  }
  withErrors(errors) {
    this._errors = this.errors.concat(errors);
    return this;
  }
}

module.exports = CommandResult;
