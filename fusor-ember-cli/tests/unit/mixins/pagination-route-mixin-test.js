import Ember from 'ember';
import PaginationRouteMixinMixin from '../../../mixins/pagination-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | pagination route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let PaginationRouteMixinObject = Ember.Object.extend(PaginationRouteMixinMixin);
  let subject = PaginationRouteMixinObject.create();
  assert.ok(subject);
});
