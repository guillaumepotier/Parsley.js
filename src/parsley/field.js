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
    this.UI = new ParsleyUI(this, parsleyInstance.options);
    this.init($(field), parsleyInstance.options);
  };

  ParsleyField.prototype = {
    init: function ($element, options) {
      this.constraints = [];
      this.$element = $element;

      this.options = this.parsleyInstance.OptionsFactory.get(this);

      this.validationResult = null;
      this.hash = this.generateHash();
      this.ParsleyValidator = this.parsleyInstance.ParsleyValidator;
      this.bind();
    },

    validate: function () {
      this.options.listeners.onFieldValidate(this);

      if (this.isValid())
        this.options.listeners.onFieldSuccess(this);
      else
        this.options.listeners.onFieldError(this);

      // UI event here
      this.UI.reflow();

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
      var priorities = this.getConstraintsSortedPriorities();

      // recompute options and rebind constraints to have latest changes
      this.refreshConstraints();

      // if we want to validate field against all constraints, just call Validator
      if (false === this.options.stopOnFirstFailingConstraint)
        return true === (this.validationResult = this.ParsleyValidator.validate(this.getVal(), this.constraints, 'Any'));

      // else, iterate over priorities one by one, and validate related asserts one by one
      for (var i = 0; i < priorities.length; i++)
        if (true !== (this.validationResult = this.ParsleyValidator.validate(this.getVal(), this.constraints, priorities[i])))
          return false;

      return true;
    },

    getVal: function () {
      // todo: group (radio, checkboxes..)
      if ('undefined' !== typeof this.options['value'])
        return this.options['value'];

      return this.$element.val();
    },

    bind: function () {
      this.bindConstraints();
      this.bindTriggers();

      return this;
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
        this.addConstraint(ParsleyUtils.makeObject(name, this.options[name]));

      // finally, bind special HTML5 constraints
      return this.bindHtml5Constraints();
    },

    // TODO include $element.attrs() in this.options to avoid some of these html5 tests ?
    bindHtml5Constraints: function () {
      // html5 required
      if (this.$element.hasClass('required') || this.$element.attr('required'))
        this.addConstraint({ required: true }, undefined, true);

      // html5 pattern
      if ('string' === typeof this.$element.attr('pattern'))
        this.addConstraint({ pattern: this.$element.attr('pattern')}, undefined, true);

      // html5 types
      var type = this.$element.attr('type');
      if ('undefined' !== typeof type && new RegExp(type, 'i').test('email url number range tel')) {
        this.addConstraint({ type: type }, undefined, true);

        // number and range types could have min and/or max values
        if ('undefined' !== typeof this.$element.attr('min') && 'undefined' !== typeof this.$element.attr('max'))
          return this.addConstraint({ range: [this.$element.attr('min'), this.$element.attr('max')] }, undefined, true);

        // min value
        if ('undefined' !== typeof this.$element.attr('min'))
          return this.addConstraint({ min: this.$element.attr('min') }, undefined, true);

        // max value
        if ('undefined' !== typeof this.$element.attr('max'))
          return this.addConstraint({ max: this.$element.attr('max') }, undefined, true);
      }

      return this;
    },

    bindTriggers: function () {},

    /**
    * Add a new constraint to a field
    *
    * @method addConstraint
    * @param {Object}   constraint        { name: requirements }
    * @param {Number}   priority          optional
    * @param {Boolean}  isDomConstraint   optional
    */
    addConstraint: function (constraint, priority, isDomConstraint) {
      constraint = ParsleyUtils.keyValue(constraint);
      constraint.key = constraint.key.toLowerCase();

      if ('function' === typeof this.ParsleyValidator.validators[constraint.key]) {
        constraint = new ConstraintFactory(this, constraint.key, constraint.value, priority, isDomConstraint);

        // if constraint already exist, delete it and push new version
        if (true === this.hasConstraint(constraint.name))
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

    updateConstraint: function (constraint, priority) {
      return this.removeConstraint(constraint.name)
        .addConstraint(constraint, priority);
    },

    hasConstraint: function (name) {
      for (var i = 0; i < this.constraints.length; i++)
        if (name === this.constraints[i].name)
          return true;

      return false;
    },

    generateHash: function () {
      if (this.group)
        return 'parsley-' + this.group;

      return 'parsley-' + this.__id__;
    },

    reset: function () {},
    destroy: function () {}
  };

  return ParsleyField;
});
