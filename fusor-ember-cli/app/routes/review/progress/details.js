import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    //return Ember.$.getJSON('/api/v21/foreman_tasks');
    //var uud = this.modelFor()
    // return this.store.find('foreman-task', {uuid: 'db25a76f-e344-48ba-ac77-f29303586dbe'});
    var foreman_task_uuid = this.modelFor('deployment').get('foreman_task_uuid');
    return this.store.find('foreman-task', foreman_task_uuid );
  }
});
