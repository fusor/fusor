import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  isRhevOpen: true,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,
  isSubscriptionsOpen: false,
  foremanTasksURL: null,

  // TODO - DRY and update while deployment is finished and button should say "Deployed"
  buttonDeployTitle: function() {
    if (this.get('controllers.deployment.isStarted')) {
      return 'Deploying ...';
    } else {
      return 'Deploy';
    }
  }.property('controllers.deployment.isStarted'),

  buttonDeployDisabled: function() {
    return this.get('controllers.deployment.isStarted');
  }.property('controllers.deployment.isStarted'),

  showErrorMessage: false,
  errorMsg: null, // this should be overwritten by API response
  installationInProgress: true,

  prog: 1,

  incrementBy: 20,

});
