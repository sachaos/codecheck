const fs = require("fs");

const answer = fs.readFileSync(process.argv[3], "utf-8").trim();
const users = fs.readFileSync(process.argv[4], "utf-8").trim();

if (answer !== users) {
  console.error("Your answer is wrong");
  process.exit(2);
}
