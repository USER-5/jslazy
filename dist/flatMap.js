import { lazy } from "./array";
import { forwardReverseHelper } from "./helpers";
export function lazyFlatMap(lazyArray, fn) {
    return forwardReverseHelper(lazyArray, (iterator, prop) => {
        // We switch this out each time we exhaust an inner iterable
        let childIterator = null;
        return () => {
            while (true) {
                if (!childIterator) {
                    // Get next child iterator from parent
                    const subIteratorResult = iterator.next();
                    if (subIteratorResult.done === false) {
                        childIterator = lazy(fn(subIteratorResult.value))[prop]();
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