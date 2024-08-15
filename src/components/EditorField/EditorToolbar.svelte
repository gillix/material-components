<script>
    import Toolbar from 'typewriter-editor';
    import Button from "material-components/src/components/Button/Button.svelte";
    import Icon from "material-components/src/components/Icon/Icon.svelte";
    import mdiFormatListBulleted from '@mdi/js'

    export let editor;
</script>
<Toolbar {editor} let:active let:commands let:focus>
    <div class="toolbar" class:active={focus}>
        <div><Button on:click={commands.bold} active={active.bold} text>B</Button></div>
        <div><Button on:click={commands.italic} active={active.bold} ><i>I</i></Button></div>
        <div><Button on:click={commands.list} active={active.list} ><Icon path={mdiFormatListBulleted} /></Button></div>
    </div>
</Toolbar>
