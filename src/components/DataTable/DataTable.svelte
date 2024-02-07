<script>
    import Table from "../Table/Table.svelte";
    import DataTableRows from "./DataTableRows.svelte";
    import DataTableHead from "./DataTableHead.svelte";
    import {setSorted} from "./sorting.js";
    import {stringify} from "../../internal/Class";
    import Pagination from "../Pagination/Pagination.svelte";
    import {createEventDispatcher} from "svelte";
    import Divider from "../Divider/Divider.svelte";

    let klass = '';
    export { klass as class };
    export let dense = false;
    export let denser = false;
    export let fixedHeader = false;
    export let height = null;
    export let style = null;
    export let columns = [];
    export let rows = [];
    export let sorted = {};
    export let loading = false;
    export let highlightSorting = false;
    export let pagination = false;
    export let paginationOptions = {};
    export let texts = {
        loading: 'Loading... Please wait',
        noData: 'No data',
        pagination: {
            info: '{from} - {to} of {total}',
            rowsPerPage: 'Rows per page'
        },
    }

    let dispatch = createEventDispatcher();

    $: setSorted(sorted);
</script>

<style lang="sass" src="./DataTable.sass" global>
</style>


<Table
    class={stringify([
        's-data-table',
        klass,
        {
            's-data-table--loading': loading,
            's-data-table--highlight-sorting': highlightSorting
        }
       ])}
    {dense}
    {denser}
    {style}
    {height}
    {fixedHeader}
>
  <slot slot="top" name="top" />
  <thead class="s-data-table__thead">
      <slot name="table-headers" {columns}>
          <DataTableHead
              {columns}
              {loading}
              on:sort
          />
      </slot>
  </thead>
  <tbody class="s-data-table__tbody">
      <slot name="table-rows" {columns} {rows}>
          <DataTableRows
              {columns}
              {rows}
              {loading}
              {texts}
          />
      </slot>
  </tbody>
    <slot slot="bottom" name="bottom">
        <Divider />
        <div class="s-data-table__footer">
            <div class="s-data-table__footer-left">
                <slot name="footer-left"/>
            </div>
            <div class="s-data-table__footer-right">
                <slot name="footer-right">
                    {#if pagination}
                        <Pagination
                            page={pagination.page}
                            total={pagination.total}
                            perPage={pagination.perPage}
                            showPerPageSelect
                            showInfo
                            showEdges={true}
                            showPages={false}
                            pagesMinWindow={3}
                            pagesMaxWindow={4}
                            rounded
                            texts={texts.pagination}
                            {...paginationOptions}
                            on:change={({detail}) => dispatch('pagination', detail)}
                        />
                    {/if}
                </slot>
            </div>
        </div>
    </slot>
</Table>
