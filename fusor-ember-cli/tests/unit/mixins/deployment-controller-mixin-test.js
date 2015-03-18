import Ember from 'ember';
import DeploymentControllerMixinMixin from 'fusor-ember-cli/mixins/deployment-controller-mixin';

module('DeploymentControllerMixinMixin');

// Replace this with your real tests.
test('it works', function() {
  var DeploymentControllerMixinObject = Ember.Object.extend(DeploymentControllerMixinMixin);
  var subject = DeploymentControllerMixinObject.create();
  ok(subject);
});
