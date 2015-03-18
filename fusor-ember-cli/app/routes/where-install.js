import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);

    var isRhev = this.controllerFor('deployment').get('isRhev');
    var isOpenStack = this.controllerFor('deployment').get('isOpenStack');
    if (isRhev && !(isOpenStack)) {
      this.controllerFor('where-install').set('disableRHEV', false);
      this.controllerFor('where-install').set('disableOpenStack', true);
      return this.controllerFor('deployment').set('cfme_install_loc', 'RHEV');
    } else if (!(isRhev) && isOpenStack) {
      this.controllerFor('where-install').set('disableRHEV', true);
      this.controllerFor('where-install').set('disableOpenStack', false);
      return this.controllerFor('deployment').set('cfme_install_loc', 'OpenStack');
    } else {
      this.controllerFor('where-install').set('disableRHEV', false);
      this.controllerFor('where-install').set('disableOpenStack', false);
    }
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  },

});
