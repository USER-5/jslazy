import { it, expect } from "vitest";
import { la } from "./array";

it("Should produce a series of values", () => {
  const lazyArray = la([1, 2, 3]);
  const regularArray = [1, 2, 3];
  let i = 0;
  for (let el of lazyArray) {
    expect(el).toBe(regularArray[i++]);
  }
});

it("Should filter out unwanted values", () => {
  const lazyArray = la([1, 2, 3]).filter((v) => v != 2);
  const regularArray = [1, 3];
  let i = 0;
  for (let el of lazyArray) {
    expect(el).toBe(regularArray[i++]);
  }
});

it("Should only process values as they are consumed", () => {
  let seen: number[] = [];
  const lazyArray = la([1, 2, 3]).do((val) => seen.push(val));
  let i = 1;
  for (let el of lazyArray) {
    expect(el).toBe(i);
    expect(seen.length).toBe(i++);
  }
});

it("Should not process filtered elements later", () => {
  let seen: number[] = [];
  const lazyArray = la([1, 2, 3])
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

it("Should Map Values", () => {
  const lazyArray = la([1, 2, 3]).map((v) => v * 2);

  const regularArray = [2, 4, 6];
  let i = 0;
  for (let el of lazyArray) {
    expect(el).toBe(regularArray[i++]);
  }
});

it("Should Clone as Expected", () => {
  const lazyArray = la([1, 2, 3]);
  const lazyArray2 = lazyArray.map((v) => v * -1);

  const a1v1 = lazyArray[Symbol.iterator]().next().value;
  expect(a1v1).toBe(1);
  const a2v1 = lazyArray2[Symbol.iterator]().next().value;
  expect(a2v1).toBe(-1);
});

it("Should Reverse Arrays", () => {
  const lazyArray = la([1, 2, 3]).reverse();
  const regularArray = [3, 2, 1];
  let i = 0;
  for (let el of lazyArray) {
    expect(el).toBe(regularArray[i++]);
  }
});

it("Should Reverse Arrays And Clone", () => {
  const lazyArray1 = la([1, 2, 3]).reverse();
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
