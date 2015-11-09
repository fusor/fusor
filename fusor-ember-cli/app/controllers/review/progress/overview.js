import Ember from 'ember';
import ProgressBarMixin from "../../../mixins/progress-bar-mixin";
import NeedsDeploymentMixin from "../../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(ProgressBarMixin, NeedsDeploymentMixin, {

  isRhev: Ember.computed.alias("deploymentController.isRhev"),
  isOpenStack: Ember.computed.alias("deploymentController.isOpenStack"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),

  nameRHCI: Ember.computed.alias("deploymentController.nameRHCI"),
  nameRhev: Ember.computed.alias("deploymentController.nameRhev"),
  nameOpenStack: Ember.computed.alias("deploymentController.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("deploymentController.nameCloudForms"),
  nameSatellite: Ember.computed.alias("deploymentController.nameSatellite"),
  progressDeployment: Ember.computed.alias("deployTask.progress"),
  resultDeployment: Ember.computed.alias("deployTask.result"),
  stateDeployment: Ember.computed.alias("deployTask.state"),

  deployTaskIsStopped: Ember.computed('stateDeployment', function() {
    return ((this.get('stateDeployment') === 'stopped') || (this.get('stateDeployment') === 'paused'));
  }),

  deployTaskIsFinished: Ember.computed('progressDeployment', 'resultDeployment', function() {
    return ((this.get('progressDeployment') === '1') && (this.get('resultDeployment') === 'success'));
  }),

});
