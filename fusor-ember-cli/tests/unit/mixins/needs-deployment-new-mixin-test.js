import Ember from 'ember';
import NeedsDeploymentNewMixinMixin from '../../../mixins/needs-deployment-new-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | needs deployment new mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var NeedsDeploymentNewMixinObject = Ember.Object.extend(NeedsDeploymentNewMixinMixin);
  var subject = NeedsDeploymentNewMixinObject.create();
  assert.ok(subject);
});
