import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('hostgroup', params.hostgroup_id);
  },
  activate:   function() {
    console.log('entered hostgroup route');
    this.controllerFor('hostgroups').set('onShowPage', true);
  },

  deactivate:   function() {
    console.log('left hostgroup route');
    this.controllerFor('hostgroups').set('onShowPage', false);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    // TODO - how to make parent_id dynamic
    controller.set('parent_hostgroup', this.store.find('hostgroup', 1));
  },

});
