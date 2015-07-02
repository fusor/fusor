import Ember from 'ember';
import ProgressBarMixinMixin from '../../../mixins/progress-bar-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | progress bar mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var ProgressBarMixinObject = Ember.Object.extend(ProgressBarMixinMixin);
  var subject = ProgressBarMixinObject.create();
  assert.ok(subject);
});
