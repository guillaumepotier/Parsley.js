requirejs.config({
    baseUrl: '../',

    paths: {
      src: './src',
      dist: './dist',
      parsley: './src/parsley',
      features: './test/features',
      vendors: './bower_components',
      modules: './node_modules'
    },

    map: {
      '*': {
        'validator': 'vendors/validator.js/validator',
        'domReady': 'vendors/requirejs-domready/domReady',
        'jquery': 'vendors/jquery/jquery',
        'expect': 'modules/expect.js/expect',
        'mocha': 'modules/mocha/mocha',
        'sinon': 'modules/sinon/lib/sinon'
      }
    },

    shim: {
      'vendors/jquery/jquery': {
        exports: '$'
      },
      'src/parsley': {
        deps: ['jquery'],
        exports: 'Parsley'
      },
      'dist/parsley': {
        deps: ['jquery'],
        exports: 'Parsley'
      },
      'modules/mocha/mocha': {
        deps: ['expect', 'sinon'],
        exports: 'mocha'
      },
    }
});