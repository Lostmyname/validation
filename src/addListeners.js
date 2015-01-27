'use strict';

var $ = require('jquery');

var validate = require('./validate');
var getErrorElement = require('./helpers/getErrorElement');

// Handle elements with data-validations properties
$(document).on('keyup click change blur', 'input, textarea', function (e) {
  var $this = $(this);

  if (!$this.attr('data-validations')) {
    if ($this.val()) {
      $this.addClass('is-dirty is-valid');
    }

    return;
  }

  if (!validate.element(this)) {
    var $error = getErrorElement($this);

    if ($this.data('errorasopacity')) {
      $error.css('opacity', 0);
    } else {
      $error.hide();
    }
  }

  // Do not use getParentForm()
  validate.form($(e.target).parents('form').get(0));
});

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
});

// Remove required attributes, and disable submits
$(document).ready(function () {
  $('form').filter(function () {
    return $(this).find('[data-validations]').length;
  }).each(function () {
    var $this = $(this);

    validate.form(this);

    $this.prop('noValidate', true)
      .find('[data-validations]')
      .filter('[required]').prop('required', false).end()
      .filter('[maxlength]').removeAttr('maxlength').end()
      .filter(':not([value=""])').each(function () {
        validate.element(this);
      });

    $this
      .find('input, textarea')
      .filter(':not([data-validations]):not([value=""])')
      .filter('[type="text"], [type="tel"], [type="email"]')
      .trigger('blur');

    $this.on('submit', function (e) {
      $this.find('[data-validations]')
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

$(document).on('validate', '[data-validations]', function () {
  validate.element(this);
});
