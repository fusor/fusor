import Ember from 'ember';
import DeploymentRouteMixinMixin from 'fusor-ember-cli/mixins/deployment-route-mixin';

module('DeploymentRouteMixinMixin');

// Replace this with your real tests.
test('it works', function() {
  var DeploymentRouteMixinObject = Ember.Object.extend(DeploymentRouteMixinMixin);
  var subject = DeploymentRouteMixinObject.create();
  ok(subject);
});
