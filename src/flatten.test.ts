import { expect, it } from "vitest";
import { lazy } from ".";

it("Should allow flattening 2d iterables", () => {
  const lazyArray = lazy([lazy([1, 2]), lazy([3, 4])])
    .flatten()
    .collect();
  const collectedArray = [1, 2, 3, 4];
  expect(lazyArray).toEqual(collectedArray);
});
