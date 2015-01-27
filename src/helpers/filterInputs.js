'use strict';

var $ = require('jquery');

/**
 * Just get the inputs from current form, not the ones from child forms. I.e.
 * when you include a partial in yeti.
 *
 * @param {jQuery} $form The form element to get the inputs from
 */
function filterInputs($form) {
  return $form.find('[data-validations]:visible')
    .filter(function () {
      return $(this).closest('form').is($form);
    });
}

module.exports = filterInputs;
