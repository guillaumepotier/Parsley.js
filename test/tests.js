require(['config'], function () {
  // load expect, mocha and sinon stuff
  require([
    'jquery',
    'expect',
    'mocha',
    'sinon'
  ], function (jquery, expect, mocha, sinon) {
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
      'parsley/utils',
      'parsley/validator',
      'i18n/fr'
    ], function (Parsley, ParsleyOptionsFactory, ParsleyForm, ParsleyField, ParsleyUI, ParsleyUtils, ParsleyValidator) {

      // load full parsley.js + UT
      require([
        'features/parsley',
        'features/options',
        'features/pubsub',
        'features/abstract',
        'features/field',
        'features/form',
        'features/validator',
        'features/ui',
        'features/utils'
      ], function (parsleyBase, options, pubsub, abstract, field, form, validator, ui, utils) {
        describe('ParsleyStandard', function () {
          parsleyBase(Parsley);
          options(ParsleyOptionsFactory);
          pubsub();
          abstract(Parsley);
          field(ParsleyField, Parsley);
          form(ParsleyForm, Parsley);
          validator(ParsleyValidator);
          ui(ParsleyUI);
          utils(ParsleyUtils);
        });

        require([
          'features/remote'
        ], function (remote) {
          remote();

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
