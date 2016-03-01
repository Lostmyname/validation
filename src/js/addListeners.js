'use strict';

var $ = require('jquery');
var validate = require('./validate');
var getErrorElement = require('./helpers/getErrorElement');

$(document).on('keyup click change blur', '[data-validations]', onChange);

function onChange(e) {
  var $input = $(this);
  var $error = getErrorElement($input);

  var invalidValue = validate.element(this);
  var errorNeeded = invalidValue && $input.hasClass('is-dirty');
  var inputInitiallyEmpty =  !$input.hasClass('is-filled');

  if (inputInitiallyEmpty) {
    showError(false);
    return;
  }

  if (e.type === 'keyup' && !$input.hasClass('is-filled')) {
    return;
  }

  if (invalidValue) {
    $error.text(invalidValue);
  } else {
    $error.text('');
    showError(false);
  }

  if (errorNeeded) {
    showError(true);
  }

  // Do not use getParentForm()
  validate.form($input.parents('form').get(0));

  function showError(showError) {
    $error
      .css('visibility', showError ? 'visible' : 'hidden')
      .toggle(showError);
  }
}

// Remove required attributes, and disable submits
$(document).ready(function () {
  $('form')
    .filter((_, el) => $(el).find('[data-validations]').length)
    .each(function () {
      var $this = $(this);

      validate.form(this);

      // Disable browser validation and validate non-empty inputs on load
      $this
        .prop('noValidate', true)
        .find('[data-validations]')
        .filter('[required]')
          .prop('required', false)
          .attr('aria-required', 'true')
          .end()
        .filter('[maxlength]')
          .each(function () {
            var $this = $(this);
            $this
              .attr('data-maxlength', $this.attr('maxlength'))
              .removeAttr('maxlength');
          })
          .end()
        .filter(':not([value=""])')
          .each(function () {
            validate.element(this);
          });

      // This doesn't really belong in this library. It makes sure that the
      // infield stuff works. @todo: Remove this
      $this
        .find('input, textarea')
        .filter(':not([data-validations]):not([value=""])')
        .filter('[type="text"], [type="tel"], [type="email"]')
        .trigger('blur');

      // Run validation on form submit
      $this.on('submit', function (e) {
        // This runs validation on every input regardless of cleanliness
        $this
          .find('[data-validations]')
          .addClass('is-filled is-dirty')
          .trigger('blur');

        if (!validate.form(this)) {
          e.preventDefault();
          e.stopPropagation();

          // If element is out of viewport, scroll up to it
          var $invalid = $this.find('.is-invalid');

          if (!$invalid.length) {
            return;
          }

          var offset = $invalid.offset().top;

          if ($(window).scrollTop() > offset) {
            $('html, body').animate({ scrollTop: offset - 10 });
          }
        }
      });
    });
});

// If you fire the `validate` event on an input, it will be validated
$(document).on('validate', '[data-validations]', function () {
  validate.element(this);
});
