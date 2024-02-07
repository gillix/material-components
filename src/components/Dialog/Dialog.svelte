<script>
  import Overlay from '../Overlay';
  import { scale } from 'svelte/transition';

  let klass = '';
  export { klass as class };
  export let active = false;
  export let persistent = false;
  export let disabled = false;
  export let width = '500px';
  export let height = '750px';
  export let fullscreen = false;
  export let transition = scale;
  export let overlay = {};

  function close() {
    if (!persistent) active = false;
  }
  $: visible = active && !disabled;
</script>

<style lang="scss" src="./Dialog.scss" global>
</style>

<Overlay
        {...overlay}
        bind:active={visible}
        on:click={close}
        {persistent}
        class="s-dialog {fullscreen ? 'fullscreen' : ''} {klass}"
        style="--s-dialog-width: {width}; --s-dialog-height: {height};"
>
    <div
      class="s-dialog__content"
      class:fullscreen
      transition:transition={ { duration: 200, start: 0.1 } }
      on:introstart
      on:outrostart
      on:introend
      on:outroend
    >
        <slot />
    </div>
</Overlay>
