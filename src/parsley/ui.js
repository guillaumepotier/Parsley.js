define('parsley/ui', [
  'parsley/utils'
], function (ParsleyUtils) {
  var ParsleyUI = function (options) {
    this.__class__ = 'ParsleyUI';
  };

  ParsleyUI.prototype = {
    listen: function () {
      $.listen('parsley:form:init', this, this.setupForm);
      $.listen('parsley:field:init', this, this.setupField);

      $.listen('parsley:field:validated', this, this.reflow);
      $.listen('parsley:form:validated', this, this.focus);

      $.listen('parsley:field:reset', this, this.reset);

      $.listen('parsley:form:destroy', this, this.destroy);
      $.listen('parsley:field:destroy', this, this.destroy);
    },

    reflow: function (fieldInstance) {
      // If this field has not an active UI (case for multiples) don't bother doing something
      if ('undefined' === typeof fieldInstance._ui || false === fieldInstance._ui.active)
        return;

      // Diff between two validation results
      var diff = this.diff(fieldInstance.validationResult, fieldInstance._ui.lastValidationResult);

      // Then store current validation result for next reflow
      fieldInstance._ui.lastValidationResult = fieldInstance.validationResult;

      // Field have been validated at least once if here. Useful for binded key events..
      fieldInstance._ui.validatedOnce = true;

      // Handle valid / invalid / none field class
      this.manageStatusClass(fieldInstance);

      // Add, remove, updated errors messages
      this.manageErrorsMessages(fieldInstance, diff);

      // Triggers impl
      this.actualizeTriggers(fieldInstance);

      // If field is not valid for the first time, bind keyup trigger to ease UX and quickly inform user
      if ((diff.kept.length || diff.added.length) && 'undefined' === typeof fieldInstance._ui.failedOnce)
        this.manageFailingFieldTrigger(fieldInstance);
    },

    manageStatusClass: function (fieldInstance) {
      if (true === fieldInstance.validationResult)
        this._successClass(fieldInstance);
      else if (fieldInstance.validationResult.length > 0)
        this._errorClass(fieldInstance);
      else
        this._resetClass(fieldInstance);
    },

    manageErrorsMessages: function (fieldInstance, diff) {
      // Case where we have errorMessage option that configure an unique field error message, regardless failing validators
      if ('undefined' !== typeof fieldInstance.options.errorMessage) {
        if ((diff.added.length || diff.kept.length)) {
          if (0 === fieldInstance._ui.$errorsWrapper.find('.parsley-custom-error-message').length)
            fieldInstance._ui.$errorsWrapper
              .append($(fieldInstance.options.errorTemplate)
              .addClass('parsley-error parsley-custom-error-message'));

          fieldInstance._ui.$errorsWrapper
            .addClass('filled')
            .find('.parsley-custom-error-message')
            .html(fieldInstance.options.errorMessage);
        } else {
          fieldInstance._ui.$errorsWrapper
            .removeClass('filled')
            .find('.parsley-custom-error-message')
            .remove();
        }

        return;
      }

      // Show, hide, update failing constraints messages
      for (var i = 0; i < diff.removed.length; i++)
        fieldInstance._ui.$errorsWrapper
          .removeClass('filled')
          .find('.parsley-' + diff.removed[i].assert.name)
          .remove();

      for (i = 0; i < diff.added.length; i++)
        fieldInstance._ui.$errorsWrapper
          .addClass('filled')
          .append($(fieldInstance.options.errorTemplate)
          .addClass('parsley-error parsley-' + diff.added[i].assert.name)
          .html(this.getErrorMessage(fieldInstance, diff.added[i].assert)));

      for (i = 0; i < diff.kept.length; i++)
        fieldInstance._ui.$errorsWrapper
          .addClass('filled')
          .find('.parsley-' + diff.kept[i].assert.name)
          .html(this.getErrorMessage(fieldInstance, diff.kept[i].assert));
    },

    focus: function (formInstance) {
      if (true === formInstance.validationResult || 'none' === formInstance.options.focus)
        return;

      var lastFailingField;

      for (var i = 0; i < formInstance.fields.length; i++)
        if (true !== formInstance.fields[i].validationResult && formInstance.fields[i].validationResult.length > 0) {
          if ('first' === formInstance.options.focus)
            return formInstance.fields[i].$element.focus();

          lastFailingField = formInstance.fields[i];
        }

      return lastFailingField.$element.focus();
    },

    getErrorMessage: function (fieldInstance, constraint) {
      var customConstraintErrorMessage = constraint.name + 'Message';

      if ('undefined' !== typeof fieldInstance.options[customConstraintErrorMessage])
        return fieldInstance.options[customConstraintErrorMessage];

      return window.ParsleyValidator.getErrorMessage(constraint);
    },

    diff: function (newResult, oldResult, deep) {
      var added = [],
        kept = [];

      for (var i = 0; i < newResult.length; i++) {
        var found = false;

        for (var j = 0; j < oldResult.length; j++)
          if (newResult[i].assert.name === oldResult[j].assert.name) {
            found = true;
            break;
          }

        if (found)
          kept.push(newResult[i]);
        else
          added.push(newResult[i]);
      }

      return {
        kept: kept,
        added: added,
        removed: !deep ? this.diff(oldResult, newResult, true).added : []
      };
    },

    setupForm: function (formInstance) {
      formInstance.$element.on('submit.Parsley', false, $.proxy(formInstance.onSubmitValidate, formInstance));

      // UI could be disabled
      if (false === formInstance.options.uiEnable)
        return;

      formInstance.$element.attr('novalidate', '');
    },

    setupField: function (fieldInstance) {
      var _ui = { active: false };

      // UI could be disabled
      if (false === fieldInstance.options.uiEnable)
        return;

      // Give field its Parsley id in DOM
      fieldInstance.$element.attr(fieldInstance.options.namespace + 'id', fieldInstance.__id__);

      /** Generate important UI elements and store them in fieldInstance **/
      // $errorClassHandler is the $element that woul have parsley-error and parsley-success classes
      _ui.$errorClassHandler = fieldInstance.options.classHandler(fieldInstance) || fieldInstance.$element;

      // $errorsContainer is the $element where errorsWrapper and errors would be appended
      // `data-parsley-errors-container="#element"`
      if ('string' === typeof fieldInstance.options.errorsContainer)
        _ui.$errorsContainer = $(fieldInstance.options.errorsContainer);

      // Advanced configuration by a user cutom function that could be passed in options
      if ('function' === typeof fieldInstance.options.errorsContainer)
        _ui.$errorsContainer = fieldInstance.options.errorsContainer(fieldInstance);

      // $errorsWrapper is a div that would contain the various field errors, it will be appended into $errorsContainer
      _ui.errorsWrapperId = 'parsley-id-' + ('undefined' !== typeof fieldInstance.options.multiple ? 'multiple-' + fieldInstance.options.multiple : fieldInstance.__id__);
      _ui.$errorsWrapper = $(fieldInstance.options.errorsWrapper).attr('id', _ui.errorsWrapperId);
      // ValidationResult UI storage to detect what have changed bwt two validations, and update DOM accordingly
      _ui.lastValidationResult = [];
      _ui.validatedOnce = false;
      _ui.validationInformationVisible = false;

      /** Mess with DOM now **/
      // If do not exist already, insert DOM errors wrapper in the rightful container
      if (0 === $('#' + _ui.errorsWrapperId).length) {
        _ui.active = true;

        if ('undefined' !== typeof _ui.$errorsContainer && 'undefined' !== typeof _ui.$errorsContainer[0])
          _ui.$errorsContainer.append(_ui.$errorsWrapper);
        else
          if (fieldInstance.options.multiple)
            fieldInstance.$element.parent().after(_ui.$errorsWrapper);
          else
            fieldInstance.$element.after(_ui.$errorsWrapper);
      }

      // Store it in fieldInstance for later
      fieldInstance._ui = _ui;

      // Bind triggers first time
      this.actualizeTriggers(fieldInstance);
    },

    actualizeTriggers: function (fieldInstance) {
      // Remove Parsley events already binded on this field
      fieldInstance.$element.off('.Parsley');

      // If no trigger is set, all good
      if (false === fieldInstance.options.trigger)
        return;

      var triggers = fieldInstance.options.trigger.replace(/^\s+/g , '').replace(/\s+$/g , '');

      if ('' === triggers)
        return;

      // Bind fieldInstance.eventValidate if exists (for parsley.ajax for example), ParsleyUI.eventValidate otherwise
      fieldInstance.$element
        .on(
          triggers.split(' ').join('.Parsley ') + '.Parsley',
          false,
          $.proxy('function' === typeof fieldInstance.eventValidate ? fieldInstance.eventValidate : this.eventValidate, fieldInstance));
    },

    // Called through $.proxy with fieldInstance. `this` context is ParsleyField
    eventValidate: function(event) {
      // For keyup, keypress, keydown.. events that could be a little bit obstrusive
      // do not validate if val length < min tresshold on first validation. Once field have been validated once and info
      // about success or failure have been displayed, always validate with this trigger to reflect every yalidation change.
      if (new RegExp('key').test(event.type))
        if (!this._ui.validationInformationVisible && this.getValue().length <= this.options.validationTresshold)
          return;

      this._ui.validatedOnce = true;
      this.validate();
    },

    manageFailingFieldTrigger: function (fieldInstance) {
      fieldInstance._ui.failedOnce = true;

      // Radio and checkboxes fields
      if (fieldInstance.options.multiple)
        $('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function () {
          if (!new RegExp('change', 'i').test($(this).parsley().options.trigger || ''))
            return $(this).parsley().$element.on('change.ParsleyFailedOnce', false, $.proxy(fieldInstance.validate, fieldInstance));
        });

      // All other inputs fields
      if (!new RegExp('keyup', 'i').test(fieldInstance.options.trigger || ''))
        return fieldInstance.$element.on('keyup.ParsleyFailedOnce', false, $.proxy(fieldInstance.validate, fieldInstance));
    },

    reset: function (parsleyInstance) {
      // Reset all event listeners
      parsleyInstance.$element.off('.Parsley');
      parsleyInstance.$element.off('.ParsleyFailedOnce');

      if ('ParsleyForm' === parsleyInstance.__class__)
        return;

      // Reset all errors' li
      parsleyInstance._ui.$errorsWrapper.children().each(function () {
        $(this).remove();
      });

      // Reset validation class
      this._resetClass(parsleyInstance);

      // Reset validation flags and last validation result
      parsleyInstance._ui.validatedOnce = false;
      parsleyInstance._ui.lastValidationResult = [];
      parsleyInstance._ui.validationInformationVisible = false;
    },

    destroy: function (parsleyInstance) {
      this.reset(parsleyInstance);

      if ('ParsleyForm' === parsleyInstance.__class__)
        return;

      parsleyInstance._ui.$errorsWrapper.remove();
      delete parsleyInstance._ui;
    },

    _successClass: function (fieldInstance) {
      fieldInstance._ui.validationInformationVisible = true;
      fieldInstance.$element.removeClass(fieldInstance.options.errorClass).addClass(fieldInstance.options.successClass);
    },
    _errorClass: function (fieldInstance) {
      fieldInstance._ui.validationInformationVisible = true;
      fieldInstance.$element.removeClass(fieldInstance.options.successClass).addClass(fieldInstance.options.errorClass);
    },
    _resetClass: function (fieldInstance) {
      fieldInstance.$element.removeClass(fieldInstance.options.successClass).removeClass(fieldInstance.options.errorClass);
    }
  };

  return ParsleyUI;
});
