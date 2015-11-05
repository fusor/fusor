import Ember from 'ember';
import NeedsDeploymentMixinMixin from '../../../mixins/needs-deployment-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | needs deployment mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var NeedsDeploymentMixinObject = Ember.Object.extend(NeedsDeploymentMixinMixin);
  var subject = NeedsDeploymentMixinObject.create();
  assert.ok(subject);
});
