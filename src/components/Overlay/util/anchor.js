import { includes } from './helpers';

// Utilities
const block = ['top', 'bottom'];
const inline = ['start', 'end', 'left', 'right'];
/** Parse a raw anchor string into an object */
function parseAnchor(anchor, isRtl) {
    let [side, align] = anchor.split(' ');
    if (!align) {
        align =
            includes(block, side) ? 'start'
                : includes(inline, side) ? 'top'
                    : 'center';
    }
    return {
        side: toPhysical(side, isRtl),
        align: toPhysical(align, isRtl),
    };
}
function toPhysical(str, isRtl) {
    if (str === 'start')
        return isRtl ? 'right' : 'left';
    if (str === 'end')
        return isRtl ? 'left' : 'right';
    return str;
}
function flipSide(anchor) {
    return {
        side: {
            center: 'center',
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left',
        }[anchor.side],
        align: anchor.align,
    };
}
function flipAlign(anchor) {
    return {
        side: anchor.side,
        align: {
            center: 'center',
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left',
        }[anchor.align],
    };
}
function flipCorner(anchor) {
    return {
        side: anchor.align,
        align: anchor.side,
    };
}
function getAxis(anchor) {
    return includes(block, anchor.side) ? 'y' : 'x';
}

export { flipAlign, flipCorner, flipSide, getAxis, parseAnchor, toPhysical };
