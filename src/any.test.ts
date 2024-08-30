import { expect, it } from "vitest";
import { lazy } from ".";

it("Should evaluate if any value matches a predicate", () => {
  let seen = 0;
  const anyEven = lazy([1, 2, 3])
    .do((v) => seen++)
    .any((v) => v % 2 === 0);
  expect(seen).toEqual(2);
  expect(anyEven).toBeTruthy();
});
