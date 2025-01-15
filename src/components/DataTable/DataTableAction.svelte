<script>
    import Button from "../Button/Button.svelte";
    import Icon from "../Icon/Icon.svelte";
    import Tooltip from "../Tooltip/Tooltip.svelte";
    import {createEventDispatcher} from "svelte";

    let dispatch = createEventDispatcher();

    export let action;

    function click(e) {
        dispatch('action', action.name);
        e.stopPropagation();
    }
</script>
<Tooltip
    message={action.icon ? action.label : ''}
    location="bottom"
    origin="auto"
    offset={10}
    delay={5}
    >
    <Button
        icon={!!action.icon}
        class={(action.color ?? 'grey') + "-text text-darken-2"}
        on:click={click}
        tabindex="-1"
    >
        {#if action.icon}
            <Icon path={action.icon} />
        {:else}
            <span class="text-capitalize">{action.label}</span>
        {/if}
    </Button>
</Tooltip>

<style>
</style>
