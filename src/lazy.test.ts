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

it("Should Reverse Arrays", () => {
  const lazyArray = lazy([1, 2, 3]).reverse().collect();
  const regularArray = [3, 2, 1];
  expect(lazyArray).toEqual(regularArray);
});

it("Should Reverse Arrays And Clone", () => {
  const lazyArray1 = lazy([1, 2, 3]).reverse();
  const lazyArray2 = lazyArray1.reverse();
  const lazyArray3 = lazyArray2.reverse();

  const a1v1 = lazyArray1[Symbol.iterator]().next().value;
  expect(a1v1).toBe(3);
  const a2v1 = lazyArray2[Symbol.iterator]().next().value;
  expect(a2v1).toBe(1);
  // This shouldn't be using the same iterator as array1 - it should reset the count
  const a3v1 = lazyArray3[Symbol.iterator]().next().value;
  expect(a3v1).toBe(3);
});
