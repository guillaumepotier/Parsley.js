import $ from 'jquery';
import ParsleyUtils from './utils';

var ParsleyUI = {};

var diffResults = function (newResult, oldResult, deep) {
  var added = [];
  var kept = [];

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
    removed: !deep ? diffResults(oldResult, newResult, true).added : []
  };
};

ParsleyUI.Form = {

  actualizeTriggers: function () {
    this.$element.on('submit.Parsley', evt => { this.onSubmitValidate(evt); });
    this.$element.on('click.Parsley', 'input[type="submit"], button[type="submit"]', evt => { this.onSubmitButton(evt); });

    // UI could be disabled
    if (false === this.options.uiEnabled)
      return;

    this.$element.attr('novalidate', '');
  },

  focus: function () {
    this._focusedField = null;

    if (true === this.validationResult || 'none' === this.options.focus)
      return null;

    for (var i = 0; i < this.fields.length; i++) {
      var field = this.fields[i];
      if (true !== field.validationResult && field.validationResult.length > 0 && 'undefined' === typeof field.options.noFocus) {
        this._focusedField = field.$element;
        if ('first' === this.options.focus)
          break;
      }
    }

    if (null === this._focusedField)
      return null;

    return this._focusedField.focus();
  },

  destroyUI: function () {
    // Reset all event listeners
    this.$element.off('.Parsley');
  }

};

