const reverseIterator = Symbol();
/**
 * Creates a lazy array from a standard array.
 *
 * This is still in early development, and is subject to change.
 */
export function la(source) {
    return {
        [Symbol.iterator]() {
            return {
                next: Array.isArray(source)
                    ? arrayToIterator(source)
                    : source[Symbol.iterator]().next,
            };
        },
        [reverseIterator]() {
            return {
                next: Array.isArray(source)
                    ? arrayToReverseIterator(source)
                    : source[reverseIterator]().next,
            };
        },
        filter(filterFunction) {
            return operatorHelper(this, (val) => ({
                filter: filterFunction(val),
                item: {
                    done: false,
                    value: val,
                },
            }));
        },
        do(action) {
            return operatorHelper(this, (val) => {
                action(val);
                return {
                    item: {
                        done: false,
                        value: val,
                    },
                };
            });
        },
        map(mapper) {
            return operatorHelper(this, (val) => ({
                item: {
                    done: false,
                    value: mapper(val),
                },
            }));
        },
        flatMap(mapper) {
            return forwardReverse(this, (iterator, prop) => {
                let subIterator = null;
                return () => {
                    while (true) {
                        // Get next subiterator
                        if (!subIterator) {
                            const subIteratorResult = iterator.next();
                            if (subIteratorResult.done === false) {
                                subIterator = mapper(subIteratorResult.value)[prop]();
                            }
                            else {
                                return {
                                    done: true,
                                    value: undefined,
                                };
                            }
                        }
                        const nextValue = subIterator.next();
                        if (nextValue.done === true) {
                            subIterator = null;
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
        },
        reverse() {
            return la({
                [Symbol.iterator]: this[reverseIterator],
                [reverseIterator]: this[Symbol.iterator],
            });
        },
        collect() {
            return Array.from(this);
        },
    };
}
function arrayToIterator(arr) {
    let index = 0;
    return () => {
        if (arr.length == index) {
            return {
                done: true,
                value: undefined,
            };
        }
        else {
            return {
                value: arr[index++],
                done: false,
            };
        }
    };
}
function arrayToReverseIterator(arr) {
    let index = 0;
    return () => {
        if (arr.length == index) {
            return {
                done: true,
                value: undefined,
            };
        }
        else {
            return {
                value: arr[arr.length - index++ - 1],
                done: false,
            };
        }
    };
}
function operatorHelper(lazyArray, callback) {
    lazyArray[Symbol.iterator];
    return forwardReverse(lazyArray, (iterator, _) => {
        return cloneAccessor(iterator, callback);
    });
}
/** Applies the provided function to both forward and reverse iterators */
function forwardReverse(lazyArray, func) {
    const forwardNext = func(lazyArray[Symbol.iterator](), Symbol.iterator);
    const reverseNext = func(lazyArray[reverseIterator](), reverseIterator);
    return la({
        [Symbol.iterator]() {
            return { next: forwardNext };
        },
        [reverseIterator]() {
            return { next: reverseNext };
        },
    });
}
function cloneAccessor(iterator, callback) {
    const next = () => {
        // Consume the parent at consumption time
        while (true) {
            const parentNext = iterator.next();
            if (parentNext.done === true) {
                return parentNext;
            }
            const callbackVal = callback(parentNext.value);
            // If filter is defined, and false, then the item is omitted
            if (callbackVal.filter === undefined || callbackVal.filter === true) {
                return callbackVal.item;
            }
        }
    };
    return next;
}
//# sourceMappingURL=array.js.map