'use strict';

var validators = require('./validators');

require('./addListeners');

if (typeof module === 'object' && module.exports) {
  module.exports = validators;
}

if (typeof window === 'object') {
  window.validation = validators;
}
