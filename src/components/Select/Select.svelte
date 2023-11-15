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
  let items = options.items ?? [];
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

  let required = options.required ?? false;

  const getSelectString = (v) => {
    // We could also use `return items[0].value ? find.. : v` or provide a `basic` prop
    const item = items.find((i) => i.value === v);
    return item ? (item.name ? item.name : item) : (v || emptyString);
  };
  export let format = (val) => (Array.isArray(val) ? val.map((v) => getSelectString(v)).join(', ') : getSelectString(val));

  const dispatch = createEventDispatcher();
  $: dispatch('change', value);
</script>

<style lang="scss" src="./Select.scss" global>
</style>

<div class="s-select {klass}" class:disabled class:chips>
  <Menu offsetY={true} nudgeY={-20} tile={!outlined} bind:active {disabled} {closeOnClick}>
    <span slot="activator">
      <TextField
        {filled}
        {outlined}
        {solo}
        {dense}
        {color}
        {disabled}
        value={items && format(value)}
        {placeholder}
        {hint}
        readonly>
        <slot slot="prepend-outer" name="prepend-outer" />

        <slot />
        <div slot="content">
          {#if chips && value}
            <span class="s-select__chips">
              {#each Array.isArray(value) ? value.map((v) => getSelectString(v)) : [getSelectString(value)] as val}
                <Chip>{val}</Chip>
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
              {/if}
            </span>
            {item.name ? item.name : item}
          </ListItem>
        </slot>
      {/each}
    </ListItemGroup>
  </Menu>
</div>
