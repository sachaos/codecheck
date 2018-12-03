"use strict";
function main(lines) {// lines: Array<string>
  const line = lines[0].split(/\s+/);
  const h = parseInt(line[0], 10);
  const a = parseInt(line[1], 10);
  const b = parseInt(line[2], 10);

  if (h <= a) {
      console.log("YES");
      console.log(1);
  } else if (a <= b) {
      console.log("NO");
  } else {
      console.log("YES");
      console.log(Math.floor((h-a-1)/(a-b)) + 2);
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
    main(input.split("\n"));
  });
}
runWithStdin();
