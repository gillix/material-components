<script>
    import {createEventDispatcher} from "svelte";
    import Select from "../Select/Select.svelte";
    import Button from "../Button/Button.svelte";
    import {stringify} from "../../internal/Class/index.js";
    import Icon from "../Icon/Icon.svelte";
    import pageFirst from "../../internal/Icons/pageFirst.js";
    import pageLast from "../../internal/Icons/pageLast.js";
    import prev from "../../internal/Icons/prev.js";
    import next from "../../internal/Icons/next.js";
    import Tooltip from "../Tooltip/Tooltip.svelte";

    export let page = 1;
    export let perPage = 10;
    export let total;

    export let showPages = true;
    export let showEdges = !showPages;
    export let showInfo = false;
    export let showPerPageSelect = false;
    export let pagesMinWindow = 5;
    export let pagesMaxWindow = 7;
    export let rounded = false;
    export let texts = {
        info: '{from} - {to} of {total}',
        rowsPerPage: 'Rows per page'
    };


    export let perPageOptions = [10, 20, 30, 50, 100];
    perPageOptions = perPageOptions.map(v => ({value: v, name: v}));

    let dispatch = createEventDispatcher();
    let buttonProps = {
        size: 'default',
        icon: rounded,
        depressed: true,
//        class: 'grey-text text-darken-2'
    }
    let pages, windowStart, windowFinish;

    $: pages = Math.ceil(total / perPage);

    $: {
        windowStart = Math.max(page - Math.floor(pagesMinWindow / 2), 1);
        windowFinish = Math.min(windowStart + pagesMinWindow - 1, pages);
        if(windowFinish <= pagesMaxWindow) {
            windowStart = 1;
        } else {
            windowStart = Math.max(1, windowFinish - pagesMinWindow + 1);
            if (pages - windowStart < pagesMaxWindow) {
                windowFinish = pages;
            }
        }
    }

    function change(newPage, newPerPage) {
        if (newPage === page && newPerPage === perPage) {
            return;
        }
        dispatch('change', {page: newPage, perPage: newPerPage});
    }

    function changePerPage(newPerPage) {
        let newPage = Math.max(Math.ceil((Math.floor(page * perPage) - perPage + 1) / newPerPage), 1);
        change(newPage, newPerPage);
    }

</script>

<div class="s-pagination">

    <slot name="pagination">
        {#if showInfo}
            <div class="s-pagination__info">
                {texts.info.replace('{from}', (page - 1) * perPage + 1).replace('{to}', Math.min((page - 1) * perPage + perPage, total)).replace('{total}', total)}
            </div>
        {/if}


        {#if showPages}
            <div class="s-pagination__pages">
                <slot name="pagination-pages">
                    {#if (windowStart !== 1)}
                        <Button
                            {...buttonProps}
                            on:click={() => change(1, perPage)}
                        >1</Button>
                        <Button
                            {...buttonProps}
                            on:click={() => change(Math.floor(windowStart / 2), perPage)}
                        >...</Button>
                    {/if}

                    {#each Array(windowFinish - windowStart + 1) as _, i}
                        {@const index = i + windowStart}
                        <Button
                            {...buttonProps}
                            active={index === page}
                            on:click={() => change(index, perPage)}
                        >
                            {index}
                        </Button>
                    {/each}

                    {#if (windowFinish !== pages)}
                        <Button
                            {...buttonProps}
                            on:click={() => change(Math.floor((pages + windowFinish) / 2), perPage)}
                        >...</Button>
                        <Button
                            {...buttonProps}
                            on:click={() => change(pages, perPage)}
                        >{pages}</Button>
                    {/if}
                </slot>
            </div>
        {/if}

        <div class="s-pagination__nav">
            <slot name="pagination-nav">
                {#if (showEdges)}
                    <Button
                        {...buttonProps}
                        disabled={page === 1}
                        on:click={() => change(1, perPage)}
                    >
                        <Icon path={pageFirst} />
                    </Button>
                {/if}

                <Button
                    {...buttonProps}
                    disabled={page === 1}
                    on:click={() => change(page - 1, perPage)}
                >
                    <Icon path={prev} />
                </Button>
                <Button
                    {...buttonProps}
                    disabled={page === pages}
                    on:click={() => change(page + 1, perPage)}
                >
                    <Icon path={next} />
                </Button>

                {#if (showEdges)}
                    <Button
                        {...buttonProps}
                        disabled={page === pages}
                        on:click={() => change(pages, perPage)}
                    >
                        <Icon path={pageLast} />
                    </Button>
                {/if}
            </slot>
        </div>

        {#if showPerPageSelect}
            <div class="s-pagination__per-page">
                <slot name="per-page-select">
                    <Tooltip message={texts.rowsPerPage}>
                        <Select
                            items={perPageOptions}
                            outlined
                            dense
                            value={perPage}
                            on:change={({detail}) => changePerPage(detail)}
                        />
                    </Tooltip>
                </slot>
            </div>
        {/if}
    </slot>
</div>

<style lang="scss" src="./Pagination.scss" global>
</style>
