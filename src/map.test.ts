import { expect, it } from "vitest";
import { lazy } from ".";

it("Should Map Values", () => {
  const lazyArray = lazy([1, 2, 3])
    .map((v) => v * 2)
    .collect();

  const regularArray = [2, 4, 6];
  expect(lazyArray).toEqual(regularArray);
});

it("Should Clone as Expected", () => {
  const lazyArray = lazy([1, 2, 3]);
  const lazyArray2 = lazyArray.map((v) => v * -1);

  const a1v1 = lazyArray[Symbol.iterator]().next().value;
  expect(a1v1).toBe(1);
  const a2v1 = lazyArray2[Symbol.iterator]().next().value;
  expect(a2v1).toBe(-1);
});
