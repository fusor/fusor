import Ember from 'ember';
import PaginationControllerMixinMixin from '../../../mixins/pagination-controller-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | pagination controller mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let PaginationControllerMixinObject = Ember.Object.extend(PaginationControllerMixinMixin);
  let subject = PaginationControllerMixinObject.create();
  assert.ok(subject);
});
