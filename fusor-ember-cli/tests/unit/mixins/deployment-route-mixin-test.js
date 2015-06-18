import Ember from 'ember';
import DeploymentRouteMixinMixin from '../../../mixins/deployment-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | deployment route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var DeploymentRouteMixinObject = Ember.Object.extend(DeploymentRouteMixinMixin);
  var subject = DeploymentRouteMixinObject.create();
  assert.ok(subject);
});
