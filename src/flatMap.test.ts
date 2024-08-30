import { expect, it } from "vitest";
import { lazy } from ".";

it("Should Flatten Arrays", () => {
  const lazyArray = lazy([1, 2, 3])
    .flatMap((v) => lazy([-1, -2, v]))
    .collect();
  const regularArray = [-1, -2, 1, -1, -2, 2, -1, -2, 3];
  expect(lazyArray).toEqual(regularArray);
});

it("Should Flatten Arrays With Reversing", () => {
  const lazyArray = lazy([10, 20, 30])
    .flatMap((v) => lazy([-1, -2, v]).reverse())
    .collect();
  const regularArray = [10, -2, -1, 20, -2, -1, 30, -2, -1];
  expect(lazyArray).toEqual(regularArray);
});

it("Should allow flatMap with standard arrays", () => {
  const lazyArray = lazy([10, 20, 30])
    .flatMap((v) => [-1, -2, v])
    .collect();
  const regularArray = [-1, -2, 10, -1, -2, 20, -1, -2, 30];
  expect(lazyArray).toEqual(regularArray);
});
