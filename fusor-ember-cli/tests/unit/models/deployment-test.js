import { moduleForModel, test } from 'ember-qunit';

moduleForModel('deployment', 'Unit | Model | deployment', {
  // Specify the other units that are required for this test.
  needs: ['model:organization', 'model:lifecycle-environment', 'model:discovered-host']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
