const h = parseInt(process.argv[2], 10);
const a = parseInt(process.argv[3], 10);
const b = parseInt(process.argv[4], 10);

if (h <= a) {
    console.log("YES");
    console.log(1);
} else if (a <= b) {
    console.log("NO");
} else {
    console.log("YES");
    console.log(Math.floor((h-a-1)/(a-b)) + 2);
}
