<script>

    import Icon from "../Icon/Icon.svelte";
    import Chip from "../Chip/Chip.svelte";
    import {stringify} from "../../internal/Class";
    import Tooltip from "../Tooltip/Tooltip.svelte";
    import {format} from './datetime.js'

    export let type = 'string';
    export let value;
    export let texts;
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
    <a href={value.url} target={value.blank ? '_blank' : '_self'} on:click|capture={e => e.stopPropagation()}>{value.value}</a>
{:else if (type === 'date')}
    {#if (typeof value === 'object')}
        {format.date(value.date, value.locale ?? texts.locale, value.format ?? 'long')}
    {:else }
        {format.date(value, texts.locale)}
    {/if}
{:else if (type === 'time')}
    {#if (typeof value === 'object')}
        {format.time(value.time, value.locale ?? texts.locale, value.format ?? 'long')}
    {:else }
        {format.time(value, texts.locale)}
    {/if}
{:else if (type === 'datetime')}
    {#if (typeof value === 'object')}
        <svelte:self value={{
            value: format.date(value.date, value.locale ?? texts.locale, value.dateFormat ?? 'long'),
            suffix: format.time(value.date, value.locale ?? texts.locale, value.timeFormat ?? 'short')
        }} />
    {:else }
        <svelte:self value={{
            value: format.date(value, texts.locale),
            suffix: format.time(value, texts.locale)
        }} />
    {/if}
{:else if (typeof value === 'object')}
    <div class="s-data-table-value__complex">
        {#if (value.prepend)}
            <svelte:self type="icon" value={value.prepend}/>
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
