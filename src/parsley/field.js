define('parsley/field', [
    'parsley/factory/constraint',
    'parsley/ui',
    'parsley/utils'
], function (ConstraintFactory, ParsleyUI, ParsleyUtils) {
  var ParsleyField = function (field, OptionsFactory, parsleyFormInstance) {
    this.__class__ = 'ParsleyField';
    this.__id__ = ParsleyUtils.hash(4);

    this.$element = $(field);

    // If we have a parent `ParsleyForm` instance given, use its `OptionsFactory`, and save parent
    if ('undefined' !== typeof parsleyFormInstance) {
      this.parent = parsleyFormInstance;
      this.OptionsFactory = this.parent.OptionsFactory;
      this.options = this.OptionsFactory.get(this);

    // Else, take the `Parsley` one
    } else {
      this.OptionsFactory = OptionsFactory;
      this.options = this.OptionsFactory.get(this);
    }

    // Initialize some properties
    this.constraints = [];
    this.constraintsByName = {};
    this.validationResult = [];

    // Bind constraints
    this._bindConstraints();
  };

  ParsleyField.prototype = {
    // # Public API
    // Validate field and $.emit some events for mainly `ParsleyUI`
    // @returns validationResult:
    //  - `true` if all constraints pass
    //  - `[]` if not required field and empty (not validated)
    //  - `[Violation, [Violation...]]` if there were validation errors
    validate: function (force) {
      this.value = this.getValue();

      // Field Validate event. `this.value` could be altered for custom needs
      $.emit('parsley:field:validate', this);

      $.emit('parsley:field:' + (this.isValid(force, this.value) ? 'success' : 'error'), this);

      // Field validated event. `this.validationResult` could be altered for custom needs too
      $.emit('parsley:field:validated', this);

      return this.validationResult;
    },

    // Just validate field. Do not trigger any event
    // Same @return as `validate()`
    isValid: function (force, value) {
      // Recompute options and rebind constraints to have latest changes
      this.refreshConstraints();

      // Sort priorities to validate more important first
      var priorities = this._getConstraintsSortedPriorities();
      if (0 === priorities.length)
        return this.validationResult = [];
      // Value could be passed as argument, needed to add more power to 'parsley:field:validate'
      if ('undefined' === typeof value || null === value)
        value = this.getValue();

      // If a field is empty and not required, leave it alone, it's just fine
      // Except if `data-parsley-validate-if-empty` explicitely added, useful for some custom validators
      if (!value.length && !this._isRequired() && 'undefined' === typeof this.options.validateIfEmpty && true !== force)
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

    // @returns Parsley field computed value that could be overrided or configured in DOM
    getValue: function () {
      var value;

      // Value could be overriden in DOM
      if ('undefined' !== typeof this.options.value)
        value = this.options.value;
      else
        value = this.$element.val();

      // Handle wrong DOM or configurations
      if ('undefined' === typeof value || null === value)
        return '';

      // Use `data-parsley-trim-value="true"` to auto trim inputs entry
      if (true === this.options.trimValue)
        return value.replace(/^\s+|\s+$/g, '');

      return value;
    },

    // Actualize options that could have change since previous validation
    // Re-bind accordingly constraints (could be some new, removed or updated)
    refreshConstraints: function () {
      return this.actualizeOptions()._bindConstraints();
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
        if ('undefined' !== this.constraintsByName[constraint.name])
          this.removeConstraint(constraint.name);

        this.constraints.push(constraint);
        this.constraintsByName[constraint.name] = constraint;
      }

      return this;
    },

    // Remove a constraint
    removeConstraint: function (name) {
      for (var i = 0; i < this.constraints.length; i++)
        if (name === this.constraints[i].name) {
          this.constraints.splice(i, 1);
          break;
        }
      delete this.constraintsByName[name];
      return this;
    },

    // Update a constraint (Remove + re-add)
    updateConstraint: function (name, parameters, priority) {
      return this.removeConstraint(name)
        .addConstraint(name, parameters, priority);
    },

    // # Internals

    // Internal only.
    // Bind constraints from config + options + DOM
    _bindConstraints: function () {
      var constraints = [], constraintsByName = {};

      // clean all existing DOM constraints to only keep javascript user constraints
      for (var i = 0; i < this.constraints.length; i++)
        if (false === this.constraints[i].isDomConstraint) {
          constraints.push(this.constraints[i]);
          constraintsByName[this.constraints[i].name] = this.constraints[i];
        }

      this.constraints = constraints;
      this.constraintsByName = constraintsByName;

      // then re-add Parsley DOM-API constraints
      for (var name in this.options)
        this.addConstraint(name, this.options[name]);

      // finally, bind special HTML5 constraints
      return this._bindHtml5Constraints();
    },

    // Internal only.
    // Bind specific HTML5 constraints to be HTML5 compliant
    _bindHtml5Constraints: function () {
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

    
      // length
      if ('undefined' !== typeof this.$element.attr('minlength') && 'undefined' !== typeof this.$element.attr('maxlength'))
        this.addConstraint('length', [this.$element.attr('minlength'), this.$element.attr('maxlength')], undefined, true);

      // HTML5 minlength
      else if ('undefined' !== typeof this.$element.attr('minlength'))
        this.addConstraint('minlength', this.$element.attr('minlength'), undefined, true);

      // HTML5 maxlength
      else if ('undefined' !== typeof this.$element.attr('maxlength'))
        this.addConstraint('maxlength', this.$element.attr('maxlength'), undefined, true);


      // html5 types
      var type = this.$element.attr('type');

      if ('undefined' === typeof type)
        return this;

      // Small special case here for HTML5 number: integer validator if step attribute is undefined or an integer value, number otherwise
      if ('number' === type) {
        if (('undefined' === typeof this.$element.attr('step')) || (0 === parseFloat(this.$element.attr('step')) % 1)) {
          return this.addConstraint('type', 'integer', undefined, true);
        } else {
          return this.addConstraint('type', 'number', undefined, true);
        }
      // Regular other HTML5 supported types
      } else if (new RegExp(type, 'i').test('email url range')) {
        return this.addConstraint('type', type, undefined, true);
      }
      return this;
    },

    // Internal only.
    // Field is required if have required constraint without `false` value
    _isRequired: function () {
      if ('undefined' === typeof this.constraintsByName.required)
        return false;

      return false !== this.constraintsByName.required.requirements;
    },

    // Internal only.
    // Sort constraints by priority DESC
    _getConstraintsSortedPriorities: function () {
      var priorities = [];

      // Create array unique of priorities
      for (var i = 0; i < this.constraints.length; i++)
        if (-1 === priorities.indexOf(this.constraints[i].priority))
          priorities.push(this.constraints[i].priority);

      // Sort them by priority DESC
      priorities.sort(function (a, b) { return b - a; });

      return priorities;
    }
  };

  return ParsleyField;
});
