<script>
  import DataTableCell from "./DataTableCell.svelte";
  import Checkbox from "../Checkbox/Checkbox.svelte";
  import DataTableValueFormat from "./DataTableValueFormat.svelte";
  import defaults from "./defaults.js";
  import {stringify} from "../../internal/Class/index.js";
  import {sorted} from "./sorting.js";
  import {createEventDispatcher} from "svelte";
  import DataTableAction from "./DataTableAction.svelte";

  let klass = '';
  export { klass as class };

  export let clickable = false;
  export let hover = false;
  export let columns;
  export let row;
  export let actions = false;
  export let texts;

  const dispatch = createEventDispatcher();

  function onRowClick() {
      if (clickable) {
          if (clickable instanceof Function) {
              clickable(row);
          } else {
              dispatch('rowClick', row);
          }
      }
  }

  function onAction({detail: action}) {
      dispatch('action', {
          action: action,
          row: row,
      });
  }

  // TODO: use existing ITEM_GROUP context for selection
</script>

<tr
    class={stringify([
        's-data-table-row',
        klass,
        {
            's-data-table__tr--highlight-hover': !!hover,
            's-data-table__tr--clickable': !!clickable,
        }
    ])}
    on:click={onRowClick}
>
    {#each columns as column}
        <DataTableCell
            align={column.align || defaults(column, 'align')}
            fixed={column.fixed}
            fixedOffset={column.fixedOffset}
            noPadding={column.noPadding || column.key === 'data-table-column-select' || defaults(column, 'noPadding')}
            width={column.width || defaults(column, 'width')}
            height={column.height}
            noWrap={column.noWrap || defaults(column, 'noWrap')}
            class={stringify({
                's-data-table-column--sorted': !!sorted(column),
            })}

        >
            {#if (column.key === 'data-table-column-select')}
                <Checkbox checked={row.selected} />
            {/if}
            <slot name="cell" {column} value={row[column.key]} >
                <DataTableValueFormat type={column.type} value={row.values[column.key]} {texts} />
            </slot>

        </DataTableCell>
    {/each}
    {#if actions}
        <DataTableCell
            align="start"
            noPadding
            width="100px"
            noWrap
        >
            <slot name="actions-cell" {actions} {row}>
                {#if row.actions}
                    <div class="s-data-table-row-actions">
                        {#each row.actions as action}
                            <div class="s-data-table-row-action">
                                <DataTableAction action={actions[action]} on:action={onAction} />
                            </div>
                        {/each}
                    </div>
                {/if}
            </slot>

        </DataTableCell>
    {/if}

</tr>
<style>
    .row-actions {
        display: flex;
    }
    .row-action {
        opacity: 0;
        transition: opacity .15s;
    }
</style>
