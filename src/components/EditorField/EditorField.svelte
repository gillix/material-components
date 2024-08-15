<svelte:options accessors/>
<script>
    import Input from '../Input';
    import Icon from '../Icon';
    import uid from '../../internal/uid';
    import clearIcon from '../../internal/Icons/close';
    import { Editor, asRoot } from 'typewriter-editor';
    import {createEventDispatcher} from "svelte";


    let klass = '';
    export { klass as class };
    export let value = '';
    export let active = false;
    export let color = 'primary';
    export let filled = false;
    export let solo = false;
    export let outlined = false;
    export let flat = false;
    export let ghost = false;
    export let rounded = false;
    export let clearable = false;
    export let readonly = false;
    export let rows = 5;
    export let limit = false;
    export let autogrow = false;
    export let noResize = false;
    export let disabled = false;
    export let placeholder = null;
    export let hint = '';
    export let counter = false;
    export let rules = [];
    export let errorCount = 1;
    export let messages = [];
    export let validateOnBlur = false;
    export let error = false;
    export let success = false;
    export let id = `s-input-${uid(5)}`;
    export let style = null;
    export let textbox = null;

    let dispatch = createEventDispatcher();
    let editor = new Editor();

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
        textbox.innetHtml = '';
    }

    function onInput(event) {
        value = textbox.innetHtml;

        dispatch('change', event);

        if (!validateOnBlur) validate();
    }

    function onKeyDown(event) {
        if (limit !== null && textbox.innerText.length === limit && event.keyCode !== 8) {
            event.preventDefaiult();
        }
    }

    // function updateTextareaHeight() {
    //   textarea.style.height = 'auto';
    //   textarea.style.height = `${textarea.scrollHeight}px`;
    // }

    //  $: if (textarea && autogrow) updateTextareaHeight(value);
</script>

<Input
    class="{klass} s-text-field s-editor"
    {color}
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
        class:autogrow
        class:no-resize={noResize || autogrow}
        class:active={active || focused}
    >
        <!-- Slot for prepend inside the input. -->
        <slot name="prepend" />

        <div class="s-text-field__input">
            <label for={id} class:active={labelActive}>
                <slot />
            </label>
            <div
                class="editor"
                contenteditable="true"
                tabindex="0"
                role="textbox"
                aria-labelledby={id}
                aria-multiline="true"
                bind:this={textbox}
                {rows}
                {placeholder}
                {id}
                {readonly}
                {disabled}
                on:focus={onFocus}
                on:blur={onBlur}
                on:input={onInput}
                on:keydown={onKeyDown}
                on:focus
                on:blur
                on:input
                on:change
                use:asRoot={editor}
                {...$$restProps} />
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
    <slot name="editor-toolbar" />

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
