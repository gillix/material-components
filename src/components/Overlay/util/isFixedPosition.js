function isFixedPosition(el) {
    while (el) {
        if (window.getComputedStyle(el).position === 'fixed') {
            return true;
        }
        el = el.offsetParent;
    }
    return false;
}

export { isFixedPosition };
