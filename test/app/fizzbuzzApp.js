"use strict";

var readline = require("../../src/codecheck").readline();

function fizzbuzz(n) {
  if (n % 15 === 0) {
    return "FizzBuzz";
  } else if (n % 5 === 0) {
    return "Buzz";
  } else if (n % 3 === 0) {
    return "Fizz";
  } else {
    return n;
  }
}

readline.onData(function(data) {
  console.log(fizzbuzz(data));
});

