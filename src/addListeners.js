'use strict';

var $ = require('jquery');
var validate = require('./validate');
var getErrorElement = require('./helpers/getErrorElement');

// Handle elements with data-validations properties
$(document).on('keyup click change blur', 'input, textarea, select', function (e) {
  var $this = $(this);

  // If an input has no validators, assume that it is always valid
  if (!$this.attr('data-validations')) {
    if ($this.val()) {
      $this.addClass('is-dirty is-valid');
    }

    return;
  }

  // Validate and show errors
  if (!validate.element(this)) {
    var $error = getErrorElement($this);

    if ($this.data('errorasopacity')) {
      $error.css('opacity', 0);
    } else {
      $error.hide();
    }
    $error.trigger('errorRemoved');
  }

  // Do not use getParentForm()
  validate.form($(e.target).parents('form').get(0));
});

// I'm honestly not sure what this code does that the above doesn't
// @todo: Figure out what this does
$(document).on('blur keyup', '[data-validations]', function (e) {
  var $input = $(e.target);

  if (e.type === 'keyup' && !$input.hasClass('is-filled')) {
    return;
  }

  var error = validate.element(e.target);

  if (!$input.hasClass('is-filled')) {
    return;
  }

  var $error = getErrorElement($input);
  var fail = (error && $input.hasClass('is-dirty'));

  if (error) {
    $error.text(error);

  }

  if ($input.data('errorasopacity')) {
    $error.css('opacity', fail ? 1 : 0);
  } else {
    $error[fail ? 'show' : 'hide']();
  }
  if (fail) {
    $error.trigger('errorShown');
  }
});

// Remove required attributes, and disable submits
$(document).ready(function () {
  $('form').filter(function () {
    return $(this).find('[data-validations]').length;
  }).each(function () {
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

        var offset = $this.find('.is-invalid').offset().top;

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
