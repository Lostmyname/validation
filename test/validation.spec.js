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

  var input = document.createElement('input');

  it('should return an error message when validation fails', function () {
    validation.addValidator('required', requiredValidator);
    document.body.appendChild(input);
    validation.runValidator(input, 'required').should.equal(errorMessageRequired);
    document.body.removeChild(input);
  });

  it('should return undefined when validation passes', function () {
    input.value = 'hello';
    document.body.appendChild(input);
    var error = { value: validation.runValidator(input, 'required') };
    var expect = { value: undefined };
    error.should.eql(expect);
    document.body.removeChild(input);
  });

  it('should accept multiple validations', function () {
    validation.addValidators(validators);
    input.value = 'notanemail.com';
    document.body.appendChild(input);
    validation.runValidator(input, 'email').should.equal(errorMessageEmail);
    document.body.removeChild(input);
  });

  it('should run multiple validations', function () {
    input.value = 'Passes first test';
    document.body.appendChild(input);
    validation.runValidators(input, ['required', 'email']).should.equal(errorMessageEmail);
    document.body.removeChild(input);
  });
});
