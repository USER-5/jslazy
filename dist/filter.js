import { simpleHelper } from "./helpers.js";
export function lazyFilter(lazyIterable, filterFunction) {
    return simpleHelper(lazyIterable, (val) => ({
        filter: filterFunction(val),
        item: {
            done: false,
            value: val,
        },
    }));
}
//# sourceMappingURL=filter.js.map