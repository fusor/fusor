import { moduleForModel, test } from 'ember-qunit';

moduleForModel('subscription', 'Unit | Model | subscription', {
  // Specify the other units that are required for this test.
  needs: ['model:deployment', 'model:organization', 'model:lifecycle-environment', 'model:discovered-host']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
