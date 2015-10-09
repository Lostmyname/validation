/* global validation */

'use strict';

describe('Validation tests', function () {

  var errorMessageRequired = 'This field is required!';
  var errorMessageEmail = 'Not a valid email address';

  var emailValidator = {
    message: errorMessageEmail,
    test: function (value) {
      return /^[^@]+@[^@]{2,}[^.]$/.test(value);
    }
  };

  var requiredValidator = {
    message: errorMessageRequired,
    test: function (value) {
      return !!value;
    }
  };

  var validators = {
    required: requiredValidator,
    email: emailValidator
  };

  it('should run a new validation', function () {
    validation.addValidator('required', requiredValidator);
    var input = document.createElement('input');
    document.body.appendChild(input);
    validation.runValidator(input, 'required').should.equal(errorMessageRequired);
    document.body.removeChild(input);
  });

  it('should accept multiple validations', function () {
    validation.addValidators(validators);
    var input = document.createElement('input');
    input.value = 'not@email';
    document.body.appendChild(input);
    validation.runValidator(input, 'email').should.equal(errorMessageEmail);
    document.body.removeChild(input);
  });
});
