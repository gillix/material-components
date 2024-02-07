/* eslint-disable no-console */
import { preprocess } from 'svelte/compiler';
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import sveltePreprocess from 'svelte-preprocess';
import process from 'process';
import del from 'del';
import cssnano from 'cssnano';

const BASE = process.cwd();
const processor = sveltePreprocess({
  scss: {
    includePaths: [path.join(BASE, 'theme')],
  },
  postcss: {
    plugins: [cssnano()],
  },
});

del.sync(['dist/**']);
glob('src/**/*.svelte', {}, async (_, files) => {
  // eslint-disable-next-line no-restricted-syntax
  for await (const file of files) {
    const source = fs.readFileSync(path.join(BASE, file), 'utf-8');
    const filename = path.basename(file);
    const dirname = path.dirname(file);
    process.chdir(path.join(BASE, dirname));
    const { code } = await preprocess(source, processor, { filename });
    const outFolder = path.join(BASE, path.dirname(file.replace('src', 'dist')));
    fs.mkdirSync(outFolder, { recursive: true });
    fs.writeFileSync(path.join(outFolder, filename), code);
  }
});

process.chdir(BASE);

//glob('src/**/*.+(js|ts)', {}, (_, files) => {
glob('src/**/*.js', {}, (_, files) => {
  files.forEach((file) => {
    const outFolder = path.join(BASE, path.dirname(file.replace('src', 'dist')));
    const filename = path.basename(file);
    fs.mkdirSync(outFolder, { recursive: true });
    fs.copyFileSync(path.join(BASE, file), path.join(outFolder, filename));
  });
});
