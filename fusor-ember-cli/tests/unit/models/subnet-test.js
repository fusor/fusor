import { moduleForModel, test } from 'ember-qunit';

moduleForModel('subnet', 'Unit | Model | subnet', {
  // Specify the other units that are required for this test.
  needs: ['model:traffic-type', 'model:organization', 'model:lifecycle-environment']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
