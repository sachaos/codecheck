const fs = require("fs");

function main(users) {// lines: Array<string>
  const answer = fs.readFileSync(process.argv[4], "utf-8").trim();

  if (answer !== users) {
    console.log("Your answer is wrong");
  }
}

function runWithStdin() {
  let input = "";
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", v => {
    input += v;
  });
  process.stdin.on("end", () => {
    main(input.trim());
  });
}
runWithStdin();
