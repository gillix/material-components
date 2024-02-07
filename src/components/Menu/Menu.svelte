<script>
  import ClickOutside from '../../actions/ClickOutside';
  import {onMount, setContext, createEventDispatcher, tick} from 'svelte';
  import { fade } from 'svelte/transition';
  import { portal } from 'svelte-portal';
  import {Overlay} from '../Overlay';

  let klass = '';
  export { klass as class };
  export let active = false;
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
  export let overlay = {};

  let origin = 'top left';
  let position;
  let wrapper;
  const dispatch = createEventDispatcher();
  const align = { x: right ? 'right' : 'left', y: bottom ? 'bottom' : 'top' };

  setContext('S_ListItemRole', 'menuitem');
  setContext('S_ListItemRipple', true);

  // For opening the menu
  function open() {
    active = true;
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
          e.preventDefault();
          close();
      } else if (openOnClick) {
          open();
      }
    }
  }

  // When the menu itself is clicked.
  function menuClick() {
    if (active && closeOnClick) close();
  }


  let activator = null;

  onMount(() => {
      tick().then(() => {
          activator = wrapper.querySelector("[slot='activator']");
          activator.addEventListener('click', triggerClick);

          if (hover) {
              wrapper.addEventListener('mouseenter', open, { passive: true });
              wrapper.addEventListener('mouseleave', close, { passive: true });
          }

      })

    return () => {
      activator.removeEventListener('click', triggerClick);

      if (hover) {
        wrapper.removeEventListener('mouseenter', open);
        wrapper.removeEventListener('mouseleave', close);
      }
    };
  });
</script>

<style lang="scss" src="./Menu.scss" global>
</style>

<div
  class="s-menu__wrapper"
  bind:this={wrapper}
>
  <!-- Slot for the trigger/activator. -->
  <slot name="activator" />

<Overlay
        {...overlay}
        bind:active
        persistent={!closeOnClickOutside}
        activator={activator}
        scrim={false}
>
    <div
      class="s-menu {klass}"
      role="menu"
      class:tile
      aria-controls="menu"
      on:click={menuClick}
      style="z-index:{index};{style}"
    >
      <slot />
    </div>
</Overlay>
</div>
