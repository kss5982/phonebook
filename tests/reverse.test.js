import { test } from "node:test";
import assert from "node:assert";
import functions from "../utils/for_testing.js";

test("reverse of a", () => {
  const result = functions.reverse("a");
  assert.strictEqual(result, "a");
});

test("reverse of react", () => {
  assert.strictEqual(functions.reverse("react"), "tcaer");
});

test("reverse of saippuakauppias", () => {
  assert.strictEqual(functions.reverse("saippuakauppias"), "saippuakauppias");
});
