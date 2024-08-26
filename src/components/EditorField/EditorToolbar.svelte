<script>
    import { Toolbar } from 'typewriter-editor';
    import Button from "../Button/Button.svelte";
    import Icon from "../Icon/Icon.svelte";
    import {slide} from "svelte/transition";
    import {formats, toolbar} from "./formats.js";

    export let editor;
    export let buttons = toolbar.mini;

</script>
<Toolbar {editor} let:active let:commands let:focus>
    {#if focus}
        <div class="s-editor-toolbar" transition:slide>
            {#each buttons as name}
                <div>
                    <Button
                        on:click={formats[name]?.command ? formats[name]?.command(commands, editor) : commands[name]}
                        active={formats[name]?.active ? formats[name].active(active) : active[name]}
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
