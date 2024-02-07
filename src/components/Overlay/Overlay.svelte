<script>
    import { fade } from 'svelte/transition';
    import BackgroundColor from '../../internal/BackgroundColor';
    import container from './container.js';
    import {useLocationStrategies} from "./locationStrategies";
    import { ref } from './util/tools';
    import {useScrollStrategies} from "./scrollStrategies";
    import {onMount, tick} from "svelte";
    import {writable} from "svelte/store";


    let klass = '';
    export let transition = fade;
    export let inOpts = { duration: 100 };
    export let outOpts = { duration: 100 };
    export let active = false;
    export let opacity = 0.46;
    export let color = 'rgb(33, 33, 33)';
    export let index = 5000;
    export let absolute = false;
    export let style = '';
    export let persistent = false;
    export { klass as class };

    export let location = 'bottom'; // 'top' | 'bottom' | 'start' | 'end';
    export let offset = 0;
    export let origin = 'auto';
    export let scroll = 'block';
    export let scrim = true;

    export let activator = null;
    let contentEl = null;
    let root;

    let props, contentStyles, updateLocation;
    let show = writable(active);
    $: show.set(active);
    $: active = $show;

    const init = () =>
    {
        tick().then(() => {

            props = {
                locationStrategy: activator ? 'connected' : 'static',
                location: location,
                origin: origin,
                offset: offset,
                scroll: scroll
            };
            ({contentStyles, updateLocation} = useLocationStrategies(props, {
                isRtl: ref(false),
                contentEl: ref(contentEl),
                target: ref(activator),
                isActive: show,
                lifecycle: lifecycle,
            }))

            useScrollStrategies(props, {
                root: ref(root),
                contentEl: ref(contentEl),
                target: ref(activator),
                isActive: show,
                updateLocation,
                lifecycle: lifecycle,
            })
        })
    };



    function onClickOutside () {
        if (!persistent) {
            $show = false;
        }
    }

    let contentStyle = '';

    $: if (contentStyles){
        contentStyle = '';
        Object.entries($contentStyles).forEach(([p, v]) => {
            contentStyle += `${p}:${v};`;
        });
    }

    $: if ($show) {
        init();
    }


    let lifecycle = {
        activators: [],
        deactivators: [],
        node: null,
        onActivate: function (func) {
            if (this.node !== null) {
                func(this.node);
            } else {
                this.activators.push(func);
            }
        },
        onDeactivate: function (func) {
            this.deactivators.push(func)
        },
        activate: function (node) {
            this.node = node;
            this.activators.forEach(func => func(node));
            this.activators = [];
        },
        deactivate: function (node) {
            this.deactivators.forEach(func => func(node));
            this.deactivators = [];
            this.node = null;
        }
    }

    let lifecycleControl = (node) => {
        tick().then(() => {
            lifecycle.activate(node);
        })
        return {
            destroy() {
                lifecycle.deactivate(node)
            }
        }

    };

</script>

<style lang="scss" src="./Overlay.scss">
</style>


{#if $show}
    <div
        in:transition={inOpts}
        out:transition={outOpts}
        class="s-overlay {klass}"
        class:absolute
        on:click
        on:keypress
        style="z-index:{index};{style}"
        use:container={'.s-app'}
        bind:this={root}
    >
        {#if (scrim)}
            <div class="s-overlay__scrim" use:BackgroundColor={color} style="opacity:{opacity}" />
        {/if}
        <div
            class="s-overlay__content"
            bind:this={contentEl}
            style="{contentStyle}"
            use:lifecycleControl
            on:clickOutside={onClickOutside}
        >
            <slot />
        </div>
    </div>
{/if}
