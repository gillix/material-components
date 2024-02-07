import {tick} from "svelte";

export async function fetchElement(target) {
    let targetEl;

    if (typeof target === "string") {
        targetEl = document.querySelector(target);
        if (targetEl === null) {
            await tick();
            targetEl = document.querySelector(target);
        }
        if (targetEl === null) {
            throw new Error(
                `No element found matching css selector: "${target}"`
            );
        }
    } else if (target instanceof HTMLElement || target instanceof ShadowRoot) {
        targetEl = target;
    } else {
        throw new TypeError(
            `Unknown portal target type: ${
                target === null ? "null" : typeof target
            }. Allowed types: string (CSS selector) or HTMLElement.`
        );
    }

    if (targetEl.shadowRoot) {
        targetEl = targetEl.shadowRoot;
    }

    return targetEl;
}

export default function (el, target = "body") {

    async function update(newTarget) {
        let targetEl;
        target = newTarget;
        targetEl = await fetchElement(target);
        targetEl.appendChild(el);
        el.hidden = false;
    }

    function destroy() {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }

    update(target);
    return {
        update,
        destroy,
    };
}
