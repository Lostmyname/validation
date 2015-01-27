'use strict';

var validators = require('./src/validators');

require('./src/addListeners');

if (typeof module === 'object' && module.exports) {
  module.exports = validators;
}

if (typeof window === 'object') {
  window.validation = validators;
}
