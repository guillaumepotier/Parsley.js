requirejs.config({
    baseUrl: './',
    paths: {
        dist: '../dist',
        vendors: '../bower_components',
        jquery: '../bower_components/jquery/jquery'
    },
    map: {
        '*': {
            parsley: 'dist/parsley',
            jquery: 'vendors/jquery/jquery'
        }
    }
});

requirejs([
    'parsley'
], function () {
    console.log(arguments);
});
