import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:subscriptions/management-application/consumer/pools', {
  // Specify the other units that are required for this test.
  needs: ['controller:deployment', 'controller:application']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var controller = this.subject();
  assert.ok(controller);
});
