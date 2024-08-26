<svelte:options accessors/>
<script>
    import Input from '../Input';
    import Icon from '../Icon';
    import uid from '../../internal/uid';
    import clearIcon from '../../internal/Icons/close';
    import { Editor, asRoot, editorStores } from 'typewriter-editor';
    import {createEventDispatcher, onMount} from "svelte";
    import EditorToolbar from "./EditorToolbar.svelte";
    import Style  from "../../internal/Style";

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
    export let minHeight = null;
    export let maxHeight = null;
    export let limit = null;
    export let autogrow = true;
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
    let editor = new Editor({html: value});
    let focused = false;
    let text = '';

    const { focus } = editorStores(editor);
    $: focused = $focus;
    $: if (!focused) {
        if (validateOnBlur) validate();
    }

    editor.on('changed', (event) => {
        value = editor.getHTML();

        dispatch('change', event);

        if (!validateOnBlur) validate();
    });
    $: editor.enabled = !readonly && !disabled;

    let empty = true;
    $: (value || true) && ((text = editor.getText()) || true) && (empty = !text.trim());

    $: labelActive = active || !!placeholder || !empty || focused;

    let errorMessages = [];

    export function validate() {
        errorMessages = rules.map((r) => r(value)).filter((r) => typeof r === 'string');
        error = !!errorMessages.length;
        return error;
    }

    function clear() {
        value = '';
        textbox.innerHTML = '';
    }

    function onKeyDown(event) {
        if (!!limit && text.length === limit && printable(event.keyCode)) {
            event.preventDefault();
        }
    }

    function printable(keyCode) {
        return (
            (keyCode >= 48 && keyCode <= 57) || // 0-9
            (keyCode >= 65 && keyCode <= 90) || // a-z
            (keyCode >= 96 && keyCode <= 111) || // numpad 0-9, numeric operators
            (keyCode >= 186 && keyCode <= 222) || // semicolon, equal, comma, dash, etc.
            keyCode === 32 || // space
            keyCode === 13 // enter
        );
    }

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
    <div class="s-editor__wrapper" >
        <div
            class="s-text-field__wrapper"
            class:filled
            class:solo
            class:outlined
            class:flat
            class:ghost
            class:rounded
            class:autogrow
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
                    class:empty
                    tabindex="0"
                    role="textbox"
                    aria-labelledby={id}
                    aria-multiline="true"
                    bind:this={textbox}
                    {id}
                    {placeholder}
                    {readonly}
                    {disabled}
                    on:keydown={onKeyDown}
                    on:focus
                    on:blur
                    on:input
                    on:change
                    use:asRoot={editor}
                    use:Style={[{'min-height': minHeight}, true]}
                    use:Style={[{'max-height': maxHeight}, true]}
                    {...$$restProps}
                />

            </div>

            {#if clearable && value !== ''}
                <div on:click={clear} style="cursor:pointer" role="button" tabindex="0" on:keypress={clear}>
                    <!-- Slot for the icon when `clearable` is true. -->
                    <slot name="clear-icon">
                        <Icon path={clearIcon} />
                    </slot>
                </div>
            {/if}

            <!-- Slot for append inside the input. -->
            <slot name="append" />
        </div>

        {#if outlined}
            <EditorToolbar {editor} />
        {/if}
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
            <div class="counter">{text.length} / {counter}</div>
        {/if}
    </div>

    <!-- Slot for append outside the input. -->
    <slot slot="append-outer" name="append-outer" />
</Input>
{#if !outlined}
    <EditorToolbar {editor} />
{/if}
