define('parsley/field', [
    'parsley/factory/constraint',
    'parsley/ui',
    'parsley/utils'
], function (ConstraintFactory, ParsleyUI, ParsleyUtils) {
  var ParsleyField = function(field, parsleyInstance) {
    this.__class__ = 'ParsleyField';
    this.__id__ = ParsleyUtils.hash(4);

    if ('Parsley' !== ParsleyUtils.get(parsleyInstance, '__class__'))
      throw new Error('You must give a Parsley instance');

    this.parsleyInstance = parsleyInstance;
    this.init($(field), parsleyInstance.options);
  };

  ParsleyField.prototype = {
    init: function ($element, options) {
      this.constraints = [];
      this.$element = $element;
      this.validationResult = [];
      this.options = this.parsleyInstance.OptionsFactory.get(this);
      this.Validator = this.parsleyInstance.Validator;

      // select/checkbox multiple inputs hack
      if (this.$element.is('input[type=radio], input[type=checkbox]') && 'undefined' === typeof this.options.multiple) {
        this.options.multiple = this.$element.attr('name').replace(/(:|\.|\[|\]|\$)/g, '');
        ParsleyUtils.setAttr(this.$element, this.options.namespace, 'multiple', this.options.multiple);
      }

      $.emit('parsley:field:init', this);

      this.bindConstraints();
    },

    validate: function () {
      $.emit('parsley:field:validate', this);
      $.emit('parsley:field:' + (this.isValid() ? 'success' : 'error'), this);
      $.emit('parsley:field:validated', this);

      return this;
    },

    getConstraintsSortedPriorities: function () {
      var priorities = [];

      for (var i = 0; i < this.constraints.length; i++)
        if (-1 === priorities.indexOf(this.constraints[i].priority))
          priorities.push(this.constraints[i].priority);

      priorities.sort(function (a, b) { return b - a; });

      return priorities;
    },

    // TODO add group validation
    isValid: function () {
      // sort priorities to validate more important first
      var priorities = this.getConstraintsSortedPriorities();

      // recompute options and rebind constraints to have latest changes
      this.refreshConstraints();

      // if a field is empty and not required, leave it alone, it's just fine
      if ('' === this.getVal()) {
        var indexOfRequired = this.indexOfConstraint('required');

        if (-1 === indexOfRequired || (-1 !== indexOfRequired && false === this.constraints[indexOfRequired].requirements))
          return this.validationResult = [];
      }

      // if we want to validate field against all constraints, just call Validator and let it do the job
      if (false === this.options.stopOnFirstFailingConstraint)
        return true === (this.validationResult = this.Validator.validate(this.getVal(), this.constraints, 'Any'));

      // else, iterate over priorities one by one, and validate related asserts one by one
      for (var i = 0; i < priorities.length; i++)
        if (true !== (this.validationResult = this.Validator.validate(this.getVal(), this.constraints, priorities[i])))
          return false;

      return true;
    },

    getVal: function () {
      // value could be overriden in DOM
      if ('undefined' !== typeof this.options.value)
        return this.options.value;

      // radio input case
      if (this.$element.is('input[type=radio]'))
        return $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').val() || '';

      // checkbox input case
      if (this.$element.is('input[type=checkbox]')) {
        var values = [];

        $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').each(function () {
          values.push($(this).val());
        });

        return values.length ? values : '';
      }

      return this.$element.val();
    },

    refreshConstraints: function () {
      return this.actualizeOptions().bindConstraints();
    },

    bindConstraints: function () {
      var constraints = [];

      // clean all existing DOM constraints to only keep javascript user constraints
      for (var i = 0; i < this.constraints.length; i++)
        if (false === this.constraints[i].isDomConstraint)
          constraints.push(this.constraints[i]);

      this.constraints = constraints;

      // then re-add Parsley DOM-API constraints
      for (var name in this.options)
        this.addConstraint(name, this.options[name]);

      // finally, bind special HTML5 constraints
      return this.bindHtml5Constraints();
    },

    bindHtml5Constraints: function () {
      // html5 required
      if (this.$element.hasClass('required') || this.$element.attr('required'))
        this.addConstraint('required', true, undefined, true);

      // html5 pattern
      if ('string' === typeof this.$element.attr('pattern'))
        this.addConstraint('pattern', this.$element.attr('pattern'), undefined, true);

      // html5 types
      var type = this.$element.attr('type');
      if ('undefined' !== typeof type && new RegExp(type, 'i').test('email url number range tel')) {
        this.addConstraint('type', type, undefined, true);

        // number and range types could have min and/or max values
        if ('undefined' !== typeof this.$element.attr('min') && 'undefined' !== typeof this.$element.attr('max'))
          return this.addConstraint('range', [this.$element.attr('min'), this.$element.attr('max')], undefined, true);

        // min value
        if ('undefined' !== typeof this.$element.attr('min'))
          return this.addConstraint('min', this.$element.attr('min'), undefined, true);

        // max value
        if ('undefined' !== typeof this.$element.attr('max'))
          return this.addConstraint('max', this.$element.attr('max'), undefined, true);
      }

      return this;
    },

    /**
    * Add a new constraint to a field
    *
    * @method addConstraint
    * @param {String}   name
    * @param {Mixed}    requirements      optional
    * @param {Number}   priority          optional
    * @param {Boolean}  isDomConstraint   optional
    */
    addConstraint: function (name, requirements, priority, isDomConstraint) {
      name = name.toLowerCase();

      if ('function' === typeof this.Validator.validators[name]) {
        constraint = new ConstraintFactory(this, name, requirements, priority, isDomConstraint);

        // if constraint already exist, delete it and push new version
        if (-1 !== this.indexOfConstraint(constraint.name))
          this.removeConstraint(constraint.name);

        this.constraints.push(constraint);
      }

      return this;
    },

    removeConstraint: function (name) {
      for (var i = 0; i < this.constraints.length; i++)
        if (name === this.constraints[i].name) {
          this.constraints.splice(i, 1);
          break;
        }

      return this;
    },

    updateConstraint: function (name, parameters, priority) {
      return this.removeConstraint(name)
        .addConstraint(name, parameters, priority);
    },

    indexOfConstraint: function (name) {
      for (var i = 0; i < this.constraints.length; i++)
        if (name === this.constraints[i].name)
          return i;

      return -1;
    },

    reset: function () {
      $.emit('parsley:field:reset', this);
    },

    destroy: function () {
      $.emit('parsley:field:destroy', this);
    },
  };

  return ParsleyField;
});
