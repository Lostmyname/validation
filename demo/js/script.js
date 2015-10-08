import validation from '../../index.js';

validation.addValidator('required', {
  message: 'This field is required!',
  test: function (value) {
    return !!value;
  }
});
