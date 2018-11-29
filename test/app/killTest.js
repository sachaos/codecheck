"use strict";
const args = process.argv.slice(2).join(" ");
console.log("START: " + args);
setTimeout(() => {
  console.log("END: " + args);
}, 5000);
