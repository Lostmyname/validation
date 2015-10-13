/* global validation */

validation.addValidator('required', {
  message: 'This field is required!',
  test: function (value) {
    return !!value;
  }
});
