import { simpleHelper } from "./helpers.js";
export function lazyDo(lazyArray, action) {
    return simpleHelper(lazyArray, (val) => {
        action(val);
        return {
            item: {
                done: false,
                value: val,
            },
        };
    });
}
//# sourceMappingURL=do.js.map