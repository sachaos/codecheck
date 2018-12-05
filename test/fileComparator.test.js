"use strict";

var assert = require("chai").assert;
var FileComparator = require("../src/test_runner/fileComparator");

describe("FileComparator", function() {

  it("should succeed with same file.", async () => {
    const comparator = new FileComparator();
    const result = await comparator.compare("test/file_comparator_data/abc1.txt", "test/file_comparator_data/abc1.txt");
    assert.equal(result.index, -1);
  });

  it("should succeed with different file.(1)", async () => {
    const comparator = new FileComparator();
    const result = await comparator.compare("test/file_comparator_data/abc1.txt", "test/file_comparator_data/abc2.txt");
    assert.equal(result.index, 5);
  });

  it("should succeed with different file.(2)", async () => {
    const comparator = new FileComparator();
    const result = await comparator.compare("test/file_comparator_data/abc1.txt", "test/file_comparator_data/abc3.txt");
    assert.equal(result.index, 10);
  });

  it("should succeed with different file.(3)", async () => {
    const comparator = new FileComparator();
    const result = await comparator.compare("test/file_comparator_data/abc3.txt", "test/file_comparator_data/abc1.txt");
    assert.equal(result.index, 10);
  });
});

