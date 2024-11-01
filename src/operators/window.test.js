import { expect, it } from "vitest";
import { lazy } from "../index.js";

it("Should provide windows", () => {
  const lazyArray = lazy([1, 2, 3, 4, 5]).windows(2).collectDeep();
  const windowedArray = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
  ];
  expect(lazyArray).toEqual(windowedArray);
});
