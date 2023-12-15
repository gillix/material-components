<script>
  import { createEventDispatcher } from 'svelte';
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

  let format = (val) => (Array.isArray(val) ? val.join(', ') : val);
  let fetch = (val) => (Array.isArray(val) ? val.map((val) => names[val]) : names[val]);
  let fetchIcon = (val) => items.find((item) => item.value === val)?.icon
  let names = {};
  for(let i = 0; i < items.length; i++) {
    names[items[i].value] = items[i].name;
  }

  const dispatch = createEventDispatcher();
  $: dispatch('change', value);
</script>

<style lang="scss" src="./Select.scss" global>
</style>

<div class="s-select {klass}" class:disabled class:chips>
  <Menu offsetY={true} nudgeY={-5} tile={!outlined} bind:active {disabled} {closeOnClick}>
    <span slot="activator">
      <TextField
        {filled}
        {outlined}
        {solo}
        {dense}
        {color}
        {disabled}
        {required}
        value={format(fetch(value))}
        {placeholder}
        {hint}
        {active}
        readonly>
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
    <ListItemGroup
            bind:value
            {mandatory}
            {multiple}
            {max}
    >
      {#each items as item}
        <slot name="item" {item}>
          <ListItem {dense} disabled={value===item.value} value={item.value ? item.value : item}>
            <span slot="prepend">
              {#if multiple}
                <Checkbox checked={value.includes(item.value ? item.value : item)} />
              {:else if (item.icon)}
                <Icon path={item.icon} />
              {/if}
            </span>
            {item.name ? item.name : item}
          </ListItem>
        </slot>
      {/each}
    </ListItemGroup>
  </Menu>
</div>
