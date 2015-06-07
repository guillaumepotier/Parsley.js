requirejs.config({
    baseUrl: '../../',

    paths: {
      jquery: 'bower_components/jquery/dist/jquery',
      vendors: 'bower_components',
      modules: 'node_modules'
    },

    map: {
      '*': {
        parsley: 'dist/parsley',
        expect: 'modules/expect.js/index',
        mocha: 'modules/mocha/mocha'
      }
    },

    shim: {
      'vendors/jquery/dist/jquery': {
        exports: '$'
      },
      'modules/mocha/mocha': {
        deps: ['expect'],
        exports: 'mocha'
      },
      'modules/expect.js/index': {
        exports: 'expect'
      }
    }
});


require([
  'jquery',
  'expect',
  'mocha',
  'parsley'
], function (jquery, expect, mocha) {

  // setup mocha
  mocha.checkLeaks();
  mocha.setup('bdd');
  mocha.reporter('html');

  describe('AMD', function () {
    it('should have Parsley defined', function () {
      expect(window.Parsley).to.be.a('object');
    });
    it('should register some window globals', function () {
      expect(window.ParsleyUI).not.to.be(undefined);
      expect(window.ParsleyUtils).not.to.be(undefined);
      expect(window.ParsleyValidator).not.to.be(undefined);
    });
    it('should return ParsleyForm instance if instantiated on a form', function () {
      $('body').append('<form id="element"></form>');
      var parsleyInstance = $('#element').parsley();
      expect(parsleyInstance).to.be.an('object');
      expect(parsleyInstance.__class__).to.be('ParsleyForm');
    });
    it('should return ParsleyField instance if instantiated on a field', function () {
      $('body').append('<input id="element" />');
      var parsleyInstance = $('#element').parsley();
      expect(parsleyInstance).to.be.an('object');
      expect(parsleyInstance.__class__).to.be('ParsleyField');
    });
    afterEach(function () {
      if ($('#element').length)
        $('#element').remove();
    });
  });

  // run mocha
  if (window.mochaPhantomJS)
    mochaPhantomJS.run();
  else
    mocha.run();
});
