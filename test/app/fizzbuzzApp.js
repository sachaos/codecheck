"use strict";


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

process.stdin.on("data", function(data) {
  var array = data.toString().split("\n").filter(function(v) { return v.length > 0;});
  for (var i=0; i<array.length; i++) {
    console.log(fizzbuzz(array[i]));
  }
});

/*
var input = readlineSync.question();
while (input !== null) {
console.log("app2", input);
  console.log(fizzbuzz(input));
  input = readlineSync.question();
}
*/
