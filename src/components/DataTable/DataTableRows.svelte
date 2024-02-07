<script>

    import {DataTableRow} from "./index.js";

    export let columns;
    export let rows;
    export let loading;
    export let texts = {
        loading: 'Loading...',
        noData: 'No data'
    };
    export let hideNoData = false;
</script>

{#if (loading && (!rows.length || $$slots.loading))}
    <tr
        class="s-data-table-rows-loading"
        key="loading"
    >
        <td colspan={ columns.length }>
            <slot name="loading">
                {texts.loading}
            </slot>
        </td>
    </tr>
{/if}
{#if (!loading && !rows.length && !hideNoData)}
    <tr
        class="s-data-table-rows-empty"
        key="empty"
    >
        <td colspan={ columns.length }>
            <slot name="no-data">
                {texts.noData}
            </slot>
        </td>
    </tr>
{/if}
{#if rows.length}
    {#each rows as row}
        <slot name="row" {row}>
            <DataTableRow
                    {columns}
                    {row}
            />
        </slot>
    {/each}
{/if}
