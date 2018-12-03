const fs = require("fs");

const line = fs.readFileSync(process.argv[2], "utf-8").split(/\s+/);
const h = parseInt(line[0], 10);
const a = parseInt(line[1], 10);
const b = parseInt(line[2], 10);

if (h <= a) {
  fs.writeFileSync("answer.txt", "YES\n1");
} else if (a <= b) {
  fs.writeFileSync("answer.txt", "NO\n");
} else {
  const n = Math.floor((h-a-1)/(a-b)) + 2;
  fs.writeFileSync("answer.txt", "YES\n" + n + "\n\n");
}
