<script>
  import { slide } from 'svelte/transition';
  import { onMount, setContext } from 'svelte';
  import ListItem from './ListItem.svelte';
  import Style from '../../internal/Style';

  let klass = 'primary-text';
  export { klass as class };
  export let activatorClass = '';
  export let activatorProps = {};
  export let active = true;
  export let eager = false;
  export let transition = slide;
  export let transitionOpts = {};
  export let offset = null;
  export let disabled = null;
  export let ripple = {};
  export let style = null;

  setContext('S_ListItemRipple', ripple);

  function toggle() {
    active = !active;
    const tempOffSet = offset;
    offset += 0.0001;
    offset = tempOffSet;
  }

  if (eager) {
    const tempActive = active;
    active = true;
    onMount(() => {
      active = tempActive;
    });
  }
</script>

<style lang="scss" src="./ListGroup.scss" global>:global(.s-list-group){flex:0 1 auto;position:relative;max-width:100%}:global(.s-list-group.disabled){pointer-events:none;color:var(--theme-text-disabled)}:global(.s-list-group__activator.active:not(:hover):not(:focus):before){opacity:0}:global(.s-list-group__items.offset) :global(.s-list-item){padding-left:var(--s-list-group-offset)!important}</style>

<div class="s-list-group {klass}">
  <ListItem
    class="s-list-group__activator {activatorClass}"
    {active}
    {...activatorProps}
    on:click={toggle}>
    <slot slot="prepend" name="prepend" />
    <slot name="activator" />
    <slot slot="append" name="append" />
  </ListItem>
  {#if active}
    <div
      transition:transition={transitionOpts}
      on:introstart
      on:outrostart
      on:introend
      on:outroend
      aria-disabled={disabled}
      class="s-list-group__items"
      class:offset
      {style}
      use:Style={{ 'list-group-offset': offset }}>
      <slot />
    </div>
  {/if}
</div>
