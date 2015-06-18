import Ember from 'ember';
import StartControllerMixinMixin from '../../../mixins/start-controller-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | start controller mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var StartControllerMixinObject = Ember.Object.extend(StartControllerMixinMixin);
  var subject = StartControllerMixinObject.create();
  assert.ok(subject);
});
