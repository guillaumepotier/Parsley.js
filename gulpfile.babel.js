import {src, dest, series, parallel}  from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import del  from 'del';
import glob  from 'glob';
import path  from 'path';
import docco  from 'docco';
import {spawn} from 'child_process';
import manifest  from './package.json';
import mocha from './tools/mocha_options.js';
import {rollup} from 'rollup';
import {rollupOptions} from './tools/rollup_options.js';
import defaultRollupOptions from './rollup.config.js';

// Load all of our Gulp plugins
const $ = loadPlugins();

// Gather the library data from `package.json`
const config = manifest.babelBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName = path.basename(mainFile, path.extname(mainFile));

// Lint a set of files
function lint(files) {
  return src(files)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
}

async function buildRollup(...rules) {
  rules.forEach(async opt => {
    const bundle = await rollup(opt);
    await bundle.write(opt.output);
  });
}

// Build the annotated documentation
export function buildDoc(done) {
  var dest = 'doc/annotated-source/';
  var sources = glob.sync('src/parsley/*.js');
  var doccoOpts = {
    layout: 'parallel',
    output: dest,
    args: sources
  };

  // This pattern usually isn't recommended but this would need a lot more refactoring otherwise
  series(
    () => del(dest + '*'),
    (cb) = docco.document(doccoOpts, cb),
    () => src(dest + '*.html', { base: "./" })
      .pipe($.replace('<div id="jump_page">', '<div id="jump_page"><a class="source" href="../index.html">&lt;&lt;&lt; back to documentation</a>'))
      .pipe($.replace('</body>', '<script>var _gaq=_gaq||[];_gaq.push(["_setAccount","UA-37229467-1"]);_gaq.push(["_trackPageview"]);(function(){var e=document.createElement("script");e.type="text/javascript";e.async=true;e.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();</script></body>'))
      .pipe(dest('.'))
  )(done)
}
buildDoc.displayName = 'build-doc';

function copyI18n() {
  return src(['src/i18n/*.js'])
    .pipe($.replace("import Parsley from '../parsley';", "// Load this after Parsley"))  // Quick hack
    .pipe($.replace("import Parsley from '../parsley/main';", ""))  // en uses special import
    .pipe(dest('dist/i18n/'))
}

export function writeVersion() {
  return src(['index.html', 'doc/download.html', 'README.md'], { base: "./" })
    .pipe($.replace(/class="parsley-version">[^<]*</, `class="parsley-version">v${manifest.version}<`))
    .pipe($.replace(/releases\/tag\/[^"]*/, `releases/tag/${manifest.version}`))
    .pipe($.replace(/## Version\n\n\S+\n\n/, `## Version\n\n${manifest.version}\n\n`))
    .pipe(dest('.'))
}
writeVersion.displayName = 'write-version';

// Build the annotated documentation
export function buildDocTest() {
  return build(rollupOptions({
    input: 'test/setup/browser.js',
    file: './doc/assets/spec-build.js',
  }));
}
buildDocTest.displayName = 'build-doc-test';

function runTests() {
  return src(['test/setup/node.js', 'test/unit/index.js'], {read: false})
    .pipe($.mocha({reporter: 'dot', globals: mocha.globals, require: ['@babel/register']}));
}
runTests.displayName = 'test';

// Build for our spec runner `test/runner.html`
export function testBrowser() {
  buildRollup(rollupOptions({
    input: 'test/setup/browser.js',
    file: './tmp/__spec-build.js',
  }));
}
testBrowser.displayName = 'test-browser';

export function gitClean(done) {
  $.git.status({args : '--porcelain'}, (err, stdout) => {
    if (err) throw err;
    if (/^ ?M/.test(stdout)) throw 'You have uncommitted changes!'
    done();
  });
}
gitClean.displayName = 'release-git-clean';

export function npmPublish() {
  return spawn('npm', ['publish'], { stdio: 'inherit' });
}
npmPublish.displayName = 'release-npm-publish';

export function gitPush() {
  return $.git.push('origin', 'master', {args: '--follow-tags'});
}
gitPush.displayName = 'release-git-push';

export function gitPushPages() {
  return $.git.push('origin', 'master:gh-pages');
}
gitPushPages.displayName = 'release-git-push-pages';

export function gitTag() {
  return $.git.tag(manifest.version, '', {quiet: false});
}
gitTag.displayName = 'release-git-tag';

export const release = series(gitClean, gitTag, gitPush, gitPushPages, npmPublish);

// Remove the built files
export const clean = () => del(destinationFolder);

// Remove our temporary files
export const cleanTmp = () => del('tmp');
cleanTmp.displayName = 'clean-tmp';

// Lint our source code
export const lintSrc = () => lint('src/**/*.js');
lintSrc.displayName = 'lint-src';

// Lint our test code
export const lintTest = () => lint('test/**/*.js');
lintTest.displayName = 'lint-test';

// Build the i18n translations
export const buildI18n = series(clean, copyI18n);
buildI18n.displayName = 'build-i18n';

// Build two versions of the library
export const buildSrc = series(
  parallel(lintSrc, clean, buildI18n),
  () => buildRollup(...defaultRollupOptions)
);
buildSrc.displayName = 'build-src';

export const build = series(
  parallel(buildSrc, buildI18n, buildDoc, buildDocTest),
  writeVersion
);

// Lint and run our tests
export const test = series(parallel(lintSrc, lintTest), runTests);

// An alias of test
export default test;
