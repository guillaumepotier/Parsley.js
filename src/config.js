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
        jquery: 'vendors/jquery/dist/jquery',
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
      }
    }
});
