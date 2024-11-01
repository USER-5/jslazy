import { it, expect } from "vitest";
import { lazyMap } from "./index.js";
import { isLazy } from "../index.js";

it("Should allow use of map on iterables", () => {
  const myArray = [1, 2, 3];
  const mappedIterable = lazyMap(myArray, (v) => v * -1);
  expect(isLazy(mappedIterable)).toBeFalsy();
  const arrayMapped = Array.from(mappedIterable);
  expect(arrayMapped).toEqual([-1, -2, -3]);
});
