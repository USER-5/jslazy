import { reverseHelper } from "./lazyIterable";
export function lazyLimit(lazyIterator, nValues) {
    let nSeen = 0;
    return reverseHelper(lazyIterator, (iterator) => {
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
}
//# sourceMappingURL=limit.js.map