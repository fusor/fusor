import { moduleForModel, test } from 'ember-qunit';

moduleForModel('discovered-host', 'Unit | Model | discovered host', {
  // Specify the other units that are required for this test.
  needs: ['model:deployment', 'model:organization', 'model:lifecycle-environment']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
