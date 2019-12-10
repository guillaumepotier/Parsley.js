import gulp  from 'gulp';
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

// Remove a directory
function clean(dir, done) {
  del([dir], done);
}

// Lint a set of files
function lint(files) {
  return gulp.src(files)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
}

async function build(...rules) {
  rules.forEach(async opt => {
    const bundle = await rollup(opt);
    await bundle.write(opt.output);
  });
}

function buildDoc(done) {
  var dest = 'doc/annotated-source/';
  var sources = glob.sync('src/parsley/*.js');
  del.sync([dest + '*']);
  docco.document({
    layout: 'parallel',
    output: dest,
    args: sources
  }, function() {
      gulp.src(dest + '*.html', { base: "./" })
      .pipe($.replace('<div id="jump_page">', '<div id="jump_page"><a class="source" href="../index.html">&lt;&lt;&lt; back to documentation</a>'))
      .pipe($.replace('</body>', '<script>var _gaq=_gaq||[];_gaq.push(["_setAccount","UA-37229467-1"]);_gaq.push(["_trackPageview"]);(function(){var e=document.createElement("script");e.type="text/javascript";e.async=true;e.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();</script></body>'))
      .pipe(gulp.dest('.'))
      .on('end', done);
  });
}

function copyI18n(done) {
  gulp.src(['src/i18n/*.js'])
    .pipe($.replace("import Parsley from '../parsley';", "// Load this after Parsley"))  // Quick hack
    .pipe($.replace("import Parsley from '../parsley/main';", ""))  // en uses special import
    .pipe(gulp.dest('dist/i18n/'))
    .on('end', done);
}

function writeVersion() {
  return gulp.src(['index.html', 'doc/download.html', 'README.md'], { base: "./" })
    .pipe($.replace(/class="parsley-version">[^<]*</, `class="parsley-version">v${manifest.version}<`))
    .pipe($.replace(/releases\/tag\/[^"]*/, `releases/tag/${manifest.version}`))
    .pipe($.replace(/## Version\n\n\S+\n\n/, `## Version\n\n${manifest.version}\n\n`))
    .pipe(gulp.dest('.'))
}

function buildDocTest() {
  return build(rollupOptions({
    input: 'test/setup/browser.js',
    file: './doc/assets/spec-build.js',
  }));
}

function test() {
  return gulp.src(['test/setup/node.js', 'test/unit/index.js'], {read: false})
    .pipe($.mocha({reporter: 'dot', globals: mocha.globals, require: ['@babel/register']}));
}

function testBrowser() {
  build(rollupOptions({
    input: 'test/setup/browser.js',
    file: './tmp/__spec-build.js',
  }));
}

function gitClean(done) {
  $.git.status({args : '--porcelain'}, (err, stdout) => {
    if (err) throw err;
    if (/^ ?M/.test(stdout)) throw 'You have uncommitted changes!'
    done();
  });
}

function npmPublish(done) {
  spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', done);
}

function gitPush(done) {
  $.git.push('origin', 'master', {args: '--follow-tags'}, err => { if (err) throw err; done() });
}

function gitPushPages(done) {
  $.git.push('origin', 'master:gh-pages', err => { if (err) throw err; done() });
}

function gitTag(done) {
  $.git.tag(manifest.version, '', {quiet: false}, err => { if (err) throw err; done() });
}

gulp.task('release-git-clean', gitClean);
gulp.task('release-npm-publish', npmPublish);
gulp.task('release-git-push', gitPush);
gulp.task('release-git-push-pages', gitPushPages);
gulp.task('release-git-tag', gitTag);

gulp.task('release',
  gulp.series('release-git-clean', 'release-git-tag', 'release-git-push', 'release-git-push-pages', 'release-npm-publish')
);
// Remove the built files
gulp.task('clean', (done) => clean(destinationFolder, done));

// Remove our temporary files
gulp.task('clean-tmp', (done) => clean('tmp', done));

// Lint our source code
gulp.task('lint-src', () => lint('src/**/*.js'));

// Lint our test code
gulp.task('lint-test', () => lint('test/**/*.js'));

// Build the i18n translations
gulp.task('build-i18n', gulp.series('clean', copyI18n));

// Build two versions of the library
gulp.task('build-src', gulp.series(
  gulp.parallel('lint-src', 'clean', 'build-i18n'),
  () => build(...defaultRollupOptions)
));

// Build the annotated documentation
gulp.task('build-doc', buildDoc);

// Build the annotated documentation
gulp.task('build-doc-test', buildDocTest);

gulp.task('write-version', writeVersion);

gulp.task('build', gulp.series(
  gulp.parallel('build-src', 'build-i18n', 'build-doc', 'build-doc-test'),
  'write-version')
);

// Lint and run our tests
gulp.task('test', gulp.series(gulp.parallel('lint-src', 'lint-test'), test));

// Build for our spec runner `test/runner.html`
gulp.task('test-browser', testBrowser);

// An alias of test
gulp.task('default', gulp.series('test'));
