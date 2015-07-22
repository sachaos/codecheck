module.exports = {
  start: function() {
    console.log("This is codecheck CLI");
    var args = process.argv.forEach(function(v, i) {
      console.log("args: " + i + ", " + v);
    });
  }
}