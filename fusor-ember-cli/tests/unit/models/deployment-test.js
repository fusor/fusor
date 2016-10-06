import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';
import startMirage from '../../helpers/start-mirage';

moduleForModel('deployment', 'Unit | Model | deployment', {
  // Specify the other units that are required for this test.
  needs: ['model:organization',
          'model:lifecycle-environment',
          'model:discovered-host',
          'model:subscription',
          'model:introspection-task',
          'model:foreman-task',
          'model:openshift-host',
          'model:openstack-deployment',
          'adapter:application'
         ]
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});

test('isStarted should be false on init', function(assert){
  var model = this.subject();
  assert.equal(model.get('isStarted'), false);
  assert.equal(model.get('isNotStarted'), true);
});

// uncomment after merged https://github.com/fusor/fusor/pull/566
// test('isStarted should be true if foreman_task_uuid is set to a valid uuid', function(assert){
//   var model = this.subject();
//   Ember.run(function() {
//     model.set('foreman_task_uuid', 'db25a76f-e344-48ba-ac77-f29303586dbe');
//   });
//   assert.equal(model.get('isStarted'), true);
//   assert.equal(model.get('isNotStarted'), false);
// });

test('isStarted should be false if foreman_task_uuid is null', function(assert){
  var model = this.subject();
  Ember.run(function() {
    model.set('foreman_task_uuid', null);
  });
  assert.equal(model.get('isStarted'), false);
  assert.equal(model.get('isNotStarted'), true);
});
