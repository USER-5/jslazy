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

**Does not apply to `ForwardLazyIterable`s**

Reverses the iterator's order. This is still a lazy operation, but can only be
performed on `LazyIterables`. The library prefers to return `LazyIterables`
where possible; that is, when convertint either other `LazyIterables`, or
`Array`s.

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

## LazyIterable and ForwardLazyIterable

There are two core types to this library: `ForwardLazyIterable`, and
`LazyIterable`. Ideally, you will be always dealing with a `LazyIterable`, as
that is an extension of the `ForwardLazyIterable` type. This enables lazy
reversing of the iterable.

You will end up with a non-reversible `ForwardLazyIterable` if you provide a
non-reversible `Iterable` to the `lazy` function.

There are two main cases where you will end up with a non-reversible
`ForwardLazyIterable`:

1. You have an infinite iterable (and therefore it has no 'end' to point at for
   the reverse)
2. You have an iterable that is already lazy, but not from this library e.g.
   `Object.keys()`, or `new Set(1,2,3)`

In the first case, we cannot support reversing. For the second case, it's likely
best to stick with a non-reversible `ForwardLazyIterable`, unless you really
want a reversible iterable, in which case you can convert it into an array
first.

```ts
const notableNumbersObj = {
  favourite: 123,
  daysInApril: 30,
  zero: 0,
};
// But honestly, why does the order matter here?
const notableNumbersIter = Object.values(notableNumbersObj);
const reversibleLazy = lazy(Array.from(notableNumbersIter)).reverse();
// reversibleLazy.collect() === [0, 30, 123];
```
