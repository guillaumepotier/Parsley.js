require(['config'], function () {
  // load expect, mocha and sinon stuff
  require([
    'jquery',
    'expect',
    'mocha',
    'sinon'
  ], function (jquery, _expect, mocha, _sinon) {
    // setup mocha
    mocha.checkLeaks();
    mocha.setup('bdd');
    mocha.reporter('html');

    // load then Parsley modules for UT
    require([
      'src/parsley',
      'parsley/form',
      'parsley/field',
      'parsley/ui',
      'parsley/utils',
      'parsley/validator',
      'i18n/fr'
    ], function (Parsley, ParsleyForm, ParsleyField, ParsleyUI, ParsleyUtils, ParsleyValidator) {

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
        'features/parsley',
        'features/pubsub',
        'features/abstract',
        'features/field',
        'features/multiple',
        'features/form',
        'features/validator',
        'features/ui'
      ], function (utils, parsleyBase, pubsub, abstract, field, multiple, form, validator, ui) {
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
          parsleyBase(Parsley);
          pubsub();
          abstract(Parsley);
          field(ParsleyField, Parsley);
          multiple(Parsley);
          form(ParsleyForm, Parsley);
          validator(ParsleyValidator);
          ui(ParsleyUI);
        });

        // tested by it('should handle remote validator option') in `features/remote`
        window.ParsleyExtend = {
          asyncValidators: {
            custom: {
              fn: function (xhr) {
                return xhr.status === 404;
              }
            }
          }
        };

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
            abstract(Parsley);
            field(ParsleyField, Parsley);
            form(ParsleyForm, Parsley);
          });

          require([
            'features/extra'
          ], function (extra) {
            extra(ParsleyValidator);

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
