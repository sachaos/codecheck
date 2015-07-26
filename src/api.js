"use strict";

var Promise = require("bluebird");
var request = Promise.promisify(require("request").defaults({jar: true}));

function API(host) {
  this.baseUrl = (host.indexOf("localhost") === 0 ? "http://" : "https://") + host;
}

API.prototype.signin = function(username, password) {
  var options = {
    url: this.baseUrl + "/api/auth/signin",
    method: "POST",
    form: {
      nameOrEmail: username,
      password: password
    },
    json: true
  };
  return request(options);
};

API.prototype.getChallenge = function(id) {
  var options = {
    url: this.baseUrl + "/api/challenges/" + id,
    method: "GET",
    json: true
  };
  return request(options);
};

module.exports = API;
