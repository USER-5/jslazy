# JS Lazy | The Missing Lazy Iterator Toolsuite

🥱

**Adding the missing bridge between arrays, and iterators in JS.**

As with all good libraries, this is _🔥bLAZILY Fast🔥_!

Headline Features:

- Fully Typed (Despite the `js` prefix, this is written in typescript)
- Implements Native JS Iterables
- Reduced Memory Footprint

## Basic Usage

Take your current iterable data structure, and turn it into a `Lazy` iterable.

```ts
import { lazy } from "jslazy";

const myArray = ["I'm", "not", "doing", "anything", "today"];

// Convert your existing arrays
const myLazyArray = lazy(myArray);

// Perform operations without fear! Code isn't executed immediately
const myUppercaseLazyArray = myLazyArray
  .map((word) => word.toUpperCase())
  .limit(4);

// Code is executed when the lazy array is consumed:
const backToRegularArray = myUppercaseLazyArray.collect();

// backToRegularArray === ["I'M", "NOT", "DOING", "ANYTHING"]

// Reverse without mutating
const myReversedArray = myLazyArray.reverse();

// Lazy iterators can be looped over as well:
for (const word of myReversedArray) {
  console.log(word);
}
// prints: today, anything, doing, not, I'm
```

## Operators

### Do

Given an action, executes the action on each value, but does not modify the
value. This is not designed to modify values (though that's possible), but
mostly for debugging purposes.

```ts
const lazyArray = lazy([1, 2, 3])
  .do((val) => console.log("Received: " + val))
  .collect();
// Prints:
//  Received: 1
//  Received: 2
//  Received: 3
```

### Collect

Gathers the values into an array. This consumes values, and evaluates the chain.

```ts
const myLazy = lazy([1, 2, 3]);
const lazyReversed = myLazy.reverse();
const reversed = lazyReversed.collect();
// reversed = [3, 2, 1];
```

### CollectDeep

Much like collect, but recursively collects other lazy iterables.

```ts
const deepLazy = lazy([
  lazy([1, 2]),
  lazy([lazy([3, 4]), lazy([5, 6])]),
]).collectDeep();
// deepLazy === [
//   [1, 2],
//   [
//     [3, 4],
//     [5, 6],
//   ],
// ];
```

### Filter

Given a predicate, removes items that return false.

```ts
const myLazy = lazy([1, 2, "hello", null, 4, 5.6]);
// Remove any items that aren't an integer
const output = myLazy
  .filter((value) => Number.isInteger(value))
  // Consume items to trigger the filter
  .collect();

// = [1, 2, 4];
```

### Map

Executes the mapping function on each value, and propogates the returned value.

```ts
const lazyArray = lazy([1, 2, 3])
  .map((v) => v * 2)
  .collect();

// lazyArray = [2, 4, 6]
```

### FlatMap

Maps, and flattens the returned iterables into a single iterable.

The value returned from the provided mapping function can be any iterable (be it
`LazyIterable`, standard `Iterable`, `Set`, `Object.entries()`, or `Array`), and
jslazy will convert it into a lazy one.

```ts
const people = lazy([
  {
    name: "John",
    children: ["James", "Jacob"],
  },
  {
    name: "Alice",
    children: ["Amber", "Alex"],
  },
]);
// For each person, we want to extract the children, and flatten that into a 1D iterable
const childNames = people.flatMap((person) => person.children).collect();
// childNames === ["James", "Jacob", "Amber", "Alex"];
```

### Reverse

Reverses the iterator's order. This is still a lazy operation, if performed from
a base of arrays.

```ts
const reversedNumbers = lazy([1, 2, 3]).reverse().collect();
// reversedNumbers === [3, 2, 1];
```

### Limit

Returns **at most** nValues values. If the iterator is exhausted before this
value is reached, this operation does nothing.

```ts
let seen = 0;
const limitedArray = lazy([1, 2, 3, 4])
  .do(() => seen++)
  .limit(2)
  .collect();

// limitedArray === [1,2]
// seen === 2
```

### TakeWhile

Executes a predicate on each value, and terminates the iterator as soon as the
predicate returns false.

_The opposite of `TakeUntil`_

Note that this needs to consume a failing value in order to know that it needs
to terminate, so the number of consumed values will be one greater than the
number of produced values (unlike `limit` which doesn't need to consume an extra
value).

```ts
let seenBefore = 0;
let seenAfter = 0;
const lazyArray = lazy([1, 2, "hi", 4, 5])
  .do(() => seenBefore++)
  .takeWhile((v) => Number.isInteger(v))
  .do(() => seenAfter++)
  .collect();
// "hi" failed, so the rest is omitted
// lazyArray === [1, 2];

// We had to evaluate 3 items
// seenBefore === 3;

// 2 items were emitted after the `takeWhile` operator
// seenAfter === 2;
```

### TakeUntil

Executes a predicate on each value, and terminates the iterator as soon as the
predicate returns true.

_The opposite of `TakeWhile`_

Note that this needs to consume a successful value in order to know that it
needs to terminate, so the number of consumed values will be one greater than
the number of produced values (unlike `limit` which doesn't need to consume an
extra value).

```ts
let seenBefore = 0;
let seenAfter = 0;
const lazyArray = lazy([1, 2, 3, 4, 5, 6])
  .do(() => seenBefore++)
  .takeUntil((v) => v > 3)
  .do(() => seenAfter++)
  .collect();
// 4 is the first value > 3, so it is omitted
// lazyArray === [1, 2, 3];

// We had to evaluate 4 items
// seenBefore === 3;

// 3 items were emitted after the `takeUntil` operator
// seenAfter === 2;
```

### Any

Returns true if the predicate returns true for any value in the iterable,
otherwise returns false.

This operation consumes value, and exits early (if possible).

```ts
let seen = 0;
const anyEven = lazy([1, 2, 3])
  .do((v) => seen++)
  // isEven check
  .any((v) => v % 2 === 0);

// anyEven === true

// We shouldn't need to evaluate 3, since 2 is even
// seen === 2
```

### All

Returns true if all values in the iterable return true for the predicate,
exiting early if possible.

This consumes values.

```ts
let seen = 0;
const allOdd = lazy([1, 2, 3])
  .do((v) => seen++)
  // isOdd check
  .all((v) => v % 2 === 1);

// allOdd === false

// We shouldn't need to evaluate 3, since 2 is even
//   Therefore all elements are not odd.
// seen === 2
```

### Window

Returns an iterable of overlapping windows of a chosen size. The inner windows
are always of type `LazyIterable`, since we need to know all elements ahead of
time in order to calculate whether a window is valid.

```ts
const lazyWindows = lazy([1, 2, 3, 4, 5]).windows(2).collectDeep();
// lazyWindows === [
//    [1, 2],
//    [2, 3],
//    [3, 4],
//    [4, 5],
//  ];
```
