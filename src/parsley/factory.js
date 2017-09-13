import $ from 'jquery';
import Utils from './utils';
import Base from './base';
import Form from './form';
import Field from './field';
import Multiple from './multiple';

var Factory = function (element, options, parsleyFormInstance) {
  this.element = element;
  this.$element = $(element);

  // If the element has already been bound, returns its saved Parsley instance
  var savedparsleyFormInstance = this.$element.data('Parsley');
  if (savedparsleyFormInstance) {

    // If the saved instance has been bound without a Form parent and there is one given in this call, add it
    if ('undefined' !== typeof parsleyFormInstance && savedparsleyFormInstance.parent === window.Parsley) {
      savedparsleyFormInstance.parent = parsleyFormInstance;
      savedparsleyFormInstance._resetOptions(savedparsleyFormInstance.options);
    }

    if ('object' === typeof options) {
      Object.assign(savedparsleyFormInstance.options, options);
    }

    return savedparsleyFormInstance;
  }

  // Parsley must be instantiated with a DOM element or jQuery $element
  if (!this.$element.length)
    throw new Error('You must bind Parsley on an existing element.');

  if ('undefined' !== typeof parsleyFormInstance && 'Form' !== parsleyFormInstance.__class__)
    throw new Error('Parent instance must be a Form instance');

  this.parent = parsleyFormInstance || window.Parsley;
  return this.init(options);
};

Factory.prototype = {
  init: function (options) {
    this.__class__ = 'Parsley';
    this.__version__ = '@@version';
    this.__id__ = Utils.generateID();

    // Pre-compute options
    this._resetOptions(options);

    // A Form instance is obviously a `<form>` element but also every node that is not an input and has the `data-parsley-validate` attribute
    if (this.element.nodeName === 'FORM' || (Utils.checkAttr(this.element, this.options.namespace, 'validate') && !this.$element.is(this.options.inputs)))
      return this.bind('parsleyForm');

    // Every other element is bound as a `Field` or `FieldMultiple`
    return this.isMultiple() ? this.handleMultiple() : this.bind('parsleyField');
  },

  isMultiple: function () {
    var type = Utils.getType(this.element);
    return ((type === 'radio' || type === 'checkbox') ||
      (this.element.nodeName === 'SELECT' && null !== this.element.getAttribute('multiple')));
  },

  // Multiples fields are a real nightmare :(
  // Maybe some refactoring would be appreciated here...
  handleMultiple: function () {
    var name;
    var multiple;
    var parsleyMultipleInstance;

    // Handle multiple name
    this.options.multiple = this.options.multiple ||
      (name = this.element.getAttribute('name')) ||
      this.element.getAttribute('id');

    // Special select multiple input
    if (this.element.nodeName === 'SELECT' && null !== this.element.getAttribute('multiple')) {
      this.options.multiple = this.options.multiple || this.__id__;
      return this.bind('parsleyFieldMultiple');

    // Else for radio / checkboxes, we need a `name` or `data-parsley-multiple` to properly bind it
    } else if (!this.options.multiple) {
      Utils.warn('To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.', this.$element);
      return this;
    }

    // Remove special chars
    this.options.multiple = this.options.multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g, '');

    // Add proper `data-parsley-multiple` to siblings if we have a valid multiple name
    if (name) {
      $('input[name="' + name + '"]').each((i, input) => {
        var type = Utils.getType(input);
        if ((type === 'radio' || type === 'checkbox'))
          input.setAttribute(this.options.namespace + 'multiple', this.options.multiple);
      });
    }

    // Check here if we don't already have a related multiple instance saved
    var $previouslyRelated = this._findRelated();
    for (var i = 0; i < $previouslyRelated.length; i++) {
      parsleyMultipleInstance = $($previouslyRelated.get(i)).data('Parsley');
      if ('undefined' !== typeof parsleyMultipleInstance) {

        if (!this.$element.data('FieldMultiple')) {
          parsleyMultipleInstance.addElement(this.$element);
        }

        break;
      }
    }

    // Create a secret Field instance for every multiple field. It will be stored in `data('FieldMultiple')`
    // And will be useful later to access classic `Field` stuff while being in a `FieldMultiple` instance
    this.bind('parsleyField', true);

    return parsleyMultipleInstance || this.bind('parsleyFieldMultiple');
  },

  // Return proper `Form`, `Field` or `FieldMultiple`
  bind: function (type, doNotStore) {
    var parsleyInstance;

    switch (type) {
      case 'parsleyForm':
        parsleyInstance = $.extend(
          new Form(this.element, this.domOptions, this.options),
          new Base(),
          window.ParsleyExtend
        )._bindFields();
        break;
      case 'parsleyField':
        parsleyInstance = $.extend(
          new Field(this.element, this.domOptions, this.options, this.parent),
          new Base(),
          window.ParsleyExtend
        );
        break;
      case 'parsleyFieldMultiple':
        parsleyInstance = $.extend(
          new Field(this.element, this.domOptions, this.options, this.parent),
          new Multiple(),
          new Base(),
          window.ParsleyExtend
        )._init();
        break;
      default:
        throw new Error(type + 'is not a supported Parsley type');
    }

    if (this.options.multiple)
      Utils.setAttr(this.element, this.options.namespace, 'multiple', this.options.multiple);

    if ('undefined' !== typeof doNotStore) {
      this.$element.data('FieldMultiple', parsleyInstance);

      return parsleyInstance;
    }

    // Store the freshly bound instance in a DOM element for later access using jQuery `data()`
    this.$element.data('Parsley', parsleyInstance);

    // Tell the world we have a new Form or Field instance!
    parsleyInstance._actualizeTriggers();
    parsleyInstance._trigger('init');

    return parsleyInstance;
  }
};

export default Factory;
