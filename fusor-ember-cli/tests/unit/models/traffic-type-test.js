import { moduleForModel, test } from 'ember-qunit';

moduleForModel('traffic-type', 'Unit | Model | traffic type', {
  // Specify the other units that are required for this test.
  needs: ['model:subnet', 'model:organization']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
