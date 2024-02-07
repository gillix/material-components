<script>

    import Icon from "../Icon/Icon.svelte";
    import Chip from "../Chip/Chip.svelte";
    import {stringify} from "../../internal/Class";
    import Tooltip from "../Tooltip/Tooltip.svelte";

    export let type = 'string';
    export let value;
</script>

{#if (Array.isArray(value))}
    <div class="s-data-table-value__sequence">
        {#each value as item}
            <svelte:self {type} value={item} />
        {/each}
    </div>
{:else if (type === 'icon')}
    {#if (typeof value === 'string')}
        <Icon path={value} />
    {:else if (typeof value === 'object')}
        <Tooltip message={value.tooltip ?? null}>
            <Icon path={value.path} style="color: {value.color};" size={value.size ?? '24px'} />
        </Tooltip>
    {/if}
{:else if (type === 'chip')}
    <Chip label class={stringify(value?.class ?? '')}>
        <svelte:self {value} />
    </Chip>
{:else if (type === 'url')}
    <a href={value.url} target={value.blank ? '_blank' : false}>{value.value}</a>
{:else if (typeof value === 'object')}
    <div class="s-data-table-value__complex">
        {#if (value.prepend)}
            <svelte:self type="icon" value={value.prepend} />
        {/if}
        <Tooltip message={value.tooltip ?? null} location={value['tooltip-location'] ?? 'top'}>
            <span class="content">
                {#if (value.prefix)}
                    <span class="prefix"><svelte:self value={value.prefix} /></span>
                {/if}
                <span class="value">{value.value}</span>
                {#if (value.suffix)}
                    <span class="suffix"><svelte:self value={value.suffix} /></span>
                {/if}
            </span>
        </Tooltip>
        {#if (value.append)}
            <svelte:self type="icon" value={value.append} />
        {/if}
    </div>
{:else}
    {value}
{/if}
