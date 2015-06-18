import Ember from 'ember';
import MetaMixin from '../../../mixins/meta';
import { module, test } from 'qunit';

module('Unit | Mixin | meta');

// Replace this with your real tests.
test('it works', function(assert) {
  var MetaObject = Ember.Object.extend(MetaMixin);
  var subject = MetaObject.create();
  assert.ok(subject);
});
