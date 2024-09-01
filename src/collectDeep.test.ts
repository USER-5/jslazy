import { expect, it } from "vitest";
import { lazy } from ".";

it("Should allow deep collection", () => {
  const lazyArray = lazy([
    lazy([1, 2]),
    lazy([lazy([3, 4]), lazy([5, 6])]),
  ]).collectDeep();
  const collectedArray = [
    [1, 2],
    [
      [3, 4],
      [5, 6],
    ],
  ];
  expect(lazyArray).toEqual(collectedArray);
});

it("Should work with non-lazy children", () => {
  const lazyArray = lazy([
    lazy([1, 2]),
    // Non-lazy, containing lazy
    [lazy([3, 4]), lazy([5, 6])],
  ]).collectDeep();
  const collectedArray = [
    [1, 2],
    [
      [3, 4],
      [5, 6],
    ],
  ];
  expect(lazyArray).toEqual(collectedArray);
});
