export function* arrayToReverseIterator<T>(arr: Array<T>): Iterator<T> {
  // Unfortunately, unless we want to eagerly evaluate this, we have to manually
  // iterate in reverse.
  for (let index = arr.length - 1; index >= 0; index--) {
    yield arr[index]!;
  }
}
