import Ember from 'ember';

export default Ember.ObjectController.extend({

  needs: ['deployment'],

  cfme_install_loc: Ember.computed.alias("controllers.deployment.cfme_install_loc"),

  disableRHEV: false,
  disableOpenStack: false,

  actions: {
    cfmeLocationChanged: function() {
    }
  }

});
