requirejs.config({
    baseUrl: '../',

    paths: {
      src: './src',
      dist: './dist',
      i18n: './src/i18n',
      parsley: './src/parsley',
      features: './test/features',
      vendors: './bower_components',
      modules: './node_modules'
    },

    map: {
      '*': {
        'validator': 'vendors/validator.js/dist/validator',
        'jquery': 'vendors/jquery/jquery',
        'expect': 'modules/expect.js/expect',
        'mocha': 'modules/mocha/mocha',
        'sinon': 'vendors/sinonjs/sinon'
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
      'vendors/validator.js/dist/validator': {
        exports: 'Validator'
      }
    }
});
