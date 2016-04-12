import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  cloudformsController: Ember.inject.controller('cloudforms'),

  cfmeInstallLoc: Ember.computed.alias("deploymentController.model.cfme_install_loc"),
  isRhev: Ember.computed.alias("deploymentController.isRhev"),
  isNotRhev: Ember.computed.not("isRhev"),
  isOpenStack: Ember.computed.alias("deploymentController.isOpenStack"),
  isNotOpenStack: Ember.computed.not("isOpenStack"),
  fullnameOpenStack: Ember.computed.alias("deploymentController.fullnameOpenStack"),
  isInvalidCfmeInstallLocation: Ember.computed.alias("cloudformsController.isInvalidCfmeInstallLocation"),
  isOpenShift: Ember.computed.alias("deploymentController.isOpenShift"),

  disableRHEV: Ember.computed('isStarted', 'isNotRhev', function() {
    return (this.get('isStarted') || this.get('isNotRhev'));
  }),

  disableOpenStack: Ember.computed('isStarted', 'isNotOpenStack', function() {
    return (this.get('isStarted') || this.get('isNotOpenStack'));
  }),

  disableRHEVradio: Ember.computed('disableRHEV', 'isStarted', function () {
    return (this.get('disableRHEV') || this.get('isStarted'));
  }),

  disableOpenstackradio: Ember.computed('disableOpenStack', 'isStarted', function () {
    return (this.get('disableOpenStack') || this.get('isStarted'));
  }),

  backRouteName: Ember.computed('isOpenStack', 'isRhev', 'isOpenShift', function() {
    if (this.get('isOpenShift')) {
      return 'openshift.openshift-configuration';
    } else if (this.get('isOpenStack')) {
      return 'openstack.overcloud';
    } else if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'satellite.access-insights';
    }
  }),

  actions: {
    cfmeLocationChanged() {
    }
  }

});
