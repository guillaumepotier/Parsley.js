define('parsley/ui', [
  'parsley/utils'
], function (ParsleyUtils) {
  var ParsleyUI = function (options) {
    this.__class__ = 'ParsleyUI';

  };

  ParsleyUI.prototype = {
    listen: function () {
      $.listen('parsley:field:init', this, this.setup);
      $.listen('parsley:field:validated', this, this.reflow);
      $.listen('parsley:field:reset', this, this.reset);
      $.listen('parsley:field:destroy', this, this.destroy);

      return this;
    },

    reflow: function (fieldInstance) {
      // if this field has not an active UI (case for multiples) don't bother doing something
      if (false === fieldInstance._ui.active)
        return;

      // diff between two validation results
      var diff = this.diff(fieldInstance.validationResult, fieldInstance._ui.lastValidationResult);

      // then store current validation result for next reflow
      fieldInstance._ui.lastValidationResult = fieldInstance.validationResult;

      // handle valid / invalid field class
      if (true === fieldInstance.validationResult)
        fieldInstance.$element.removeClass(fieldInstance.options.ui.errorClass).addClass(fieldInstance.options.ui.successClass);
      else if (fieldInstance.validationResult.length > 0)
        fieldInstance.$element.removeClass(fieldInstance.options.ui.successClass).addClass(fieldInstance.options.ui.errorClass);
      else
        fieldInstance.$element.removeClass(fieldInstance.options.ui.successClass).removeClass(fieldInstance.options.ui.errorClass);

      // TODO better impl
      for (var i = 0; i < diff.removed.length; i++)
        fieldInstance._ui.$errorsWrapper.find('.parsley-' + diff.removed[i].assert.name).remove();

      for (var i = 0; i < diff.added.length; i++)
        fieldInstance._ui.$errorsWrapper.append($(fieldInstance.options.ui.errorTemplate).addClass('parsley-' + diff.added[i].assert.name).html(diff.added[i].assert.name));

      for (var i = 0; i < diff.kept.length; i++)
        fieldInstance._ui.$errorsWrapper.find('.parsley-' + diff.kept[i].assert.name).html('updated!');
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
      }
    },

    setup: function (fieldInstance) {
      var _ui = { active: false };

      // give field its Parsley id in DOM
      fieldInstance.$element.attr(fieldInstance.options.namespace + 'id', fieldInstance.__id__);

      /** generate important UI elements and store them in fieldInstance **/
      // $errorClassHandler is the $element that woul have parsley-error and parsley-success classes
      _ui.$errorClassHandler = fieldInstance.options.ui.classHandler(fieldInstance) || fieldInstance.$element;
      // $errorsContainer is the $element where errorsWrapper and errors would be appended
      _ui.$errorsContainer = $(fieldInstance.options.errorsContainer) || fieldInstance.options.ui.errorsContainer(fieldInstance);
      // $errorsWrapper is a div that would contain the various field errors, it will be appended into $errorsContainer
      _ui.errorsWrapperId = 'parsley-id-' + ('undefined' !== typeof fieldInstance.options.multiple ? 'multiple-' + fieldInstance.options.multiple : fieldInstance.__id__);
      _ui.$errorsWrapper = $(fieldInstance.options.ui.errorsWrapper).attr('id', _ui.errorsWrapperId);
      // validationResult UI storage to detect what have changed bwt two validations, and update DOM accordingly
      _ui.lastValidationResult = [];

      /** Mess with DOM now **/
      // if do not exist already, insert DOM errors wrapper in the rightful container
      if (0 === $('#' + _ui.errorsWrapperId).length) {
        _ui.active = true;

        if ('undefined' !== typeof _ui.$errorsContainer[0])
          _ui.$errorsContainer.append(_ui.$errorsWrapper);
        else
          if (fieldInstance.options.multiple)
            fieldInstance.$element.parent().after(_ui.$errorsWrapper);
          else
            fieldInstance.$element.after(_ui.$errorsWrapper);
      }

      // store it in fieldInstance for later
      fieldInstance._ui = _ui;

      return this;
    },

    reset: function (fieldInstance) {

    },

    destroy: function (fieldInstance) {

    }
  };

  return ParsleyUI;
});
