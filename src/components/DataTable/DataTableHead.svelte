<script>
    import {createEventDispatcher, getContext, setContext} from 'svelte';
    import DataTableCell from "./DataTableCell.svelte";
    import Checkbox from "../Checkbox/Checkbox.svelte";
    import Icon from "../Icon/Icon.svelte";
    import asc from "../../internal/Icons/asc";
    import desc from "../../internal/Icons/desc";
    import ProgressLinear from "../ProgressLinear/ProgressLinear.svelte";
    import {sorted} from "./sorting.js";
    import {stringify} from "../../internal/Class";
    import defaults from "./defaults.js";
    import {fade} from "svelte/transition";
    import DataTableAction from "./DataTableAction.svelte";

    let dispatch = createEventDispatcher();

    let klass = '';
    export { klass as class };

    export let columns;
    export let actions = false;
    export let loading = false;


    // Selection
    let allSelected = false;

    function selectAll() {
        // TODO: use existing ITEM_GROUP context for selection
    }

    // Sorting
    let invert = (value) => value === 'asc' ? 'desc' : 'asc';

    function sort(column) {
      if (column.sortable && column.title) {
          const _sorted = sorted(column);
          dispatch('sort', {
              by: column.key,
              way: _sorted ? invert(_sorted.way) : (column.sortWay ?? 'asc')
          });
      }
    }


</script>

<tr>
    {#each columns as column}
        <DataTableCell
            tag="th"
            align={column.align || defaults(column, 'align')}
            fixed={column.fixed}
            fixedOffset={column.fixedOffset}
            noPadding={column.key === 'data-table-column-select' || column.key === 'data-table-column-actions' || defaults(column, 'noPadding')}
            height={column.height}
            width={column.width || defaults(column, 'width')}
            noWrap
            class={stringify({
                's-data-table-column--sortable': column.sortable && column.title,
                's-data-table-column--sorted': !!sorted(column),
                's-data-table-column--fixed': column.fixed,
            })}
            on:click={() => sort(column)}
        >
            {#if column.key === 'data-table-column-select'}
                <slot name="header-column-select">
                    <Checkbox checked={allSelected} on:change={selectAll} />
                </slot>
            {:else if column.key === 'data-table-column-actions'}
                <slot name="header-column-actions" />
            {:else}
                <slot name="header-column" {column}>
                    {#if (column.title)}
                        <div class="s-data-table-header__content">
                            <span>{column.title}</span>
                            {#if sorted(column)}
                                <Icon path={sorted(column).way === 'asc' ? asc : desc} size="18px" />
                            {/if}
                        </div>
                    {/if}
                </slot>
            {/if}

        </DataTableCell>
    {/each}
    {#if actions}
        <DataTableCell
            tag="th"
            align="start"
            noPadding
            width="100px"
            noWrap
        />
    {/if}
</tr>
{#if loading}
    <tr class="s-data-table-progress" in:fade={ {duration: 150, delay: 50} } out:fade={ {duration: 100} }>
        <th colspan={columns.length} style="position: relative">
            <slot name="progress">
                <ProgressLinear
                    indeterminate
                    height="2px"
                    color="primary"
                    active
                    style="position: absolute; top: 0; left: 0; right: 0;"
                />
            </slot>
        </th>
    </tr>
{/if}

