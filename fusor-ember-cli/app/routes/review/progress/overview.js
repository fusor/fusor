import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var deployment = this.modelFor('deployment');
    return Ember.RSVP.hash({
        // TODO: Uncomment when we merge with master
        //foremanTask: this.store.find('foreman-task', deployment.get('foreman_task_uuid')),
        openstackDeployment: this.store.find('openstack-deployment', 'overcloud'),
        openstackPlan: this.store.find('deployment-plan', 'overcloud'),
        openstackNodes: this.store.find('node'),
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    // TODO: Uncomment when we merge with master
    //controller.startPolling();
  },

  deactivate: function() {
    this.get('controller').stopPolling();
  }

});
