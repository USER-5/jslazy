import { simpleHelper } from "./helpers";
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