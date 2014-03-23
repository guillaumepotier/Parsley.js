define('parsley/multiple', [
], function () {
  var ParsleyMultiple = function() {
    this.__class__ = 'ParsleyFieldMultiple';
  };

  ParsleyMultiple.prototype = {
    init: function (multiple) {
      this.$elements = [this.$element];
      this.options.multiple = multiple;

      return this;
    },

    addElement: function ($element) {
      this.$elements.push($element);

      return this;
    },

    refreshConstraints: function () {
      this.constraints = [];

      // Select multiple special treatment
      if (this.$element.is('select')) {
        this.actualizeOptions().bindConstraints();

        return this;
      }


      for (var i = 0; i < this.$elements.length; i++)
        this.constraints = this.constraints.concat(this.$elements[i].data('ParsleyFieldMultiple').refreshConstraints().constraints);

      return this;
    },

    getValue: function () {
      // Value could be overriden in DOM
      if ('undefined' !== typeof this.options.value)
        return this.options.value;

      // Radio input case
      if (this.$element.is('input[type=radio]'))
        return $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').val() || '';

      // checkbox input case
      if (this.$element.is('input[type=checkbox]')) {
        var values = [];

        $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').each(function () {
          values.push($(this).val());
        });

        return values.length ? values : [];
      }

      // Select multiple case
      if (this.$element.is('select'))
        return null === this.$element.val() ? [] : this.$element.val();
    }
  };

  return ParsleyMultiple;
});
