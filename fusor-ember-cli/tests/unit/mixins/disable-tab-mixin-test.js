import Ember from 'ember';
import DisableTabMixinMixin from '../../../mixins/disable-tab-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | disable tab mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var DisableTabMixinObject = Ember.Object.extend(DisableTabMixinMixin);
  var subject = DisableTabMixinObject.create();
  assert.ok(subject);
});
