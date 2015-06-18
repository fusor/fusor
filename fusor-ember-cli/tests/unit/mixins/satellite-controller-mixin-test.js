import Ember from 'ember';
import SatelliteControllerMixinMixin from '../../../mixins/satellite-controller-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | satellite controller mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var SatelliteControllerMixinObject = Ember.Object.extend(SatelliteControllerMixinMixin);
  var subject = SatelliteControllerMixinObject.create();
  assert.ok(subject);
});
