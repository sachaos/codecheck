"use strict";

var readlineSync = require('readline-sync');
var Promise = require("bluebird");
  
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
  return new Promise(function(resolve) {
    api.signin(username, password).then(resolve, function() {
      console.error("Fail signin");
    });
  });
};

module.exports = SigninCommand;
