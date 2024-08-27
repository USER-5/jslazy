# Lazy JS

🥱

**Adding the missing bridge between arrays, and iterators in JS.**

As with all good libraries, this is _🔥bLAZILY Fast🔥_!

Headline Features:

- Fully Typed
- Implements Native JS Iterables
- Reduced Memory Footprint

## Basic Usage

Take your current iterable data structure, and turn it into a `Lazy` iterable.

```ts
import { lazy } from "lazy-js";

const myArray = ["I'm", "not", "doing", "anything", "today"];

// Convert your existing arrays
const myLazyArray = lazy(myArray);

// Perform operations without fear! Code isn't executed immediately
const myUppercaseLazyArray = myLazyArray
  .map((word) => word.toUpperCase())
  .limit(4);

// Reverse without mutating
const myReversedArray = myLazyArray.reverse();

// Code is executed when the lazy array is consumed:
const backToRegularArray = myUppercaseLazyArray.collect();
// = ["I'M", "NOT", "DOING", "ANYTHING"]

// Lazy iterators can be looped over as well:
for (const word of myReversedArray) {
  console.log(word);
}
// = today, anything, doing, not, I'm
```
