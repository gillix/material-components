import {writable, get} from "svelte/store";

export function computed(func) {
    return {
        get value() { return func() },
    }
}

export function ref(val) {
    return {
        val: writable(val),
        get value() { return get(this.val) },
        set value(v) { this.val.set(v) },
        assign(vals) {
            if (vals instanceof Object && (this.value instanceof Object)) {
                let obj = this.value;
                Object.assign(obj, vals);
                this.val.set(obj);
            }
        }
    }
}



