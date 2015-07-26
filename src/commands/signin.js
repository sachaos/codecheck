"use strict";

var readlineSync = require('readline-sync');

function SigninCommand(api) {
  this.api = api;
}

SigninCommand.prototype.run = function(args, options) {
  var username = options.user;
  var password = options.password;
  if (!username) {
    username = readlineSync.question("username: ");
  }
  if (!password) {
    password = readlineSync.question("password: ", {
      hideEchoBack: true
    });
  }
  console.log(username, password);

  return this.api.signin(username, password);
};

module.exports = SigninCommand;
