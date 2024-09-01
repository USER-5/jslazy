import { isLazy, } from "./index.js";
import { reverseHelper, rLazyIterable } from "./lazyIterable.js";
import { forwardLazyIterable } from "./forwardLazyIterable.js";
export function lazyFlatMap(lazyArray, fn) {
    return reverseHelper(lazyArray, (iterator, prop) => {
        // We switch this out each time we exhaust an inner iterable
        let childIterator = null;
        return () => {
            while (true) {
                if (!childIterator) {
                    // Get next child iterator from parent
                    const subIteratorResult = iterator.next();
                    if (subIteratorResult.done === false) {
                        const child = fn(subIteratorResult.value);
                        // If we only have a forward lazy iterable, we can ONLY use Symbol.iterator.
                        if (isLazy(child)) {
                            childIterator = rLazyIterable(child)[prop]();
                        }
                        else {
                            if (prop !== Symbol.iterator) {
                                throw "jslazy/FlatMap: Cannot Reverse Child Iterable.\nFlatMap received a non-reversible child iterable and then tried to reverse it";
                            }
                            childIterator = forwardLazyIterable(child)[Symbol.iterator]();
                        }
                    }
                    else {
                        // We have run out of parent values. Time to terminate
                        return {
                            done: true,
                            value: undefined,
                        };
                    }
                }
                const nextValue = childIterator.next();
                if (nextValue.done === true) {
                    // Clear child iterator and go back to the top of the loop to ask for
                    // a new one
                    childIterator = null;
                    continue;
                }
                else {
                    return {
                        done: false,
                        value: nextValue.value,
                    };
                }
            }
        };
    });
}
//# sourceMappingURL=flatMap.js.map