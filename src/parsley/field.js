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
    return this.init($(field), parsleyInstance.options);
  };

  ParsleyField.prototype = {
    init: function ($element, options) {
      this.constraints = [];
      this.$element = $element;
      this.validationResult = [];
      this.options = this.parsleyInstance.OptionsFactory.get(this);

      // Select / radio / checkbox multiple inputs hack
      if ((this.$element.is('input[type=radio], input[type=checkbox]') && 'undefined' === typeof this.options.multiple) || (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple'))) {
        if ('undefined' === typeof this.$element.attr('name') && 'undefined' === typeof this.$element.attr('id')) {
          if (window.console && window.console.warn)
            window.console.warn('To be binded by Parsley, a radio, a checkbox and a multiple select input must have either a name, and id or a multiple option.', this.$element);

          return this.parsleyInstance;
        }

        this.options.multiple = (this.$element.attr('name') || this.$element.attr('id')).replace(/(:|\.|\[|\]|\$)/g, '');
        ParsleyUtils.setAttr(this.$element, this.options.namespace, 'multiple', this.options.multiple);
      }

      return this.bindConstraints();
    },

    // Returns validationResult. For field, it could be:
    //  - `true` if all green
    //  - `[]` if non required field and empty
    //  - `[Violation, [Violation..]]` if errors
    validate: function () {
      this.value = this.getValue();

      // Field Validate event. `this.value` could be altered for custom needs
      $.emit('parsley:field:validate', this);

      $.emit('parsley:field:' + (this.isValid(this.value) ? 'success' : 'error'), this);

      // Field validated event. `this.validationResult` could be altered for custom needs too
      $.emit('parsley:field:validated', this);

      return this.validationResult;
    },

    getConstraintsSortedPriorities: function () {
      var priorities = [];

      // Create array unique of priorities
      for (var i = 0; i < this.constraints.length; i++)
        if (-1 === priorities.indexOf(this.constraints[i].priority))
          priorities.push(this.constraints[i].priority);

      // Sort them by priority DESC
      priorities.sort(function (a, b) { return b - a; });

      return priorities;
    },

    // Same @return as `validate()`
    isValid: function (value) {
      // Sort priorities to validate more important first
      var priorities = this.getConstraintsSortedPriorities();

      // Value could be passed as argument, needed to add more power to 'parsley:field:validate'
      value = value || this.getValue();

      // Recompute options and rebind constraints to have latest changes
      this.refreshConstraints();

      // If a field is empty and not required, leave it alone, it's just fine
      // Except if `data-parsley-validate-if-empty` explicitely added, useful for some custom validators
      // And if multiple field
      if ('' === value && !this.isRequired() && 'undefined' === typeof this.options.validateIfEmpty && 'undefined' === typeof this.options.multiple)
        return this.validationResult = [];

      // If we want to validate field against all constraints, just call Validator and let it do the job
      if (false === this.options.priorityEnabled)
        return true === (this.validationResult = this.validateThroughValidator(value, this.constraints, 'Any'));

      // Else, iterate over priorities one by one, and validate related asserts one by one
      for (var i = 0; i < priorities.length; i++)
        if (true !== (this.validationResult = this.validateThroughValidator(value, this.constraints, priorities[i])))
          return false;

      return true;
    },

    // Field is required if have required constraint without `false` value
    isRequired: function () {
      var constraintIndex = this._constraintIndex('required');

      return !(-1 === constraintIndex || (-1 !== constraintIndex && false === this.constraints[constraintIndex].requirements));
    },

    getValue: function () {
      // Value could be overriden in DOM
      if ('undefined' !== typeof this.options.value)
        return this.options.value;

      // Regular input, textarea and simple select
      if ('undefined' === typeof this.options.multiple)
        return this.$element.val();

      // Radio input case
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

      // Select multiple case
      if (this.$element.is('select'))
        return null === this.$element.val() ? '' : this.$element.val();
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

      // range
      if ('undefined' !== typeof this.$element.attr('min') && 'undefined' !== typeof this.$element.attr('max'))
        this.addConstraint('range', [this.$element.attr('min'), this.$element.attr('max')], undefined, true);

      // HTML5 min
      else if ('undefined' !== typeof this.$element.attr('min'))
        this.addConstraint('min', this.$element.attr('min'), undefined, true);

      // HTML5 max
      else if ('undefined' !== typeof this.$element.attr('max'))
        this.addConstraint('max', this.$element.attr('max'), undefined, true);

      // html5 types
      var type = this.$element.attr('type');

      if ('undefined' === typeof type)
        return this;

      // Small special case here for HTML5 number, that is in fact an integer validator
      if ('number' === type)
        return this.addConstraint('type', 'integer', undefined, true);

      // Regular other HTML5 supported types
      else if (new RegExp(type, 'i').test('email url range'))
        return this.addConstraint('type', type, undefined, true);
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

      if ('function' === typeof window.ParsleyValidator.validators[name]) {
        constraint = new ConstraintFactory(this, name, requirements, priority, isDomConstraint);

        // if constraint already exist, delete it and push new version
        if (-1 !== this._constraintIndex(constraint.name))
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

    _constraintIndex: function (name) {
      for (var i = 0; i < this.constraints.length; i++)
        if (name === this.constraints[i].name)
          return i;

      return -1;
    }
  };

  return ParsleyField;
});
