<script context="module">
  export const SLIDE_GROUP = {};
</script>

<script>
  import { setContext, afterUpdate } from 'svelte';
  import ItemGroup from '../ItemGroup';
  import prevIcon from '../../internal/Icons/prev';
  import nextIcon from '../../internal/Icons/next';
  import Icon from '../Icon';

  let contentWidth;
  let wrapperWidth;

  let klass = '';
  export { klass as class };
  export let showArrows = true;
  export let hideDisabledArrows = false;
  export let centerActive = false;
  export let activeClass = '';
  export let value = [];
  export let multiple = false;
  export let mandatory = false;
  export let max = Infinity;

  let x = 0;
  setContext(SLIDE_GROUP, (item) => {
    const left = item.offsetLeft;
    const width = item.offsetWidth;

    if (centerActive) x = left + (width - wrapperWidth) / 2;
    else if (left + 1.25 * width > wrapperWidth + x) {
      x = left + 1.25 * width - wrapperWidth;
    } else if (left < x + width / 4) {
      x = left - width / 4;
    }
  });

  afterUpdate(() => {
    if (x + wrapperWidth > contentWidth) x = contentWidth - wrapperWidth;
    else if (x < 0) x = 0;
  });

  function next() {
    x += wrapperWidth;
  }

  function prev() {
    x -= wrapperWidth;
  }

  let touchStartX;
  function touchstart({ touches }) {
    touchStartX = x + touches[0].clientX;
  }

  function touchmove({ touches }) {
    x = touchStartX - touches[0].clientX;
  }

  $: arrowsVisible = wrapperWidth < contentWidth && showArrows;
</script>

<style lang="scss" src="./SlideGroup.scss" global>:global(.s-slide-group){display:flex}:global(.s-slide-group__content){display:flex;flex:1 0 auto;position:relative;transition:.3s cubic-bezier(.25,.8,.5,1);white-space:nowrap}:global(.s-slide-group__wrapper){contain:content;display:flex;flex:1 1 auto;overflow:hidden;touch-action:none}:global(.s-slide-group__next),:global(.s-slide-group__prev){align-items:center;display:flex;flex:0 1 52px;justify-content:center;min-width:52px;cursor:pointer}:global(.s-slide-group__next.disabled),:global(.s-slide-group__prev.disabled){pointer-events:none;opacity:.5}:global(.s-slide-group__next.disabled.hide-disabled-arrows),:global(.s-slide-group__prev.disabled.hide-disabled-arrows){visibility:hidden;opacity:0}</style>

<ItemGroup
  class="s-slide-group {klass}"
  on:change
  bind:value
  {activeClass}
  {multiple}
  {mandatory}
  {max}>
  {#if arrowsVisible}
    <div
      class="s-slide-group__prev"
      class:disabled={x === 0}
      class:hide-disabled-arrows={hideDisabledArrows}
      on:click={prev}>
      <slot name="previous">
        <Icon path={prevIcon} />
      </slot>
    </div>
  {/if}
  <div
    class="s-slide-group__wrapper"
    on:touchstart|passive={touchstart}
    on:touchmove|passive={touchmove}
    bind:clientWidth={wrapperWidth}>
    <div
      class="s-slide-group__content"
      style="transform:translate(-{x}px)"
      bind:clientWidth={contentWidth}>
      <slot />
    </div>
  </div>
  {#if arrowsVisible}
    <div
      class="s-slide-group__next"
      class:disabled={x === contentWidth - wrapperWidth}
      class:show-arrows={hideDisabledArrows}
      on:click={next}>
      <slot name="next">
        <Icon path={nextIcon} />
      </slot>
    </div>
  {/if}
</ItemGroup>
