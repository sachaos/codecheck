"use strict";

function API(host) {
  this.baseUrl = (host.indexOf("localhost") === 0 ? "http://" : "https://") + host;
}

module.exports = API;
