import Ember from 'ember';
import ConfigureEnvironmentMixinMixin from '../../../mixins/configure-environment-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | configure environment mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var ConfigureEnvironmentMixinObject = Ember.Object.extend(ConfigureEnvironmentMixinMixin);
  var subject = ConfigureEnvironmentMixinObject.create();
  assert.ok(subject);
});
