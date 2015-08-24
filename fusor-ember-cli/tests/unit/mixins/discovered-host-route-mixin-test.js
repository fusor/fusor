import Ember from 'ember';
import DiscoveredHostRouteMixinMixin from '../../../mixins/discovered-host-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | discovered host route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var DiscoveredHostRouteMixinObject = Ember.Object.extend(DiscoveredHostRouteMixinMixin);
  var subject = DiscoveredHostRouteMixinObject.create();
  assert.ok(subject);
});
