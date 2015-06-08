import Ember from 'ember';

export default Ember.ObjectController.extend({

  needs: ['deployment', 'cloudforms'],

  cfme_install_loc: Ember.computed.alias("controllers.deployment.cfme_install_loc"),
  isRhev: Ember.computed.alias("controllers.deployment.isRhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.isOpenStack"),
  satelliteTabRouteName: Ember.computed.alias("controllers.deployment.satelliteTabRouteName"),
  organizationTabRouteName: Ember.computed.alias("controllers.deployment.organizationTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("controllers.deployment.lifecycleEnvironmentTabRouteName"),

  // overwritten by setupController
  disableRHEV: false,
  disableOpenStack: false,

  disableRHEVradio: function () {
    return (this.get('disableRHEV') || this.get('controllers.deployment.isStarted'));
  }.property('disableRHEV', 'controllers.deployment.isStarted'),

  disableOpenstackradio: function () {
    return (this.get('disableRHEV') || this.get('controllers.deployment.isStarted'));
  }.property('disableRHEV', 'controllers.deployment.isStarted'),

  backRouteName: function() {
    if (this.get('isOpenStack')) {
      return 'assign-nodes';
    } else if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'satellite.configure-environment';
    }
  }.property('isOpenStack', 'isRhev'),

  actions: {
    cfmeLocationChanged: function() {
    }
  }

});
