'use strict';

var $ = require('jquery');

/**
 * Just get the inputs from current form, not the ones from child forms. I.e. when you include a partial in yeti
 */
function filterInputs($form) {
  // Get all form elements with form validation
  var allFormVals = $form.find('[data-validations]:visible');
  var nextForm = $form.find('form');
  // Get elements belonging to a child form and ignore them
  var nextFormVals = nextForm.find('[data-validations]');
  return $($(allFormVals).not(nextFormVals).get());
}

module.exports = filterInputs;
