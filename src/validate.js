'use strict';

var $ = require('jquery');

var validators = require('./validators');
var filterInputs = require('./helpers/filterInputs');
var getParentForm = require('./helpers/getParentForm');

var validate = module.exports = validators.validate = {};

/**
 * Returns whether there is a validation error in the input by grabbing the
 * validations from the data-validations attribute. Sets is-dirty, is-invalid
 * and is-valid where appropriate, but will not display the error.
 *
 * @param {HTMLInputElement} input The input element to validate.
 * @param {boolean} [setClasses] If false, class names will not be set.
 * @returns {string|boolean} Error if there is an error, otherwise false.
 */
validate.element = function validateElement(input, setClasses) {
  var $input = $(input);
  var validations;

  if (typeof $input.data('validate-at') !== 'undefined') {
    if (!$input.hasClass('is-filled') && $input.val().length < $input.data('validate-at')) {
      return;
    }
  }

  if (!$input.data('_validationArray')) {
    validations = $input.data('validations').split(' ');
    $input.data('_validationArray', validations);
  } else {
    validations = $input.data('_validationArray');
  }

  // If radio, find all other radios
  if ($input.attr('type') === 'radio') {
    var name = $input.attr('name');
    $input = getParentForm($input).find('[name="' + name + '"]');

    input = $input.filter(':checked').get(0);
    $input = $(input);
  }

  var error = validators.runValidators(input, validations);

  if (setClasses !== false && $input.is(':visible')) {
    if ($input.val()) {
      $input.addClass('is-dirty');
    }

    if ($input.val() && $input.val().length > 3) {
      $input.addClass('is-filled');
    }

    if (error) {
      $input.addClass('is-invalid').removeClass('is-valid');
    } else {
      $input.addClass('is-valid').removeClass('is-invalid');
    }
  }

  return error;
};

/**
 * Returns whether there is a validation error anywhere in the form by calling
 * {@link element} lots. Sets is-dirty, is-invalid and is-valid on
 * the form where appropriate, but will not modify the element classes or
 * display any errors.
 *
 * Will validate non-dirty elements.
 *
 * @param {HTMLFormElement} form The form element to validate.
 * @see element
 * @returns {boolean} True if valid. False if not.
 */
validate.form = function validateForm(form) {
  var $form = $(form);
  var $notDirty;
  var $inputs = filterInputs($form);
  var valid = true;

  if ($inputs.filter('.is-invalid').length) {
    valid = false;
  } else if (($notDirty = $inputs.filter(':not(.is-dirty), [type="radio"]')).length) {
    $notDirty.each(function (i, input) {
      var error = validate.element(input, false);
      if (error) {
        valid = false;
        return false;
      }
    });
  }

  if ($form.find('.is-dirty').length) {
    $form.addClass('is-dirty');
  }

  if (valid) {
    $form.addClass('is-valid').removeClass('is-invalid');
  } else {
    $form.addClass('is-invalid').removeClass('is-valid');
  }

  $form.find('[type="submit"]:not([data-ignore-validation="true"])')
    .prop('disabled', $form.find('.is-filled.is-invalid:visible').length);

  return valid;
};

