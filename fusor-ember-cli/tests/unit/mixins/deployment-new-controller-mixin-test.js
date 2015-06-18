import Ember from 'ember';
import DeploymentNewControllerMixinMixin from '../../../mixins/deployment-new-controller-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | deployment new controller mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var DeploymentNewControllerMixinObject = Ember.Object.extend(DeploymentNewControllerMixinMixin);
  var subject = DeploymentNewControllerMixinObject.create();
  assert.ok(subject);
});
