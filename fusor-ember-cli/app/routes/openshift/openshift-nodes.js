import Ember from 'ember';
import UsesOseDefaults from '../../mixins/uses-ose-defaults';
import request from 'ic-ajax';

export default Ember.Route.extend(UsesOseDefaults, {

  setupController(controller, model) {
    controller.set('model', model);

    var isRhev = this.controllerFor('deployment').get('isRhev');
    var isOpenStack = this.controllerFor('deployment').get('isOpenStack');
    if (isRhev && !(isOpenStack)) {
      model.set('openshift_install_loc', 'RHEV');
    } else if (!(isRhev) && isOpenStack) {
      model.set('openshift_install_loc', 'OpenStack');
    }

    // TODO pull from API resources available
    var result = { vcpuAvailabe: 8,
                   ramAvailable: 32,
                   diskAvailable: 250 };

    if (this.shouldUseOseDefault(model.get('openshift_available_vcpu'))) {
      model.set('openshift_available_vcpu', result['vcpuAvailabe']);
    }
    if (this.shouldUseOseDefault(model.get('openshift_available_ram'))) {
      model.set('openshift_available_ram', result['ramAvailable']);
    }
    if (this.shouldUseOseDefault(model.get('openshift_available_disk'))) {
      model.set('openshift_available_disk', result['diskAvailable']);
    }

  },

  deactivate() {
    return this.send('saveDeployment', null);
  }

});


