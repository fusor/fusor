import Ember from 'ember';
import ConfigureOrganizationMixinMixin from 'fusor-ember-cli/mixins/configure-organization-mixin';

module('ConfigureOrganizationMixinMixin');

// Replace this with your real tests.
test('it works', function() {
  var ConfigureOrganizationMixinObject = Ember.Object.extend(ConfigureOrganizationMixinMixin);
  var subject = ConfigureOrganizationMixinObject.create();
  ok(subject);
});
