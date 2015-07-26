"use strict";

function CloneCommand(api) {
  console.log(api);
}

CloneCommand.prototype.run = function(args, options) {
  console.log(args, options);
};

module.exports = CloneCommand;