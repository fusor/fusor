import Ember from 'ember';
import SatelliteControllerMixinMixin from 'fusor-ember-cli/mixins/satellite-controller-mixin';

module('SatelliteControllerMixinMixin');

// Replace this with your real tests.
test('it works', function() {
  var SatelliteControllerMixinObject = Ember.Object.extend(SatelliteControllerMixinMixin);
  var subject = SatelliteControllerMixinObject.create();
  ok(subject);
});
