import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  overviewController: Ember.inject.controller('review/progress/overview'),

  isRhevOpen: true,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,
  isSubscriptionsOpen: false,
  foremanTasksURL: null,

  showErrorMessage: false,
  errorMsg: null, // this should be overwritten by API response

  deployTaskIsFinished: Ember.computed.alias("overviewController.deployTaskIsFinished"),
  deployTaskIsStopped: Ember.computed.alias("overviewController.deployTaskIsStopped"),

  deployButtonTitle: Ember.computed('deployTaskIsStopped', function() {
    if (this.get('deployTaskIsStopped')) {
        return 'Deployment Stopped';
    } else {
        return 'Deploying ...';
    }
  })

});
