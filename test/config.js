requirejs.config({
    baseUrl: '../',

    paths: {
      src: './src',
      dist: './dist',
      i18n: './src/i18n',
      extra: './src/extra',
      parsley: './src/parsley',
      features: './test/features',
      vendors: './bower_components',
      modules: './node_modules'
    },

    map: {
      '*': {
        'validator': 'vendors/validator.js/dist/validator',
        'jquery': 'vendors/jquery/dist/jquery',
        'expect': 'modules/expect.js/index',
        'mocha': 'modules/mocha/mocha',
        'sinon': 'vendors/sinonjs/sinon'
      }
    },

    shim: {
      'vendors/jquery/dist/jquery': {
        exports: '$'
      },
      'src/parsley': {
        deps: ['jquery'],
        exports: 'Parsley'
      },
      'src/parsley.remote': {
        deps: ['jquery'],
        exports: 'ParsleyExtend'
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
