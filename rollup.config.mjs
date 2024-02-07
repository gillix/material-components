import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-bundle-size';
import pkg from './package.json' assert {type: 'json'};
//import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;
const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

import preprocess from './svelte.config.js';

export default {
  input: 'src/index.js',
  output: [
//    { dir: 'dist', sourcemap: false, format: 'es', name, inlineDynamicImports: false, exports: "named", preserveModules: true },
     { file: pkg.module, sourcemap: true, format: 'es', inlineDynamicImports: true },
     { file: pkg.main, sourcemap: true, format: 'umd', name, inlineDynamicImports: true },
  ],
  plugins: [
    svelte({ preprocess, emitCss: false }),
    resolve(/*{extensions: ['.js', '.ts', '.json', '.svelte']}*/),
    commonjs(),
//    typescript(),
    production && terser(),
    production && bundleSize(),
  ],

};
