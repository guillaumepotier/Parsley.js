requirejs.config({
    baseUrl: './',
    paths: {
        dist: '../dist',
        vendors: '../bower_components',
        jquery: '../bower_components/jquery/dist/jquery'
    },
    map: {
        '*': {
            parsley: 'dist/parsley',
            jquery: 'vendors/jquery/dist/jquery'
        }
    }
});

requirejs([
    'parsley'
], function () {
    console.log(arguments);
});
