import Ember from 'ember';
import StartControllerMixinMixin from 'fusor-ember-cli/mixins/start-controller-mixin';

module('StartControllerMixinMixin');

// Replace this with your real tests.
test('it works', function() {
  var StartControllerMixinObject = Ember.Object.extend(StartControllerMixinMixin);
  var subject = StartControllerMixinObject.create();
  ok(subject);
});
