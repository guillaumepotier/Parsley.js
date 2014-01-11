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

      return this;
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
      var _ui = {};

      // give field Parsley id in DOM
      fieldInstance.$element.attr(fieldInstance.options.namespace + 'id', fieldInstance.__id__);

      // generate important UI elements and register them in fieldInstance
      _ui.$errorClassHandler = fieldInstance.options.ui.classHandler(fieldInstance) || fieldInstance.$element;
      _ui.$errorsContainer = $(fieldInstance.options.errorsContainer) || fieldInstance.options.ui.errorsContainer(fieldInstance);
      _ui.$errorsWrapper = $(fieldInstance.options.ui.errorsWrapper).attr('id', 'parsley-id-' + fieldInstance.__id__);
      _ui.lastValidationResult = [];

      // insert in DOM errors wrapper in the right container
      if ('undefined' !== typeof _ui.errorsContainer)
        $(fieldInstance._ui.errorsContainer.append(fieldInstance._ui.errorsWrapper));
      else
        if (fieldInstance.$element.is('input[type=radio], input[type=checkbox]'))
          fieldInstance.$element.parent().after(_ui.$errorsWrapper);
        else
          fieldInstance.$element.after(_ui.$errorsWrapper);

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
