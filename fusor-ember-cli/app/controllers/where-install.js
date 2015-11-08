import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  cloudformsController: Ember.inject.controller('cloudforms'),

  cfmeInstallLoc: Ember.computed.alias("deploymentController.model.cfme_install_loc"),
  isRhev: Ember.computed.alias("deploymentController.isRhev"),
  isNotRhev: Ember.computed.not("isRhev"),
  isOpenStack: Ember.computed.alias("deploymentController.isOpenStack"),
  isNotOpenStack: Ember.computed.not("isOpenStack"),
  satelliteTabRouteName: Ember.computed.alias("deploymentController.satelliteTabRouteName"),
  organizationTabRouteName: Ember.computed.alias("deploymentController.organizationTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentController.lifecycleEnvironmentTabRouteName"),
  hasNoInstallLocation: Ember.computed.alias("cloudformsController.hasNoInstallLocation"),

  setupController: function(controller, model) {
    controller.set('model', model);

    var isRhev = this.controllerFor('deployment').get('isRhev');
    var isOpenStack = this.controllerFor('deployment').get('isOpenStack');
    if (isRhev && !(isOpenStack)) {
      this.controllerFor('where-install').set('disableRHEV', false);
      this.controllerFor('where-install').set('disableOpenStack', true);
      return this.controllerFor('deployment').set('model.cfme_install_loc', 'RHEV');
    } else if (!(isRhev) && isOpenStack) {
      this.controllerFor('where-install').set('disableRHEV', true);
      this.controllerFor('where-install').set('disableOpenStack', false);
      return this.controllerFor('deployment').set('model.cfme_install_loc', 'OpenStack');
    } else {
      this.controllerFor('where-install').set('disableRHEV', false);
      this.controllerFor('where-install').set('disableOpenStack', false);
    }
  },

  disableRHEV: function() {
    return (this.get('isStarted') || this.get('isNotRhev'));
  }.property('isStarted', 'isNotRhev'),

  disableOpenStack: function() {
    return (this.get('isStarted') || this.get('isNotOpenStack'));
  }.property('isStarted', 'isNotOpenStack'),

  disableRHEVradio: function () {
    return (this.get('disableRHEV') || this.get('isStarted'));
  }.property('disableRHEV', 'isStarted'),

  disableOpenstackradio: function () {
    return (this.get('disableOpenStack') || this.get('isStarted'));
  }.property('disableOpenStack', 'isStarted'),

  backRouteName: function() {
    if (this.get('isOpenStack')) {
      return 'assign-nodes';
    } else if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'satellite.access-insights';
    }
  }.property('isOpenStack', 'isRhev'),

  actions: {
    cfmeLocationChanged: function() {
    }
  }

});
