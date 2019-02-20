"use strict";

const fs = require("fs");
const readline = require("readline");
const StringData = require("./stringData");

class TokenComparator {
  constructor(eps) {
    this.eps = eps || -1;
  }

  compareTokens(token1, token2) {
    if (this.eps > 0) {
      const n1 = Number(token1);
      const n2 = Number(token2);
      return Math.abs(n1 - n2) <= this.eps;
    }
    return token1 === token2;
  }

  compareStrings(str1, str2) {
    const tokens1 = StringData.fromRaw(str1).tokens();
    const tokens2 = StringData.fromRaw(str2).tokens();
    const len = Math.min(tokens1.length, tokens2.length);
    if (tokens1.length !== tokens2.length) {
      return {
        index: len,
        token1: tokens1[len - 1],
        token2: tokens2[len - 1]
      };
    }
    let index = 0;
    while (index < len) {
      if (!this.compareTokens(tokens1[index], tokens2[index])) {
        return {
          index: index + 1,
          token1: tokens1[index],
          token2: tokens2[index]
        }
      }
      index++;
    }
    return {
      index: -1
    };
  }
  compareFiles(filepath1, filepath2) {
    const self = this;
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
            if (!self.compareTokens(a, b)) {
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
            token1: a,
            token2: b
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
                token1: tokens1.shift(),
                token2: tokens2.shift()
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

module.exports = TokenComparator;