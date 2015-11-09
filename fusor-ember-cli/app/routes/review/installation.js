import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('deployment');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('showSpinner', false);
    controller.set('showErrorMessage', false);
    if (model.get('deploy_rhev')) {
        this.store.findAll('hostgroup').then(function(results) {
            var fusorBaseDomain = results.filterBy('name', 'Fusor Base').get('firstObject').get('domain.name');
            controller.set('engineDomain', fusorBaseDomain);
            controller.set('hypervisorDomain', fusorBaseDomain);
        });
    }
    if (model.get('deploy_openstack')) {
        this.store.findRecord('deployment-plan', model.get('id')).then(function (plan) {
            controller.set('openstackPlan', plan);
        });
        this.store.query('node', {deployment_id: model.get('id')}).then(function (nodes) {
            controller.set('openstackNodes', nodes);
        });
        this.store.query('flavor', {deployment_id: model.get('id')}).then(function (flavors) {
            controller.set('openstackProfiles', flavors);
        });
    }
  }

});
