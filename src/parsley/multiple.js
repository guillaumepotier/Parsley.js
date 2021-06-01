import $ from 'jquery';
import Utils from './utils';

var Multiple = function () {
  this.__class__ = 'FieldMultiple';
};

Multiple.prototype = {
  // Add new `$element` sibling for multiple field
  addElement: function ($element) {
    this.$elements.push($element);

    return this;
  },

  // See `Field._refreshConstraints()`
  _refreshConstraints: function () {
    var fieldConstraints;

    this.constraints = [];

    // Select multiple special treatment
    if (this.element.nodeName === 'SELECT') {
      this.actualizeOptions()._bindConstraints();

      return this;
    }

    // Gather all constraints for each input in the multiple group
    for (var i = 0; i < this.$elements.length; i++) {

      // Check if element have not been dynamically removed since last binding
      if (!document.body.contains(this.$elements[i][0])) {
        this.$elements.splice(i, 1);
        continue;
      }

      fieldConstraints = Utils.getData(this.$elements[i][0],'FieldMultiple')._refreshConstraints().constraints;

      for (var j = 0; j < fieldConstraints.length; j++)
        this.addConstraint(fieldConstraints[j].name, fieldConstraints[j].requirements, fieldConstraints[j].priority, fieldConstraints[j].isDomConstraint);
    }

    return this;
  },

  // See `Field.getValue()`
  getValue: function () {
    // Value could be overriden in DOM
    if ('function' === typeof this.options.value)
      return this.options.value(this);
    else if ('undefined' !== typeof this.options.value)
      return this.options.value;

    // Radio input case
    if (this.element.nodeName === 'INPUT') {
      var type = Utils.getType(this.element);
      if (type === 'radio')
        return this._findRelated().filter(':checked').val() || '';

      // checkbox input case
      if (type === 'checkbox') {
        var values = [];

        this._findRelated().filter(':checked').each(function () {
          values.push($(this).val());
        });

        return values;
      }
    }

    // Select multiple case
    if (this.element.nodeName === 'SELECT' && null === this.$element.val())
      return [];

    // Default case that should never happen
    return this.$element.val();
  },

  _init: function () {
    this.$elements = [this.$element];

    return this;
  }
};

export default Multiple;
