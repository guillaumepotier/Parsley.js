require(['../src/config'], function () {
  // load expect, mocha and sinon stuff
  require([
    'expect',
    'mocha',
    'sinon'
  ], function (expect, mocha, sinon) {
    // setup mocha
    mocha.setup('bdd');
    mocha.reporter('html');

    // load then Parsley modules for UT
    require([
      'src/parsley',
      'parsley/factory/options',
      'parsley/form',
      'parsley/field',
      'parsley/ui',
      'parsley/utils'
    ], function (Parsley, ParsleyOptionsFactory, ParsleyForm, ParsleyField, ParsleyUI, ParsleyUtils) {

      // load full parsley.js + UT
      require([
        'features/parsley',
        'features/options',
        'features/abstract',
        'features/field',
        'features/form',
        'features/ui',
        'features/utils'
      ], function (parsleyBase, options, abstract, field, form, ui, utils) {
        describe('Unit Tests', function () {
          parsleyBase(Parsley);
          options(ParsleyOptionsFactory);
          abstract(Parsley);
          field(ParsleyField, Parsley);
          form(ParsleyForm, Parsley);
          ui(ParsleyUI);
          utils(ParsleyUtils);
        });

        // load then functionnal tests
        require([
          // 'features/instances'
        ], function (instances) {
          describe('Functional Tests', function () {
            // instances();
          });

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