ParsleyUI.Field = {

  reflowUI: function () {
    this._buildUI();

    // If this field doesn't have an active UI don't bother doing something
    if (!this._ui)
      return;

    // Diff between two validation results
    var diff = diffResults(this.validationResult, this._ui.lastValidationResult);

    // Then store current validation result for next reflow
    this._ui.lastValidationResult = this.validationResult;

    // Handle valid / invalid / none field class
    this.manageStatusClass();

    // Add, remove, updated errors messages
    this.manageErrorsMessages(diff);

    // Triggers impl
    this.actualizeTriggers();

    // If field is not valid for the first time, bind keyup trigger to ease UX and quickly inform user
    if ((diff.kept.length || diff.added.length) && true !== this._ui.failedOnce)
      this.manageFailingFieldTrigger();
  },

  // Returns an array of field's error message(s)
  getErrorsMessages: function () {
    // No error message, field is valid
    if (true === this.validationResult)
      return [];

    var messages = [];

    for (var i = 0; i < this.validationResult.length; i++)
      messages.push(this.validationResult[i].errorMessage ||
       this._getErrorMessage(this.validationResult[i].assert));

    return messages;
  },

  manageStatusClass: function () {
    if (this.hasConstraints() && this.needsValidation() && true === this.validationResult)
      this._successClass();
    else if (this.validationResult.length > 0)
      this._errorClass();
    else
      this._resetClass();
  },

  manageErrorsMessages: function (diff) {
    if ('undefined' !== typeof this.options.errorsMessagesDisabled)
      return;

    // Case where we have errorMessage option that configure an unique field error message, regardless failing validators
    if ('undefined' !== typeof this.options.errorMessage) {
      if ((diff.added.length || diff.kept.length)) {
        this._insertErrorWrapper();

        if (0 === this._ui.$errorsWrapper.find('.parsley-custom-error-message').length)
          this._ui.$errorsWrapper
            .append(
              $(this.options.errorTemplate)
              .addClass('parsley-custom-error-message')
            );

        return this._ui.$errorsWrapper
          .addClass('filled')
          .find('.parsley-custom-error-message')
          .html(this.options.errorMessage);
      }

      return this._ui.$errorsWrapper
        .removeClass('filled')
        .find('.parsley-custom-error-message')
        .remove();
    }

    // Show, hide, update failing constraints messages
    for (var i = 0; i < diff.removed.length; i++)
      this.removeError(diff.removed[i].assert.name, true);

    for (i = 0; i < diff.added.length; i++)
      this.addError(diff.added[i].assert.name, diff.added[i].errorMessage, diff.added[i].assert, true);

    for (i = 0; i < diff.kept.length; i++)
      this.updateError(diff.kept[i].assert.name, diff.kept[i].errorMessage, diff.kept[i].assert, true);
  },

  // TODO: strange API here, intuitive for manual usage with addError(pslyInstance, 'foo', 'bar')
  // but a little bit complex for above internal usage, with forced undefined parameter...
  addError: function (name, message, assert, doNotUpdateClass) {
    this._insertErrorWrapper();
    this._ui.$errorsWrapper
      .addClass('filled')
      .append(
        $(this.options.errorTemplate)
        .addClass('parsley-' + name)
        .html(message || this._getErrorMessage(assert))
      );

    if (true !== doNotUpdateClass)
      this._errorClass();
  },

  // Same as above
  updateError: function (name, message, assert, doNotUpdateClass) {
    this._ui.$errorsWrapper
      .addClass('filled')
      .find('.parsley-' + name)
      .html(message || this._getErrorMessage(assert));

    if (true !== doNotUpdateClass)
      this._errorClass();
  },

  // Same as above twice
  removeError: function (name, doNotUpdateClass) {
    this._ui.$errorsWrapper
      .removeClass('filled')
      .find('.parsley-' + name)
      .remove();

    // edge case possible here: remove a standard Parsley error that is still failing in this.validationResult
    // but highly improbable cuz' manually removing a well Parsley handled error makes no sense.
    if (true !== doNotUpdateClass)
      this.manageStatusClass();
  },

  _getErrorMessage: function (constraint) {
    var customConstraintErrorMessage = constraint.name + 'Message';

    if ('undefined' !== typeof this.options[customConstraintErrorMessage])
      return window.Parsley.formatMessage(this.options[customConstraintErrorMessage], constraint.requirements);

    return window.Parsley.getErrorMessage(constraint);
  },

  _buildUI: function () {
    // UI could be already built or disabled
    if (this._ui || false === this.options.uiEnabled)
      return;

    var _ui = {};

    // Give field its Parsley id in DOM
    this.$element.attr(this.options.namespace + 'id', this.__id__);

    /** Generate important UI elements and store them in this **/
    // $errorClassHandler is the $element that woul have parsley-error and parsley-success classes
    _ui.$errorClassHandler = this._manageClassHandler();

    // $errorsWrapper is a div that would contain the various field errors, it will be appended into $errorsContainer
    _ui.errorsWrapperId = 'parsley-id-' + (this.options.multiple ? 'multiple-' + this.options.multiple : this.__id__);
    _ui.$errorsWrapper = $(this.options.errorsWrapper).attr('id', _ui.errorsWrapperId);

    // ValidationResult UI storage to detect what have changed bwt two validations, and update DOM accordingly
    _ui.lastValidationResult = [];
    _ui.validationInformationVisible = false;

    // Store it in this for later
    this._ui = _ui;
  },

  // Determine which element will have `parsley-error` and `parsley-success` classes
  _manageClassHandler: function () {
    // An element selector could be passed through DOM with `data-parsley-class-handler=#foo`
    if ('string' === typeof this.options.classHandler && $(this.options.classHandler).length)
      return $(this.options.classHandler);

    // Class handled could also be determined by function given in Parsley options
    var $handler = this.options.classHandler();

    // If this function returned a valid existing DOM element, go for it
    if ('undefined' !== typeof $handler && $handler.length)
      return $handler;

    // Otherwise, if simple element (input, texatrea, select...) it will perfectly host the classes
    if (!this.options.multiple || this.$element.is('select'))
      return this.$element;

    // But if multiple element (radio, checkbox), that would be their parent
    return this.$element.parent();
  },

  _insertErrorWrapper: function () {
    var $errorsContainer;

    // Nothing to do if already inserted
    if (0 !== this._ui.$errorsWrapper.parent().length)
      return this._ui.$errorsWrapper.parent();

    if ('string' === typeof this.options.errorsContainer) {
      if ($(this.options.errorsContainer).length)
        return $(this.options.errorsContainer).append(this._ui.$errorsWrapper);
      else
        ParsleyUtils.warn('The errors container `' + this.options.errorsContainer + '` does not exist in DOM');
    } else if ('function' === typeof this.options.errorsContainer)
      $errorsContainer = this.options.errorsContainer();

    if ('undefined' !== typeof $errorsContainer && $errorsContainer.length)
      return $errorsContainer.append(this._ui.$errorsWrapper);

    var $from = this.$element;
    if (this.options.multiple)
      $from = $from.parent();
    return $from.after(this._ui.$errorsWrapper);
  },

  actualizeTriggers: function () {
    var $toBind = this._findRelated();

    // Remove Parsley events already binded on this field
    $toBind.off('.Parsley');

    // If no trigger is set, all good
    if (false === this.options.trigger)
      return;

    var triggers = this.options.trigger.replace(/^\s+/g , '').replace(/\s+$/g , '');

    if ('' === triggers)
      return;

    $toBind.on(
      triggers.split(' ').join('.Parsley ') + '.Parsley',
      event => { this.eventValidate(event); }
    );
  },

  eventValidate: function (event) {
    // For keyup, keypress, keydown... events that could be a little bit obstrusive
    // do not validate if val length < min threshold on first validation. Once field have been validated once and info
    // about success or failure have been displayed, always validate with this trigger to reflect every yalidation change.
    if (/key/.test(event.type))
      if (!(this._ui && field._ui.validationInformationVisible) && this.getValue().length <= this.options.validationThreshold)
        return;

    this.validate();
  },

  manageFailingFieldTrigger: function () {
    this._ui.failedOnce = true;

    // Radio and checkboxes fields must bind every field multiple
    if (this.options.multiple)
      this._findRelated().each((_, element) => {
        if (!/change/i.test($(element).parsley().options.trigger || ''))
          $(element).on('change.ParsleyFailedOnce', () => { this.validate(); });
      });

    // Select case
    if (this.$element.is('select'))
      if (!/change/i.test(this.options.trigger || ''))
        return this.$element.on('change.ParsleyFailedOnce', () => { this.validate(); });

    // All other inputs fields
    if (!/keyup/i.test(this.options.trigger || ''))
      return this.$element.on('keyup.ParsleyFailedOnce', () => { this.validate(); });
  },

  resetUI: function () {
    // Reset all event listeners
    this.actualizeTriggers();
    this.$element.off('.ParsleyFailedOnce');

    // Nothing to do if UI never initialized for this field
    if ('undefined' === typeof this._ui)
      return;

    // Reset all errors' li
    this._ui.$errorsWrapper
      .removeClass('filled')
      .children()
      .remove();

    // Reset validation class
    this._resetClass();

    // Reset validation flags and last validation result
    this._ui.lastValidationResult = [];
    this._ui.validationInformationVisible = false;
    this._ui.failedOnce = false;
  },

  destroyUI: function () {
    this.resetUI();

    if ('undefined' !== typeof this._ui)
      this._ui.$errorsWrapper.remove();

    delete this._ui;
  },

  _successClass: function () {
    this._ui.validationInformationVisible = true;
    this._ui.$errorClassHandler.removeClass(this.options.errorClass).addClass(this.options.successClass);
  },
  _errorClass: function () {
    this._ui.validationInformationVisible = true;
    this._ui.$errorClassHandler.removeClass(this.options.successClass).addClass(this.options.errorClass);
  },
  _resetClass: function () {
    this._ui.$errorClassHandler.removeClass(this.options.successClass).removeClass(this.options.errorClass);
  }
};

export default ParsleyUI;
