<script>
  import DataTableCell from "./DataTableCell.svelte";
  import Checkbox from "../Checkbox/Checkbox.svelte";
  import DataTableValueFormat from "./DataTableValueFormat.svelte";
  import defaults from "./defaults.js";
  import {stringify} from "../../internal/Class/index.js";
  import {sorted} from "./sorting.js";
  import {createEventDispatcher} from "svelte";

  let klass = '';
  export { klass as class };

  export let clickable = false;
  export let hover = false;
  export let columns;
  export let row;

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
        noPadding={column.noPadding || column.key === 'data-table-colum-select' || defaults(column, 'noPadding')}
        width={column.width || defaults(column, 'width')}
        height={column.height}
        noWrap={column.noWrap || defaults(column, 'noWrap')}
        class={stringify({
            's-data-table-column--sorted': !!sorted(column),
        })}

    >
        {#if (column.key === 'data-table-colum-select')}
            <Checkbox checked={row.selected} />
        {/if}
        <slot name="cell" {column} value={row[column.key]} >
            <DataTableValueFormat type={column.type} value={row.values[column.key]} />
        </slot>

    </DataTableCell>

  {/each}
</tr>
