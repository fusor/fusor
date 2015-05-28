import Ember from 'ember';

export default Ember.ObjectController.extend({

  needs: ['deployment'],

  cfme_install_loc: Ember.computed.alias("controllers.deployment.cfme_install_loc"),
  isRhev: Ember.computed.alias("controllers.deployment.isRhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.isOpenStack"),
  satelliteTabRouteName: Ember.computed.alias("controllers.deployment.satelliteTabRouteName"),
  organizationTabRouteName: Ember.computed.alias("controllers.deployment.organizationTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("controllers.deployment.lifecycleEnvironmentTabRouteName"),

  disableRHEV: false,
  disableOpenStack: false,

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
