import { test, describe } from "node:test";
import assert from "node:assert";
import functions from "../utils/for_testing.js";

describe("average", () => {
  test("average of 1 is 1", () => {
    assert.strictEqual(functions.average([1]), 1);
  });

  test("average of multiple is correct", () => {
    assert.strictEqual(functions.average([1, 2, 3]), 2);
  });

  test("average when empty array is 0", () => {
    assert.strictEqual(functions.average([]), 0);
  });
});
