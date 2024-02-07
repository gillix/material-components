<script>
  import Style  from "../../internal/Style";


  let klass = '';
  export let dense = false;
  export let denser = false;
  export let fixedHeader = false;
  export let height = null;
  export let style = null;
  export { klass as class };
</script>

<style lang="sass" src="./Table.sass" global>
</style>

<div
      class="s-table {klass}"
      {style}
      class:dense
      class:denser
      class:fixed-header={fixedHeader}
      class:fixed-height={!!height}
>
  <slot name="top"/>

  <div class="s-table__wrapper" use:Style={[{height}, true]}>
    <table>
      <slot />
    </table>
  </div>

  <slot name="bottom"/>

</div>
