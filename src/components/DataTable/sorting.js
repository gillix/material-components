import {get, readonly, writable} from "svelte/store";

let _sorted = writable({});

export function sorted(column) {
    return get(_sorted)?.by === column.key ? get(_sorted) : null;
}

export function setSorted(sorted) {
    _sorted.set(sorted);
}
