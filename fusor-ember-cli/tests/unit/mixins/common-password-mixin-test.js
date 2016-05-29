import Ember from 'ember';
import CommonPasswordMixinMixin from '../../../mixins/common-password-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | common password mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let CommonPasswordMixinObject = Ember.Object.extend(CommonPasswordMixinMixin);
  let subject = CommonPasswordMixinObject.create();
  assert.ok(subject);
});
