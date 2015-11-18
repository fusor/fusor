import { moduleForModel, test } from 'ember-qunit';

moduleForModel('foreman-task', 'Unit | Model | foreman task', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});

test('taskUrl is correctly outputed', function(assert){
  var model = this.subject({id: '1234567890'});
  assert.equal(model.get('taskUrl'), "/foreman_tasks/tasks/" + model.get("id"));
});
