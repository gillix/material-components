function getScrollParents(el, stopAt) {
    const elements = [];
    if (stopAt && el && !stopAt.contains(el))
        return elements;
    while (el) {
        if (hasScrollbar(el))
            elements.push(el);
        if (el === stopAt)
            break;
        el = el.parentElement;
    }
    return elements;
}
function hasScrollbar(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE)
        return false;
    const style = window.getComputedStyle(el);
    return style.overflowY === 'scroll' || (style.overflowY === 'auto' && el.scrollHeight > el.clientHeight);
}

export { getScrollParents, hasScrollbar };
