import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import manifest  from '../package.json';
import fs  from 'fs';
import moment  from 'moment';

const project = 'parsley';

const banner = fs.readFileSync('src/header.js', 'utf8')
  .replace('VERSION', manifest.version)
  .replace('NOW', moment().format('ddd, MMM Do YYYY, h:mm a'));

function rollupOptions({
  input=`./src/${project}.js`,
  suffix='',
  file=`./dist/${project}${suffix}.js`,
  extraPlugins=[],
}) {
  return {
    input,
    external: ['jquery'],
    plugins: [
      replace({ VERSION: manifest.version }),
      babel(),
      ...extraPlugins
    ],
    output: {
      file,
      format: 'umd',
      banner: banner,
      name: project,
      sourcemap: true,
      globals: { jquery: 'jQuery' },
      interop: false,
    }
  };
}

export {rollupOptions};
