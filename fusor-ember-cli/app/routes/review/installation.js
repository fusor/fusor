import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('deployment');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('showSpinner', false);
    controller.set('showErrorMessage', false);
    this.store.find('hostgroup').then(function(results) {
        var fusorBaseDomain = results.filterBy('name', 'Fusor Base').get('firstObject').get('domain.name');
        controller.set('engineDomain', fusorBaseDomain);
        controller.set('hypervisorDomain', fusorBaseDomain);
    });
  }

});
