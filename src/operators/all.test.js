import { expect, it } from "vitest";
import { lazy } from "../index.js";

it("Should evaluate if all values match a predicate", () => {
  let seen = 0;
  const allOdd = lazy([1, 2, 3])
    .do(() => seen++)
    .all((v) => v > 0);
  expect(seen).toEqual(3);
  expect(allOdd).toBeTruthy();
});

it("Should evaluate if not all values match a predicate", () => {
  let seen = 0;
  const allOdd = lazy([1, 2, 3])
    .do(() => seen++)
    .all((v) => v % 2 === 1);
  expect(seen).toEqual(2);
  expect(allOdd).toBeFalsy();
});
