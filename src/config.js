requirejs.config({
    baseUrl: '../',

    paths: {
      src: './src',
      dist: './dist',
      i18n: './src/i18n',
      parsley: './src/parsley',
      vendors: './bower_components'
    },

    map: {
      '*': {
        'jquery': 'vendors/jquery/jquery',
        'validator': 'vendors/validator.js/dist/validator'
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
      'src/parsley.remote': {
        deps: ['jquery'],
        exports: 'ParsleyExtend'
      },
      'vendors/validator.js/dist/validator': {
        exports: 'Validator'
      }
    }
});
