define('parsley/multiple', [
], function () {
  var ParsleyMultiple = function() {
    this.__class__ = 'ParsleyFieldMultiple';
  };

  ParsleyMultiple.prototype = {
    init: function (multiple) {
      this.options.multiple = multiple;
      ParsleyUtils.setAttr(this.$element, this.options.namespace, 'multiple', this.options.multiple);

      return this;
    }
  };

  return ParsleyMultiple;
});
