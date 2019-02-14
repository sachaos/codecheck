"use strict";

var assert = require("chai").assert;
var TokenComparator = require("../src/test_runner/tokenComparator");

describe("TokenComparator", function() {

  it("should succeed with same file.", async () => {
    const comparator = new TokenComparator();
    const result = await comparator.compareFiles("test/file_comparator_data/abc1.txt", "test/file_comparator_data/abc1.txt");
    assert.equal(result.index, -1);
  });

  it("should succeed with different file.(1)", async () => {
    const comparator = new TokenComparator();
    const result = await comparator.compareFiles("test/file_comparator_data/abc1.txt", "test/file_comparator_data/abc2.txt");
    assert.equal(result.index, 5);
  });

  it("should succeed with different file.(2)", async () => {
    const comparator = new TokenComparator();
    const result = await comparator.compareFiles("test/file_comparator_data/abc1.txt", "test/file_comparator_data/abc3.txt");
    assert.equal(result.index, 10);
  });

  it("should succeed with different file.(3)", async () => {
    const comparator = new TokenComparator();
    const result = await comparator.compareFiles("test/file_comparator_data/abc3.txt", "test/file_comparator_data/abc1.txt");
    assert.equal(result.index, 10);
  });
});

