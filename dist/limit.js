import { forwardReverseHelper } from "./helpers";
export function lazyLimit(lazyIterator, nValues) {
    let nSeen = 0;
    return forwardReverseHelper(lazyIterator, (iterator) => {
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