const R_ITER = Symbol.for("REVERSE ITERATOR");
/**
 * Creates a lazy array from a standard array.
 *
 * This is still in early development, and is subject to change.
 */
export function lazy(source) {
    return {
        [Symbol.iterator]() {
            return {
                next: Array.isArray(source)
                    ? arrayToIterator(source)
                    : source[Symbol.iterator]().next,
            };
        },
        [R_ITER]() {
            return {
                next: Array.isArray(source)
                    ? arrayToReverseIterator(source)
                    : source[R_ITER]().next,
            };
        },
        filter(filterFunction) {
            return simpleHelper(this, (val) => ({
                filter: filterFunction(val),
                item: {
                    done: false,
                    value: val,
                },
            }));
        },
        do(action) {
            return simpleHelper(this, (val) => {
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
            return simpleHelper(this, (val) => ({
                item: {
                    done: false,
                    value: mapper(val),
                },
            }));
        },
        flatMap(mapper) {
            return forwardReverseHelper(this, (iterator, prop) => {
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
        limit(nValues) {
            let nSeen = 0;
            return forwardReverseHelper(this, (iterator) => {
                return () => {
                    if (nSeen < nValues) {
                        nSeen += 1;
                        return iterator.next();
                    }
                    else {
                        return {
                            done: true,
                            value: undefined,
                        };
                    }
                };
            });
        },
        reverse() {
            return lazy({
                [Symbol.iterator]: this[R_ITER],
                [R_ITER]: this[Symbol.iterator],
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
function simpleHelper(lazyArray, callback) {
    return forwardReverseHelper(lazyArray, (iterator, _) => {
        return cloneAccessor(iterator, callback);
    });
}
/** Applies the provided function to both forward and reverse iterators */
function forwardReverseHelper(lazyArray, func) {
    const forwardNext = func(lazyArray[Symbol.iterator](), Symbol.iterator);
    const reverseNext = func(lazyArray[R_ITER](), R_ITER);
    return lazy({
        [Symbol.iterator]() {
            return { next: forwardNext };
        },
        [R_ITER]() {
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