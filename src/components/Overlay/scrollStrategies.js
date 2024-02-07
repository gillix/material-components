import { requestNewFrame } from './requestNewFrame.js';
import { getScrollParents, hasScrollbar } from './util/getScrollParent.js';
import { IN_BROWSER } from './util/globals.js';
import { convertToUnit } from './util/helpers.js';

// Utilities
const scrollStrategies = {
    none: null,
    close: closeScrollStrategy,
    block: blockScrollStrategy,
    reposition: repositionScrollStrategy,
};
function useScrollStrategies(props, data) {
    if (!IN_BROWSER)
        return;
    {
        if (typeof props.scrollStrategy === 'function') {
            props.scrollStrategy(data, props, scope);
        }
        else {
            scrollStrategies[props.scrollStrategy]?.(data, props, scope);
        }
    }
}
function closeScrollStrategy(data) {
    function onScroll(e) {
        data.isActive.set(false);
    }
    bindScroll(data.targetEl.value ?? data.contentEl.value, onScroll);
}
function blockScrollStrategy(data, props) {
    const offsetParent = data.root.value?.offsetParent;
    const scrollElements = [...new Set([
            ...getScrollParents(data.targetEl.value, props.contained ? offsetParent : undefined),
            ...getScrollParents(data.contentEl.value, props.contained ? offsetParent : undefined),
        ])].filter(el => !el.classList.contains('v-overlay-scroll-blocked'));
    const scrollbarWidth = window.innerWidth - document.documentElement.offsetWidth;
    const scrollableParent = (el => hasScrollbar(el) && el)(offsetParent || document.documentElement);
    if (scrollableParent) {
        data.root.value.classList.add('v-overlay--scroll-blocked');
    }
    scrollElements.forEach((el, i) => {
        el.style.setProperty('--v-body-scroll-x', convertToUnit(-el.scrollLeft));
        el.style.setProperty('--v-body-scroll-y', convertToUnit(-el.scrollTop));
        if (el !== document.documentElement) {
            el.style.setProperty('--v-scrollbar-offset', convertToUnit(scrollbarWidth));
        }
        el.classList.add('v-overlay-scroll-blocked');
    });
    data.lifecycle.onDeactivate(() => {
        scrollElements.forEach((el, i) => {
            const x = parseFloat(el.style.getPropertyValue('--v-body-scroll-x'));
            const y = parseFloat(el.style.getPropertyValue('--v-body-scroll-y'));
            el.style.removeProperty('--v-body-scroll-x');
            el.style.removeProperty('--v-body-scroll-y');
            el.style.removeProperty('--v-scrollbar-offset');
            el.classList.remove('v-overlay-scroll-blocked');
            el.scrollLeft = -x;
            el.scrollTop = -y;
        });
        if (scrollableParent) {
            data.root.value.classList.remove('v-overlay--scroll-blocked');
        }
    });
}
function repositionScrollStrategy(data, props) {
    let slow = false;
    let raf = -1;
    let ric = -1;
    function update(e) {
        requestNewFrame(() => {
            const start = performance.now();
            data.updateLocation.value?.(e);
            const time = performance.now() - start;
            slow = time / (1000 / 60) > 2;
        });
    }
    ric = (typeof requestIdleCallback === 'undefined' ? (cb) => cb() : requestIdleCallback)(() => {
        //    scope.run(() => {
        bindScroll(data.targetEl.value ?? data.contentEl.value, e => {
            if (slow) {
                // If the position calculation is slow,
                // defer updates until scrolling is finished.
                // Browsers usually fire one scroll event per frame so
                // we just wait until we've got two frames without an event
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    raf = requestAnimationFrame(() => {
                        update(e);
                    });
                });
            }
            else {
                update(e);
            }
        }, data.lifecycle);
        //  })
    });
    data.lifecycle.onDeactivate(() => {
        typeof cancelIdleCallback !== 'undefined' && cancelIdleCallback(ric);
        cancelAnimationFrame(raf);
    });
}
/** @private */
function bindScroll(el, onScroll, lifecycle) {
    const scrollElements = [document, ...getScrollParents(el)];
    scrollElements.forEach(el => {
        el.addEventListener('scroll', onScroll, { passive: true });
    });
    lifecycle.onDeactivate(() => {
        scrollElements.forEach(el => {
            el.removeEventListener('scroll', onScroll);
        });
    });
}

export { useScrollStrategies };
