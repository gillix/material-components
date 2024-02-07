import {fetchElement} from "../../utils/teleport.js";

export default function (el, target = "body") {
    let autoCreated = false;

    async function update(newTarget) {
        target = newTarget;

        let targetEl  = await fetchElement(target);

        let container = targetEl.querySelector('.s-overlay__container');
        if (container === null) {
            container = document.createElement('div');
            container.classList.add('s-overlay__container');
            targetEl.appendChild(container);
            autoCreated = true;
        }
        container.appendChild(el);
        el.hidden = false;
    }

    function destroy() {
        const parent = el.parentNode;
        if (parent) {
            parent.removeChild(el);
            if (autoCreated && parent.children.length === 0) {
                parent.remove();
                autoCreated = false;
            }
        }
    }

    update(target);
    return {
        update,
        destroy,
    };
}
