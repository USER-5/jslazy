import { it, expect } from "vitest";
import { lazy } from ".";

it("Should produce a series of values", () => {
  const lazyArray = lazy([1, 2, 3]).collect();
  const regularArray = [1, 2, 3];
  expect(lazyArray).toEqual(regularArray);
});

it("Should only process values as they are consumed", () => {
  let seen: number[] = [];
  const lazyArray = lazy([1, 2, 3]).do((val) => seen.push(val));
  let i = 1;
  for (let el of lazyArray) {
    expect(el).toBe(i);
    expect(seen.length).toBe(i++);
  }
});
