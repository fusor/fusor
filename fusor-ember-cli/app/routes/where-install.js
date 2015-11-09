import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);

    var isRhev = this.controllerFor('deployment').get('isRhev');
    var isOpenStack = this.controllerFor('deployment').get('isOpenStack');
    if (isRhev && !(isOpenStack)) {
      return this.controllerFor('deployment').set('model.cfme_install_loc', 'RHEV');
    } else if (!(isRhev) && isOpenStack) {
      return this.controllerFor('deployment').set('model.cfme_install_loc', 'OpenStack');
    }
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }

});
