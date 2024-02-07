<script>
  import BackgroundColor from '../../internal/BackgroundColor';
  import Overlay from "../Overlay/Overlay.svelte";
  import {fade} from "svelte/transition";

  let klass = '';
  export { klass as class };
//  export let color = 'default';
  export let active = false;
  export let message = '';

  export let location = 'bottom'; // 'top' | 'bottom' | 'start' | 'end' | 'center;
  export let offset = 10;
  export let origin = 'auto';
  export let transition = fade;
  export let delay = 0;

  let activator;
  let timer = null;
  let enabled = !!message || !!$$slots.tip;

  const handleMouseEnter = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
          active = true;
          timer = null;
      }, delay);
  };

  const handleMouseLeave = () => {
      if (timer) clearTimeout(timer);
      active = false;
  };

</script>

<style lang="scss" src="./Tooltip.scss" global>
</style>

<div
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    bind:this={activator}
    class="s-tooltip__wrapper"
    class:enabled
>
  <!-- Slot for the element that display the tooltip -->
    <slot />
</div>
{#if enabled}
    <Overlay
        class="s-tooltip {klass}"
        {activator}
        location={ location.split(' ').length > 1 ? location : `${location} center` }
        {offset}
        {origin}
        {transition}
        bind:active
        scrim={false}
        persistent
        absolute
        inOpts={ {duration: 200} }
    >
        <!-- Slot for the content of the tooltip -->
        <slot name="tip">
            {message}
        </slot>
    </Overlay>
{/if}
