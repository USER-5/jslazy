import { simpleHelper } from "./helpers.js";
export function lazyMap(lazyArray, mapper) {
    return simpleHelper(lazyArray, (val) => ({
        item: {
            done: false,
            value: mapper(val),
        },
    }));
}
//# sourceMappingURL=map.js.map