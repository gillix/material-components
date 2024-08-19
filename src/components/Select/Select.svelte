<script>
  import {createEventDispatcher, tick} from 'svelte';
  import TextField from '../TextField';
  import Menu from '../Menu';
  import { ListItemGroup, ListItem } from '../List';
  import Chip from '../Chip';
  import Checkbox from '../Checkbox';
  import Icon from '../Icon';
  import DOWN_ICON from '../../internal/Icons/down';


  export let multiple = false;

  let klass = '';
  export { klass as class };
  export let active = false;

  export let options = {};
  export let items = options.items ?? [];
  export let value = options.value ?? (multiple ? [] : null);

  export let filled = false;
  export let outlined = false;
  export let color = 'secondary';

  export let solo = false;
  export let dense = false;
  export let placeholder = options.placeholder || null;
  export let hint = options.hint || '';
  export let mandatory = false;
  export let max = Infinity;
  export let chips = false;
  export let disabled = null;
  export let closeOnClick = !multiple;
  export let emptyString = '';

  export let required = options.required ?? false;

  let scroller;

  let format = (val) => (Array.isArray(val) ? val.join(', ') : val);
  let fetch = (val) => (Array.isArray(val) ? val.map((val) => names[val]) : names[val]);
  let fetchIcon = (val) => items.find((item) => item.value === val)?.icon
  let names = {};
  $: for(let i = 0; i < items.length; i++) {
    names[items[i].value] = items[i].name;
  }

  const dispatch = createEventDispatcher();
  $: dispatch('change', value);

  let keyboardLookupLastTime = 0
  let keyboardLookupPrefix = ''

  function onKeydown (e) {
    if (!e.key || disabled) return;

    if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) {
      e.preventDefault()
    }

    if (['Enter', 'ArrowDown', ' '].includes(e.key)) {
      active = !(active && e.key === 'Enter');
    }

    if (['Escape', 'Tab'].includes(e.key)) {
      active = false;
    }

    let currentIndex = items.indexOf(findItem(value));
    if (e.key === 'ArrowUp') {
      if (items[currentIndex - 1]) {
        value = items[currentIndex - 1].value;
        highlightItem(items[currentIndex - 1])
      }
    }
    if (e.key === 'ArrowDown') {
      if (items[currentIndex + 1]) {
        value = items[currentIndex + 1].value;
        highlightItem(items[currentIndex + 1])
      }
    }

    if (e.key === 'PageUp') {
      if (items[currentIndex - 7]) {
        value = items[currentIndex - 7].value;
        highlightItem(items[currentIndex - 7])
      }
    }

    if (e.key === 'PageDown') {
      if (items[currentIndex + 7]) {
        value = items[currentIndex + 7].value;
        highlightItem(items[currentIndex + 7])
      }
    }

    if (e.key === 'Home') {
      if (items[0]) {
        value = items[0].value;
        highlightItem(items[0])
      }
    }

    if (e.key === 'End') {
      if (items[items.length - 1]) {
        value = items[items.length - 1].value;
        highlightItem(items[items.length - 1])
      }
    }

    // html select hotkeys
    const KEYBOARD_LOOKUP_THRESHOLD = 1000 // milliseconds

    function checkPrintable (e) {
      const isPrintableChar = e.key.length === 1
      const noModifier = !e.ctrlKey && !e.metaKey && !e.altKey
      return isPrintableChar && noModifier
    }

    if (multiple || !checkPrintable(e)) return;

    const now = performance.now()
    if (now - keyboardLookupLastTime > KEYBOARD_LOOKUP_THRESHOLD) {
      keyboardLookupPrefix = ''
    }
    keyboardLookupPrefix += e.key.toLowerCase()
    keyboardLookupLastTime = now

    const item = items.find(item => item.name.toLowerCase().startsWith(keyboardLookupPrefix))
    if (item !== undefined) {
      value = item.value;
      highlightItem(item);
    }
  }


  function highlightItem (item) {
    tick().then(() => {
      const itemEl = scroller?.querySelector(`#_${item.value}`);
      if (itemEl) {
        const scrollerBox = scroller.getBoundingClientRect();
        const itemBox = itemEl.getBoundingClientRect();
        if (scrollerBox.top > itemBox.top - itemBox.height || scrollerBox.bottom < itemBox.bottom + itemBox.height) {
          scroller.scrollTo({ top: itemEl.offsetTop - itemBox.height * 2, behavior: 'auto' });
        }
      }
    })
  }

  function findItem(value) {
    return items.find((item) => item.value === value);
  }


  $: if (active && (Array.isArray(value) ? value.length : value)) {
    highlightItem(findItem(Array.isArray(value) ? value[0] : value));
  }

</script>

<style lang="scss" src="./Select.scss" global>
</style>

<div class="s-select {klass}" class:disabled class:chips>
  <Menu offsetY={true} tile={!outlined} bind:active {disabled} {closeOnClick}>
    <span slot="activator">
      <TextField
        {filled}
        {outlined}
        {solo}
        {dense}
        {color}
        {disabled}
        {required}
        value={format(fetch(value) ?? '')}
        {placeholder}
        {hint}
        {active}
        readonly
        on:keydown={onKeydown}
      >
        <slot slot="prepend-outer" name="prepend-outer" />

        <slot />
        <div slot="prepend">
          {#if value && !Array.isArray(value) && fetchIcon(value)}
            <Icon path={fetchIcon(value)} />
          {/if}
        </div>
        <div slot="content">

          {#if chips && value}
            <span class="s-select__chips">
              {#each Array.isArray(value) ? value : [value] as v}
                <Chip>{fetch(v)}</Chip>
              {/each}
            </span>
          {/if}
        </div>
        <span slot="append">
          <Icon path={DOWN_ICON} rotate={active ? 180 : 0} />
        </span>
        <slot slot="append-outer" name="append-outer" />
      </TextField>
    </span>
    <div class="virtual-scroll" bind:this={scroller}>
      <ListItemGroup
              bind:value
              {mandatory}
              {multiple}
              {max}
      >
        {#each items as item}
          <slot name="item" {item}>
            <div class="item-anchor" id="_{item.value ? item.value : item}">
              <ListItem {dense} disabled={value===item.value} value={item.value ? item.value : item}>
                <span slot="prepend">
                  {#if multiple}
                    <Checkbox checked={value.includes(item.value ? item.value : item)} />
                  {:else if (item.icon)}
                    <Icon path={item.icon} />
                  {/if}
                </span>
                {item.name !== undefined ? item.name : item}
              </ListItem>
            </div>
          </slot>
        {/each}
      </ListItemGroup>
    </div>
  </Menu>
</div>
