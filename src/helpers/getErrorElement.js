'use strict';

var $ = require('jquery');
var getParentForm = require('./getParentForm');

/**
 * Gets or creates the error element of a supplied input element.
 *
 * @param {jQuery} $input jQuery object containing the input.
 * @returns {jQuery} jQuery object containing the error element.
 */
function getErrorElement($input) {
  var target = $input.data('error-target');

  if (target) {
    var $parent = getParentForm($input);
    var $error = $parent.find($input.data('error-target'));
    if ($error.length) {
      return $error;
    }
  }

  // If error input not found, create one
  var rand = 'error-' + Math.random().toString().slice(2);
  $input.data('error-target', '.' + rand);
  return $('<span />', {
    class: 'error ' + rand,
    'aria-live': 'polite'
  }).insertAfter($input);
}

module.exports = getErrorElement;
