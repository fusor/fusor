import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment', 'review/progress/overview'],

  isRhevOpen: true,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,
  isSubscriptionsOpen: false,
  foremanTasksURL: null,

  showErrorMessage: false,
  errorMsg: null, // this should be overwritten by API response

  deployTaskIsFinished: Ember.computed.alias("controllers.review/progress/overview.deployTaskIsFinished"),
  deployTaskIsStopped: Ember.computed.alias("controllers.review/progress/overview.deployTaskIsStopped"),

  deployButtonTitle: function() {
    if (this.get('deployTaskIsStopped')) {
        return 'Deployment Stopped';
    } else {
        return 'Deploying ...';
    }
  }.property('deployTaskIsStopped')

});
