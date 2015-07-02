import Ember from 'ember';
import ConfigureOrganizationMixinMixin from '../../../mixins/configure-organization-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | configure organization mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var ConfigureOrganizationMixinObject = Ember.Object.extend(ConfigureOrganizationMixinMixin);
  var subject = ConfigureOrganizationMixinObject.create();
  assert.ok(subject);
});
