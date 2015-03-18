import Ember from 'ember';
import ConfigEnvironmentMixinMixin from 'fusor-ember-cli/mixins/config-environment-mixin';

module('ConfigEnvironmentMixinMixin');

// Replace this with your real tests.
test('it works', function() {
  var ConfigEnvironmentMixinObject = Ember.Object.extend(ConfigEnvironmentMixinMixin);
  var subject = ConfigEnvironmentMixinObject.create();
  ok(subject);
});
