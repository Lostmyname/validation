'use strict';

var $ = require('jquery');

var validators = module.exports = {};
var storage = {};

/**
 * Adds a validation test.
 *
 * @param {string} name The name of the test.
 * @param {object} validator An object containing a `message` to be returned
 *                 on error, and a `test` containing a function to return t/f.
 */
validators.addValidator = function (name, validator) {
  storage[name] = validator;
};

/**
 * Adds multiple validation tests from an object.
 *
 * @param {object} validations Object containing an object with names as keys
 *                             and validation objects as values.
 */
validators.addValidators = function (validations) {
	$.each(validations, function (name, validator) {
    validators.addValidator(name, validator);
	});
};

/**
 * Run a single validation, and return whether it was successful.
 *
 * @param {HTMLElement} element The element to test the value of.
 * @param {string} test The name of the test as specified in .addValidation.
 * @returns {string|undefined} Returns the error message or nothing.
 */
validators.runValidator = function (element, test) {
  if (!storage[test]) {
    console.error('Validator "%s" not found.', test);
    return;
  }

	var result = storage[test].test.call(element, element && element.value);
	return result ? undefined : storage[test].message;
};

/**
 * Run validations until one of them fails, and returns success status.
 *
 * @param {HTMLElement} element The element to test the value of.
 * @param {Array} tests An array of test names specified in .addValidation.
 * @returns {string|boolean} Returns the error message of the first error or
 *                           false if there were no errors.
 */
validators.runValidators = function (element, tests) {
	for (var error, i = 0; i < tests.length; i++) {
		if ((error = validators.runValidator(element, tests[i]))) {
			return error;
		}
	}

	return false;
};
