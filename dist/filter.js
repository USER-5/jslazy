import { simpleHelper } from "./helpers";
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