<script>
  import ClickOutside from '../../actions/ClickOutside';
  import { onMount, setContext, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  let klass = '';
  export { klass as class };
  export let active = false;
  export let absolute = false;
  export let transition = fade;
  export let inOpts = { duration: 250 };
  export let outOpts = { duration: 200 };
  export let offsetX = false;
  export let offsetY = true;
  export let nudgeX = 0;
  export let nudgeY = 0;
  export let openOnClick = true;
  export let hover = false;
  export let closeOnClickOutside = true;
  export let closeOnClick = true;
  export let bottom = false;
  export let right = false;
  export let tile = false;
  export let disabled = false;
  export let index = 8;
  export let style = '';

  let origin = 'top left';
  let position;
  let wrapper;
  const dispatch = createEventDispatcher();
  const align = { x: right ? 'right' : 'left', y: bottom ? 'bottom' : 'top' };

  setContext('S_ListItemRole', 'menuitem');
  setContext('S_ListItemRipple', true);

  // For opening the menu
  function open(posX = 0, posY = 0) {
    active = true;
    const rect = wrapper.getBoundingClientRect();
    let x = nudgeX;
    let y = nudgeY;
    if (absolute) {
      x += posX;
      y += posY;
    } else {
      if (offsetX) x += rect.width;
      if (offsetY) y += rect.height;
    }

    position = `${align.y}:${y}px;${align.x}:${x}px`;
    origin = `${align.y} ${align.x}`;
    /**
     * Event when menu is opened.
     * @returns Nothing
     */
    dispatch('open');
  }

  // For closing the menu.
  function close() {
    active = false;
    /**
     * Event when menu is closed.
     * @returns Nothing
     */
    dispatch('close');
  }

  // When the activator slot is clicked.
  function triggerClick(e) {
    if (!disabled) {
      if (active) {
        close();
      } else if (openOnClick) {
        open(e.offsetX, e.offsetY);
      }
    }
  }

  // When the menu itself is clicked.
  function menuClick() {
    if (active && closeOnClick) close();
  }

  // When user clicked somewhere outside the menu.
  function clickOutsideMenu() {
    if (active && closeOnClickOutside) close();
  }

  onMount(() => {
    const trigger = wrapper.querySelector("[slot='activator']");
    // Opening the menu if active is set to true.
    if (active) open();

    trigger.addEventListener('click', triggerClick, { passive: true });
    if (hover) {
      wrapper.addEventListener('mouseenter', open, { passive: true });
      wrapper.addEventListener('mouseleave', close, { passive: true });
    }

    return () => {
      trigger.removeEventListener('click', triggerClick);
      if (hover) {
        wrapper.removeEventListener('mouseenter', open);
        wrapper.removeEventListener('mouseleave', close);
      }
    };
  });
</script>

<style lang="scss" src="./Menu.scss" global>:global(.s-menu__wrapper){position:relative;display:inline-flex;justify-content:center;align-items:center}:global(.s-menu__wrapper) :global([slot=activator]){width:100%}:global(.s-menu){background-color:var(--theme-surface);backface-visibility:hidden;position:absolute;contain:content;max-height:350px;overflow:auto;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}:global(.s-menu:not(.tile)){border-radius:4px}</style>

<div
  class="s-menu__wrapper"
  bind:this={wrapper}
  use:ClickOutside
  on:clickOutside={clickOutsideMenu}>
  <!-- Slot for the trigger/activator. -->
  <slot name="activator" />

  {#if active}
    <div
      class="s-menu {klass}"
      role="menu"
      class:tile
      on:click={menuClick}
      in:transition={inOpts}
      out:transition={outOpts}
      style="{position};transform-origin:{origin};z-index:{index};{style}">
      <slot />
    </div>
  {/if}
</div>
