"use strict";

const fs = require("fs");
const readline = require("readline");

class FileComparator {
  compare(filepath1, filepath2) {
    const tokens1 = [];
    const tokens2 = [];
    let index = 0;
    let file1Closed = false;
    let file2Closed = false;
    return new Promise((resolve, reject) => {
      try {
        function handleLine(tokens, line) {
          line.split(/\s/).filter(v => v.length > 0).forEach(v => {
            tokens.push(v);
          });
        }
        function fireCompare() {
          while (tokens1.length > 0 && tokens2.length > 0) {
            index++;
            const a = tokens1.shift();
            const b = tokens2.shift();
            if (a !== b) {
              forceClose(index, a, b);
              return false;
            }
          }
          return true;
        }
        function forceClose(index, a, b) {
          if (!file1Closed) {
            file1Closed = true;
            rl1.close();
          }
          if (!file2Closed) {
            file2Closed = true;
            rl2.close();
          }
          resolve({
            index, 
            file1: a,
            file2: b
          });
        }
        function doClose() {
          if (file1Closed && file2Closed && fireCompare()) {
            if (tokens1.length === 0 && tokens2.length === 0) {
              resolve({
                index: -1
              });
            } else {
              resolve({
                index: index + 1,
                file1: tokens1.shift(),
                file2: tokens2.shift()
              });
            }
          }
        }
        const rl1 = readline.createInterface(fs.createReadStream(filepath1), {});
        const rl2 = readline.createInterface(fs.createReadStream(filepath2), {});
        rl1.on('line', line => {
          handleLine(tokens1, line);
          fireCompare();
        });
        rl2.on('line', line => {
          handleLine(tokens2, line);
          fireCompare();
        });
        rl1.on("close", () => {
          if (file1Closed) {
            return;
          }
          file1Closed = true;
          doClose();
        });
        rl2.on("close", () => {
          if (file2Closed) {
            return;
          }
          file2Closed = true;
          doClose();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = FileComparator;