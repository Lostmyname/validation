'use strict';

var $ = require('jquery');

/**
 * Gets either the parent form of an input, or the body element.
 *
 * @param {jQuery} $input A jQuery object containing the input.
 * @returns {jQuery} Returns either the parent form, or the body element.
 */
function getParentForm($input) {
  var $parent = $input.parents('form');
  return $parent.length ? $parent.eq(0) : $('body');
}

module.exports = getParentForm;
