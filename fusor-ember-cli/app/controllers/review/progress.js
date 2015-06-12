import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  isRhevOpen: true,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,
  isSubscriptionsOpen: false,
  foremanTasksURL: null,

  buttonDeployTitle: 'Deploy',

  buttonDeployDisabled: function() {
    return this.get('controllers.deployment.isStarted');
  }.property('controllers.deployment.isStarted'),

  showErrorMessage: false,
  errorMsg: null, // this should be overwritten by API response
  installationInProgress: true,

  prog: 1,

  incrementBy: 20,

});
