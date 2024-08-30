import { expect, it } from "vitest";
import { lazy } from ".";

it("Should allow requesting a certain number of values", () => {
  let seen = 0;
  const lazyArray = lazy([1, 2, 3, 4])
    .do(() => seen++)
    .limit(2)
    .collect();
  const regularArray = [1, 2];
  expect(lazyArray).toEqual(regularArray);
  expect(seen).toBe(2);
});
