import Ember from 'ember';
import TrEngineHypervisorMixinMixin from '../../../mixins/tr-engine-hypervisor-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | tr engine hypervisor mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var TrEngineHypervisorMixinObject = Ember.Object.extend(TrEngineHypervisorMixinMixin);
  var subject = TrEngineHypervisorMixinObject.create();
  assert.ok(subject);
});
