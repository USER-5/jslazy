import { simpleHelper } from "./helpers";
export function lazyTakeWhile(lazyIterable, predicate) {
    return simpleHelper(lazyIterable, (val) => {
        // If we fail, terminate the iterable
        if (!predicate(val)) {
            return {
                item: {
                    done: true,
                    value: undefined,
                },
            };
        }
        // Otherwise, pass-thru
        return {
            item: {
                done: false,
                value: val,
            },
        };
    });
}
//# sourceMappingURL=takeWhile.js.map