# validation.js [![Build Status](https://travis-ci.org/Lostmyname/validation.svg?branch=master)](https://travis-ci.org/Lostmyname/validation)

validation.js is the library written for the Lost My Name website because we
felt jquery-validation was just too big, and it didn't do some stuff we
wanted it to.

This library is a bit different in that it is only a library, and it doesn't
contain any validations itself. You have to add them all yourself. This helps
keep the size of the library down—you don't necessarily want credit card number
validation on a message board!


## Installation

```
$ npm install --save lmn-validation
```


## Adding a validator

To use the library, first add a validator:

```js
var validation = require('lmn-validation');

validation.addValidator('required', {
  message: 'This field is required!',
  test: function (value) {
    return !!value;
  }
});
```

"required" is the name of the validator. "message" is the message which will
display if the validation fails, and "test" is the function to test whether
the value is valid or not.

You can use `validation.addValidators` to add an object of validators all at
once.


## Running a validator

You can run a validator on an element using the `runValidator` method:


```js
var input = $('input.test').get(0);

var error = validation.runValidator(input, 'required');

if (error) {
  // Uh oh
}
```

If there are no errors, `false` will be returned.

You can run multiple validators using `runValidators`: if there is an error,
it will be returned and no more validators will be ran.

**Add validators in the order you want them ran!**


## Automatically running validators

We can add the validators to an input from the HTML. This will also handle
displaying the errors for us, which is neat.

```html
<form>
  <input placeholder="Name" data-validations="required" data-error-target=".error">
  <span class="error"></span>
</form>
```

`data-error-target` should contain a selector matching a sibling of the input.
If you don't specify an element (or if the element isn't found), then a span
with an `error` class will be created directly after the input if an error
occurs, and the error displayed there.

When validators are automatically ran, a lot of things happen in the
background:


### Classes will be added to the inputs and parent form

- `is-dirty` is added when the input has been changed, and is never removed.
- `is-filled` is like `is-dirty`, but waits for three characters to be entered:
  useful if you don't want to display an error straight away.
- `is-valid` is added when the input is valid.
- `is-invalid` is added when the input is invalid. This could just mean that
  the element is blank, though: check for `is-dirty` before displaying an
  error.


### Submit buttons in invalid forms will be disabled

An invalid form is a form where one or more contained element is invalid.

You can disable this behaviour—useful for if you want a submit button to force
submit even with invalid data. Just add a `data-ignore-validation="true"`
attribute.

If you would like to disable any other buttons you can add `[data-disable-on-error]` to them and they'll get disabled too.


### HTML5 form validation will be disabled

If HTML5 form validation is enabled, this validation library won't run. Also,
we don't want multiple validation libraries fighting! By loading the library
and using it, we're assuming that you want to use this one.


### required and maxlength attributes will be removed

For the same reason as above, we completely remove required and maxlength
attributes from elements you run the validation library on. They're still
useful for when JavaScript is disabled, though!


## Waiting for a number of characters

If you don't want a validator to run until, say, eight characters have been
entered, you can set the `data-validate-at` attribute to 8 and no validators
will be ran until the input has that number of characters.

Once you go over that number, validators will run regardless of whether you're
over that length: it won't stop validators from running if you go back under
that number of characters.


## More stuff

You can find out more you can do with this library by—sorry—reading the source.
Check out validate.js and index.js in the src directory of this project for
the interesting bits.


## License

This library is released under the MIT license.
