define([
  'parsley/utils',
  'parsley/abstract',
  'parsley/form',
  'parsley/field',
  'parsley/multiple'
], function (ParsleyUtils, ParsleyAbstract, ParsleyForm, ParsleyField, ParsleyMultiple) {
  var ParsleyFactory = function (element, options, parsleyFormInstance) {
    this.$element = $(element);

    // If the element has already been bound, returns its saved Parsley instance
    var savedparsleyFormInstance = this.$element.data('Parsley');
    if (savedparsleyFormInstance) {

      // If the saved instance has been bound without a ParsleyForm parent and there is one given in this call, add it
      if ('undefined' !== typeof parsleyFormInstance && savedparsleyFormInstance.parent === window.Parsley) {
        savedparsleyFormInstance.parent = parsleyFormInstance;
        savedparsleyFormInstance._resetOptions(savedparsleyFormInstance.options);
      }

      return savedparsleyFormInstance;
    }

    // Parsley must be instantiated with a DOM element or jQuery $element
    if (!this.$element.length)
      throw new Error('You must bind Parsley on an existing element.');

    if ('undefined' !== typeof parsleyFormInstance && 'ParsleyForm' !== parsleyFormInstance.__class__)
      throw new Error('Parent instance must be a ParsleyForm instance');

    this.parent = parsleyFormInstance || window.Parsley;
    return this.init(options);
  };

  ParsleyFactory.prototype = {
    init: function (options) {
      this.__class__ = 'Parsley';
      this.__version__ = '@@version';
      this.__id__ = ParsleyUtils.generateID();

      // Pre-compute options
      this._resetOptions(options);

      // A ParsleyForm instance is obviously a `<form>` element but also every node that is not an input and has the `data-parsley-validate` attribute
      if (this.$element.is('form') || (ParsleyUtils.checkAttr(this.$element, this.options.namespace, 'validate') && !this.$element.is(this.options.inputs)))
        return this.bind('parsleyForm');

      // Every other element is bound as a `ParsleyField` or `ParsleyFieldMultiple`
      return this.isMultiple() ? this.handleMultiple() : this.bind('parsleyField');
    },

    isMultiple: function () {
      return (this.$element.is('input[type=radio], input[type=checkbox]')) || (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple'));
    },

    // Multiples fields are a real nightmare :(
    // Maybe some refactoring would be appreciated here...
    handleMultiple: function () {
      var
        that = this,
        name,
        multiple,
        parsleyMultipleInstance;

      // Handle multiple name
      if (this.options.multiple)
        multiple = this.options.multiple;
      else if ('undefined' !== typeof this.$element.attr('name') && this.$element.attr('name').length)
        multiple = name = this.$element.attr('name');
      else if ('undefined' !== typeof this.$element.attr('id') && this.$element.attr('id').length)
        multiple = this.$element.attr('id');

      // Special select multiple input
      if (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple')) {
        return this.bind('parsleyFieldMultiple', multiple || this.__id__);

      // Else for radio / checkboxes, we need a `name` or `data-parsley-multiple` to properly bind it
      } else if (!multiple) {
        ParsleyUtils.warn('To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.', this.$element);

        return this;
      }

      // Remove special chars
      multiple = multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g, '');

      // Add proper `data-parsley-multiple` to siblings if we have a valid multiple name
      if ('undefined' !== typeof name) {
        $('input[name="' + name + '"]').each(function () {
          if ($(this).is('input[type=radio], input[type=checkbox]'))
            $(this).attr(that.options.namespace + 'multiple', multiple);
        });
      }

      // Check here if we don't already have a related multiple instance saved
      var $previouslyRelated = $('[' + this.options.namespace + 'multiple="' + multiple +'"]');
      for (var i = 0; i < $previouslyRelated.length; i++) {
        parsleyMultipleInstance = $($previouslyRelated.get(i)).data('Parsley');
        if ('undefined' !== typeof parsleyMultipleInstance) {

          if (!this.$element.data('ParsleyFieldMultiple')) {
            parsleyMultipleInstance.addElement(this.$element);
          }

          break;
        }
      }

      // Create a secret ParsleyField instance for every multiple field. It will be stored in `data('ParsleyFieldMultiple')`
      // And will be useful later to access classic `ParsleyField` stuff while being in a `ParsleyFieldMultiple` instance
      this.bind('parsleyField', multiple, true);

      return parsleyMultipleInstance || this.bind('parsleyFieldMultiple', multiple);
    },

    // Return proper `ParsleyForm`, `ParsleyField` or `ParsleyFieldMultiple`
    bind: function (type, multiple, doNotStore) {
      var parsleyInstance;

      switch (type) {
        case 'parsleyForm':
          parsleyInstance = $.extend(
            new ParsleyForm(this.$element, this.domOptions, this.options),
            window.ParsleyExtend
          )._bindFields();
          break;
        case 'parsleyField':
          parsleyInstance = $.extend(
            new ParsleyField(this.$element, this.domOptions, this.options, this.parent),
            window.ParsleyExtend
          );
          break;
        case 'parsleyFieldMultiple':
          parsleyInstance = $.extend(
            new ParsleyField(this.$element, this.domOptions, this.options, this.parent),
            new ParsleyMultiple(),
            window.ParsleyExtend
          )._init(multiple);
          break;
        default:
          throw new Error(type + 'is not a supported Parsley type');
      }

      if (multiple)
        ParsleyUtils.setAttr(this.$element, this.options.namespace, 'multiple', multiple);

      if ('undefined' !== typeof doNotStore) {
        this.$element.data('ParsleyFieldMultiple', parsleyInstance);

        return parsleyInstance;
      }

       // Store the freshly bound instance in a DOM element for later access using jQuery `data()`
      this.$element.data('Parsley', parsleyInstance);

      // Tell the world we have a new ParsleyForm or ParsleyField instance!
      parsleyInstance._trigger('init');

      return parsleyInstance;
    }
  };

  return ParsleyFactory;
});
