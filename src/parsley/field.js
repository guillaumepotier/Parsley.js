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
    this.$element = $(field);
    this.options = this.parsleyInstance.OptionsFactory.get(this);
  };

  ParsleyField.prototype = {
    init: function () {
      this.constraints = [];
      this.validationResult = [];
      this.bindConstraints();

      return this;
    },

    // Returns validationResult. For field, it could be:
    //  - `true` if all green
    //  - `[]` if non required field and empty
    //  - `[Violation, [Violation..]]` if errors
    validate: function (force) {
      this.value = this.getValue();

      // Field Validate event. `this.value` could be altered for custom needs
      $.emit('parsley:field:validate', this);

      $.emit('parsley:field:' + (this.isValid(force, this.value) ? 'success' : 'error'), this);

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
    isValid: function (force, value) {
      // Recompute options and rebind constraints to have latest changes
      this.refreshConstraints();

      // Sort priorities to validate more important first
      var priorities = this.getConstraintsSortedPriorities();

      // Value could be passed as argument, needed to add more power to 'parsley:field:validate'
      value = value || this.getValue();

      // If a field is empty and not required, leave it alone, it's just fine
      // Except if `data-parsley-validate-if-empty` explicitely added, useful for some custom validators
      if (0 === value.length && !this.isRequired() && 'undefined' === typeof this.options.validateIfEmpty && 'undefined' === typeof force)
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
      var value;

      // Value could be overriden in DOM
      if ('undefined' !== typeof this.options.value)
        value = this.options.value;
      else
        value = this.$element.val();

      // Use `data-parsley-trim-value="true"` to auto trim inputs entry
      if (true === this.options.trimValue)
        return value.replace(/^\s+|\s+$/g, '');

      return value;
    },

    refreshConstraints: function () {
      this.actualizeOptions().bindConstraints();

      return this;
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
        var constraint = new ConstraintFactory(this, name, requirements, priority, isDomConstraint);

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
