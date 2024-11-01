import { expect, it } from "vitest";
import { lazy } from "../index.js";

it("Should allow takeUntil", () => {
  let seen = 0;
  const lazyArray = lazy([1, 2, 3, 4, 5, 6])
    .do(() => seen++)
    .takeUntil((v) => v > 3)
    .collect();
  const regularArray = [1, 2, 3];
  expect(seen).toEqual(4); // We need to evaluate 3 in order to know that it fails
  expect(lazyArray).toEqual(regularArray);
});
