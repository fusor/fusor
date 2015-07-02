import Ember from 'ember';
import DeploymentControllerMixinMixin from '../../../mixins/deployment-controller-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | deployment controller mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var DeploymentControllerMixinObject = Ember.Object.extend(DeploymentControllerMixinMixin);
  var subject = DeploymentControllerMixinObject.create();
  assert.ok(subject);
});
