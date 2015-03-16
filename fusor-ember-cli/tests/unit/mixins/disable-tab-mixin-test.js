import Ember from 'ember';
import DisableTabMixinMixin from 'fusor-ember-cli/mixins/disable-tab-mixin';

module('DisableTabMixinMixin');

// Replace this with your real tests.
test('it works', function() {
  var DisableTabMixinObject = Ember.Object.extend(DisableTabMixinMixin);
  var subject = DisableTabMixinObject.create();
  ok(subject);
});
