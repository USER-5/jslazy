import { expect, it } from "vitest";
import { lazy } from "../index.js";

it("Should filter out unwanted values", () => {
  const lazyArray = lazy([1, 2, 3])
    .filter((v) => v != 2)
    .collect();
  const regularArray = [1, 3];
  expect(lazyArray).toEqual(regularArray);
});

it("Should not process filtered elements later", () => {
  let seen: number[] = [];
  const lazyArray = lazy([1, 2, 3])
    .filter((v) => v != 2)
    .do((val) => seen.push(val));

  let i = 1;
  for (let el of lazyArray) {
    if (i === 2) {
      i++;
    }
    expect(el).toBe(i++);
  }

  expect(seen.length).toBe(2);
});

it("Should reverse filtered arrays", () => {
  const lazyArray = lazy([1, 2, 3])
    .filter((v) => v != 2)
    .reverse()
    .collect();
  const regularArray = [3, 1];
  expect(lazyArray).toEqual(regularArray);
});
