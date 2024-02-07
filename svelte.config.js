import  sveltePreprocess from 'svelte-preprocess';

export default sveltePreprocess({
    scss: {
      includePaths: ['theme'],
    },
});
