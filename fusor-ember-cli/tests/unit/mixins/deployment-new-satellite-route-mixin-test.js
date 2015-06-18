import Ember from 'ember';
import DeploymentNewSatelliteRouteMixinMixin from '../../../mixins/deployment-new-satellite-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | deployment new satellite route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var DeploymentNewSatelliteRouteMixinObject = Ember.Object.extend(DeploymentNewSatelliteRouteMixinMixin);
  var subject = DeploymentNewSatelliteRouteMixinObject.create();
  assert.ok(subject);
});
