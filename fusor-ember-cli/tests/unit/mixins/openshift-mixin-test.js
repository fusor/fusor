import Ember from 'ember';
import OpenshiftMixinMixin from '../../../mixins/openshift-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | openshift mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let OpenshiftMixinObject = Ember.Object.extend(OpenshiftMixinMixin);
  let subject = OpenshiftMixinObject.create();
  assert.ok(subject);
});
