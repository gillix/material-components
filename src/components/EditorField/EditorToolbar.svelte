<script>
    import { Toolbar } from 'typewriter-editor';
    import Button from "../Button/Button.svelte";
    import Icon from "../Icon/Icon.svelte";
    import {slide} from "svelte/transition";
    import {formats, toolbar} from "./formats.js";

    export let editor;
    export let buttons = toolbar.mini;
    let data = {};

    buttons = Array.isArray(buttons) ? buttons : toolbar[buttons];
    buttons = buttons ?? toolbar.mini;
    
    function process(actions, name, option) {
        if (option) {
            if (typeof option === 'function') {
                return option(actions, editor);
            } else if (typeof option === 'string') {
                return actions[option];
            }
        } else {
            return actions[name];
        }
    }
</script>

<Toolbar {editor} let:active let:commands let:focus>
    {#if focus}
        <div class="s-editor-toolbar" transition:slide>
            {#each buttons as name}
                <div>
                    <Button
                        on:click={process(commands, name, formats[name]?.command)}
                        active={process(active, name, formats[name]?.active)}
                        size="default"
                        icon
                        class="squared"
                    >
                        {@html formats[name]?.caption ?? ''}
                        {#if (formats[name]?.icon)}
                            <Icon
                                size={formats[name]?.iconSize ?? "17px"}
                                path={formats[name]?.icon}
                            />
                        {/if}
                    </Button>
                </div>
            {/each}
        </div>
    {/if}
</Toolbar>
