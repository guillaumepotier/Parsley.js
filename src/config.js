requirejs.config({
    baseUrl: '.',

    paths: {
      vendors: '../bower_components',
      parsley: '../src/parsley'
    },

    map: {
      '*': {
        'validator': 'vendors/validator.js/validator',
        'domReady': 'vendors/requirejs-domready/domReady'
      }
    }
});