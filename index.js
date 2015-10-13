'use strict';

var validators = require('./src/js/validators');

require('./src/js/addListeners');

if (typeof module === 'object' && module.exports) {
  module.exports = validators;
}

if (typeof window === 'object') {
  window.validation = validators;
}
