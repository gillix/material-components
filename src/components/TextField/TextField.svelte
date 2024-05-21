<svelte:options accessors/>
<script>
  import Input from '../Input';
  import Icon from '../Icon';
  import uid from '../../internal/uid';
  import clearIcon from '../../internal/Icons/close';
  import { imask } from '@imask/svelte';

  let klass = '';
  export { klass as class };
  export let active = false;
  export let value = '';
  export let color = 'primary';
  export let filled = false;
  export let solo = false;
  export let outlined = false;
  export let prefix = '';
  export let suffix = '';
  export let flat = false;
  export let ghost = false;
  export let dense = false;
  export let rounded = false;
  export let clearable = false;
  export let readonly = false;
  export let disabled = false;
  export let placeholder = null;
  export let hint = '';
  export let counter = false;
  export let limit = false;
  export let messages = [];
  export let rules = [];
  export let errorCount = 1;
  export let validateOnBlur = false;
  export let error = false;
  export let success = false;
  export let id = `s-input-${uid(5)}`;
  export let style = null;
  export let inputElement = null;
  export let mask = "";
  export let password = false;

  let input = value;
  $: if (!mask) {
    input = value;
  }

  let maskOptions = false;
  $: if (mask) {
    maskOptions = typeof mask === 'object' ? mask : {
      mask: mask,
      masked: false,
      lazy: true
    };
//        value = maskOptions.masked ? msk.value : msk.unmaskedValue;
  }
  mask = mask;

  let focused = false;
  $: labelActive = active || !!placeholder || value || focused;
  let errorMessages = [];

  export function validate() {
    errorMessages = rules.map((r) => r(value)).filter((r) => typeof r === 'string');
    error = !!errorMessages.length;
    return error;
  }

  function onFocus() {
    focused = true;
  }

  function onBlur() {
    focused = false;
    if (validateOnBlur) validate();
  }

  function clear() {
    value = '';
  }

  function onInput() {
    if (!validateOnBlur) validate();
    if (!mask) {
      value = inputElement.value;
    }
  }

  function maskComplete({detail: msk}) {
    // value = msk.unmaskedValue;
    // input = msk.value;
    // console.log('complete:' + msk.unmaskedValue)

  }

  function maskAccept({detail: msk}) {
    value = maskOptions.masked ? msk.value : msk.unmaskedValue;
    input = msk.value;
  }


</script>

<Input
  class="{klass} s-text-field"
  {color}
  {dense}
  {readonly}
  {disabled}
  {error}
  {success}
  {style}>
  <!-- Slot for prepend outside the input. -->
  <slot slot="prepend-outer" name="prepend-outer" />
  <div
    class="s-text-field__wrapper"
    class:filled
    class:solo
    class:outlined
    class:flat
    class:ghost
    class:rounded
    class:active={active || focused}
  >
    <!-- Slot for prepend inside the input. -->
    <slot name="prepend" />

    <div class="s-text-field__input">
      <label for={id} class:active={labelActive}>
        <slot />
      </label>

      {#if (prefix)}
        <span class="s-text-field__prefix">{prefix}</span>
      {/if}

      <slot name="content" />

      <!-- keypress Event is deprecated. Use keydown or keyup instead -->
      <input
        bind:this={inputElement}
        bind:value
        {placeholder}
        {id}
        {readonly}
        {disabled}
        on:focus={onFocus}
        on:blur={onBlur}
        on:input={onInput}
        on:focus
        on:blur
        on:input
        on:change
        on:keypress
        on:keydown
        on:keyup
        use:imask={maskOptions}
        on:accept={maskAccept}
        on:complete={maskComplete}
        maxlength={limit}
        {...{type: password ? 'password' : 'text'}}
        {...$$restProps} />

      {#if (suffix)}
        <span class="s-text-field__suffix">{suffix}</span>
      {/if}

    </div>

    {#if clearable && value !== ''}
      <div on:click={clear} style="cursor:pointer">
        <!-- Slot for the icon when `clearable` is true. -->
        <slot name="clear-icon">
          <Icon path={clearIcon} />
        </slot>
      </div>
    {/if}


    <!-- Slot for append inside the input. -->
    <slot name="append" />
  </div>

  <div
      slot="messages"
      class:outlined
      class:filled
  >
    {#if errorMessages.length}
      {#each errorMessages.slice(0, errorCount) as message}<div class="message">{message}</div>{/each}
    {:else}
      {#if messages.length}
        {#each messages as message}<div class="message">{message}</div>{/each}
      {:else}
        <div class="message">{hint}</div>
      {/if}
    {/if}
    {#if counter}
      <div class="counter">{value.length} / {counter}</div>
    {/if}
  </div>

  <!-- Slot for append outside the input. -->
  <slot slot="append-outer" name="append-outer" />
</Input>
