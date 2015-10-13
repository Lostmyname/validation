/* global $, Should */
/* jshint unused: false */

'use strict';

Should.Assertion.add('jqPromise', function () {
  this.params = { operator: 'to be jQuery Deferred / Promise' };

  this.obj.should.be.type('object');
  this.obj.then.should.be.type('function');
  $.Deferred().then.toString().should.equal(this.obj.then.toString());
}, true);

Should.Assertion.add('jQuery', function () {
  this.params = { operator: 'to be jQuery object' };

  this.jquery.should.be.type('string');
  this.jquery.should.equal($.fn.jquery);
});
