import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
        deployment: this.modelFor('deployment'),
        openstackPlan: this.store.find('deployment-plan', 'overcloud'),
        openstackNodes: this.store.find('node'),
        openstackProfiles: this.store.find('flavor')
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('showSpinner', false);
    controller.set('showErrorMessage', false);
    this.store.find('hostgroup').then(function(results) {
        var engineDomain = results.filterBy('name', 'RHEV-Engine').get('firstObject').get('domain.name');
        var hypervisorDomain = results.filterBy('name', 'RHEV-Hypervisor').get('firstObject').get('domain.name');
        controller.set('engineDomain', engineDomain);
        controller.set('hypervisorDomain', hypervisorDomain);
    });
    return this.modelFor('deployment');
  }

});
