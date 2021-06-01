import {rollupOptions} from './tools/rollup_options.js';
import {uglify} from 'rollup-plugin-uglify';

export default [
  rollupOptions({}),
  rollupOptions({suffix: '.min', extraPlugins: [uglify()]}),
];
