import { lazy, type LazyIterable } from "./index";
import type { Mapper } from "./map";
import {
  isReversibleLazy,
  reverseHelper,
  rLazyIterable,
  type IntoReversibleLazy,
  type ReversibleLazyIterable,
} from "./lazyIterable";
import { lazyIterable } from "./forwardLazyIterable";

export function lazyFlatMap<
  InItem,
  OutItem,
  InIterable extends LazyIterable<InItem>,
  MapperIterable extends Iterable<OutItem>,
  // Oh lord the type narrowing...
  // In short: both InIterable and MapperIterable need to be reversible for the output to be reversible
  OutIterable = InIterable extends ReversibleLazyIterable<InItem>
    ? MapperIterable extends IntoReversibleLazy<OutItem>
      ? ReversibleLazyIterable<OutItem>
      : LazyIterable<OutItem>
    : LazyIterable<OutItem>,
>(lazyArray: InIterable, fn: Mapper<InItem, MapperIterable>): OutIterable {
  return reverseHelper<InItem, OutItem, InIterable, OutIterable>(
    lazyArray,
    (iterator, prop) => {
      // We switch this out each time we exhaust an inner iterable
      let childIterator: Iterator<OutItem> | null = null;

      return () => {
        while (true) {
          if (!childIterator) {
            // Get next child iterator from parent
            const subIteratorResult = iterator.next();
            if (subIteratorResult.done === false) {
              const child = fn(subIteratorResult.value);
              // If we only have a forward lazy iterable, we can ONLY use Symbol.iterator.
              if (isReversibleLazy(child)) {
                childIterator = rLazyIterable(child)[prop]();
              } else {
                if (prop !== Symbol.iterator) {
                  throw "jslazy/FlatMap: Cannot Reverse Child Iterable.\nFlatMap received a non-reversible child iterable and then tried to reverse it";
                }
                childIterator = lazyIterable(child)[Symbol.iterator]();
              }
            } else {
              // We have run out of parent values. Time to terminate
              return {
                done: true,
                value: undefined,
              } as any;
            }
          }

          const nextValue = childIterator.next();
          if (nextValue.done === true) {
            // Clear child iterator and go back to the top of the loop to ask for
            // a new one
            childIterator = null;
            continue;
          } else {
            return {
              done: false,
              value: nextValue.value,
            };
          }
        }
      };
    },
  );
}
