import { expect, it } from "vitest";
import { lazy } from "../index.js";

it("Should allow takeWhile", () => {
  let seen = 0;
  const lazyArray = lazy([1, 2, "hi", 4, 5])
    .do(() => seen++)
    .takeWhile((v) => Number.isInteger(v))
    .collect();
  const regularArray = [1, 2];
  expect(seen).toEqual(3); // We need to evaluate "hi" in order to know that it fails
  expect(lazyArray).toEqual(regularArray);
});
