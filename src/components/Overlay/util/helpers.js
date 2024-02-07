
import {computed, ref} from "./tools.js";

// Utilities
function convertToUnit(str, unit = 'px') {
    if (str == null || str === '') {
        return undefined;
    }
    else if (isNaN(+str)) {
        return String(str);
    }
    else if (!isFinite(+str)) {
        return undefined;
    }
    else {
        return `${Number(str)}${unit}`;
    }
}
// KeyboardEvent.keyCode aliases
Object.freeze({
    enter: 13,
    tab: 9,
    delete: 46,
    esc: 27,
    space: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    end: 35,
    home: 36,
    del: 46,
    backspace: 8,
    insert: 45,
    pageup: 33,
    pagedown: 34,
    shift: 16,
});
Object.freeze({
    enter: 'Enter',
    tab: 'Tab',
    delete: 'Delete',
    esc: 'Escape',
    space: 'Space',
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    end: 'End',
    home: 'Home',
    del: 'Delete',
    backspace: 'Backspace',
    insert: 'Insert',
    pageup: 'PageUp',
    pagedown: 'PageDown',
    shift: 'Shift',
});
function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}
function destructComputed(getter) {
    const refs = {};
    const base = computed(getter);
    for (const key in base.value) {
        refs[key] = ref(base.value[key]);
    }
    return refs;
}

/** Array.includes but value can be any type */
function includes (arr, val) {
    return arr.includes(val)
}


export { clamp, convertToUnit, destructComputed, includes };
