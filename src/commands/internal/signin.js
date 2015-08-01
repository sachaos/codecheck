"use strict";

var readlineSync = require('readline-sync');
  
function SigninCommand(api) {
  this.api = api;
}

SigninCommand.prototype.run = function(args, options) {
  var api = this.api;
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
  return api.signin(username, password);
};

module.exports = SigninCommand;
