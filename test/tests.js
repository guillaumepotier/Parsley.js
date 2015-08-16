require(['config'], function () {
  // load expect, mocha and sinon stuff
  require([
    'jquery',
    'expect',
    'mocha',
    'sinon'
  ], function (jquery, _expect, mocha, _sinon) {
    // setup mocha
    mocha.globals([ 'jQuery*' ])
    mocha.checkLeaks();
    mocha.setup('bdd');
    mocha.reporter('html');

    // load then Parsley modules for UT
    require([
      'src/parsley',
      'parsley/validator',
      'parsley/factory',
      'parsley/form',
      'parsley/field',
      'parsley/ui',
      'parsley/utils',
      'parsley/validator_registry',
      'i18n/fr'
    ], function (Parsley, ParsleyValidator, ParsleyFactory, ParsleyForm, ParsleyField, ParsleyUI, ParsleyUtils, ParsleyValidatorRegistry) {

      // Setup console.warn so we insure it is called when we expect it
      beforeEach(function() {
        sinon.spy(console, 'warn');
        console.warn.expectedCallCount = 0;
      });
      afterEach(function() {
        expect(console.warn.callCount).to.be(console.warn.expectedCallCount);
        console.warn.restore();
      });
      window.expectWarning = function(fn) {
        var w = console.warn;
        expect(w.callCount).to.be(w.expectedCallCount);
        var result = fn.call();
        w.expectedCallCount++;
        expect(w.callCount).to.be(w.expectedCallCount);
        return result;
      };

      // load full parsley.js + UT
      require([
        'features/utils',
        'features/validator.js',
        'features/parsley',
        'features/pubsub',
        'features/abstract',
        'features/field',
        'features/multiple',
        'features/form',
        'features/validator_registry',
        'features/ui'
      ], function (utils, validator, parsleyBase, pubsub, abstract, field, multiple, form, validator_registry, ui) {
        describe('ParsleyStandard', function () {
          // Use a pristine ParsleyExtend for the standard suite:
          var previousExtend;
          before(function () {
            previousExtend = window.ParsleyExtend;
            window.ParsleyExtend = {};
          });
          after(function () {
            window.ParsleyExtend = previousExtend;
            ParsleyUtils._resetWarnings();
          });
          utils(ParsleyUtils);
          validator(ParsleyValidator);
          parsleyBase(Parsley.Factory);
          pubsub();
          abstract();
          field(ParsleyField);
          multiple();
          form(ParsleyForm);
          validator_registry(ParsleyValidator, ParsleyValidatorRegistry);
          ui(ParsleyUI);
        });

        require([
          'features/remote',
          'features/abstract',
          'features/field',
          'features/form'
        ], function (remote, abstract, field, form) {
          describe('Parsley+Remote', function () {
            // beforeEach(function () {
            //   window.ParsleyConfig = $.extend(true, {}, window.ParsleyConfig, { excluded: 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], input[disabled]' });
            // });
            remote(ParsleyExtend);
            abstract();
            field(ParsleyField);
            form(ParsleyForm);
          });

          require([
            'features/extra'
          ], function (extra) {
            extra(ParsleyValidator, ParsleyValidatorRegistry);

            // run mocha
            if (window.mochaPhantomJS)
              mochaPhantomJS.run();
            else
              mocha.run();
          });
        });
      });
    });
  });
});
