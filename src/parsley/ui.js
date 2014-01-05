define('parsley/ui', function () {
  var ParsleyUI = function (parsleyFieldInstance) {
    this.__class__ = 'ParsleyUI';

    if ('ParsleyField' !== ParsleyUtils.get(parsleyFieldInstance, '__class__'))
      throw new Error('You must give a ParsleyField instance');

    this.init(parsleyFieldInstance);
  };

  ParsleyUI.prototype = {
    init: function (parsleyFieldInstance) {
      this.parsleyFieldInstance = parsleyFieldInstance;
    },

    reflow: function () {

    },

    reset: function () {

    }
  };

  return ParsleyUI;
});
