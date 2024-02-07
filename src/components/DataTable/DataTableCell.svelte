<script>
    import style, {stringify} from '../../internal/Style';

  let klass = '';
  export { klass as class };

  export let tag = 'td';
  export let align = 'start';
  export let fixed = false;
  export let fixedOffset = 0;
  export let noPadding = false;
  export let noWrap = false;
  export let height = null;
  export let width = null;

</script>

<!--<style lang="scss" src="./DataTableCell.scss" global>-->
<!--</style>-->

<svelte:element
        this={tag}
        class="s-data-table__{tag} {klass} s-data-table-column--align-{align}"
        class:s-table-column--no-padding={noPadding}
        class:s-table-column--no-wrap={noWrap}
        class:s-table-column--fixed={fixed}
        style={stringify({
            height,
            'width': width,
            left: fixedOffset || null
        })}
        on:click
>
    <slot />
</svelte:element>
