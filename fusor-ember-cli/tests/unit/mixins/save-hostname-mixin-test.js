import Ember from 'ember';
import SaveHostnameMixinMixin from '../../../mixins/save-hostname-mixin';
import { module, test } from 'qunit';

module('SaveHostnameMixinMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var SaveHostnameMixinObject = Ember.Object.extend(SaveHostnameMixinMixin);
  var subject = SaveHostnameMixinObject.create();
  assert.ok(subject);
});
