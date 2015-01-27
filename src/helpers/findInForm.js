'use strict';

var $ = require('jquery');

/**
 * Just get the elements from the current form, but not any child forms.
 *
 * @param {string} selector The selector matching the elements to get
 * @returns {jQuery} The elements in the current form
 */
$.fn.findInForm = function findInForm(selector) {
  var that = this;

  return this.find(selector)
    .filter(function () {
      return $(this).closest('form').is(that);
    });
};
