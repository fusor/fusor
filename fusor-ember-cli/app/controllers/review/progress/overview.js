import Ember from 'ember';
import request from 'ic-ajax';
import ProgressBarMixin from "../../../mixins/progress-bar-mixin";
import NeedsDeploymentMixin from "../../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(ProgressBarMixin, NeedsDeploymentMixin, {

  isRhev: Ember.computed.alias("deploymentController.isRhev"),
  isOpenStack: Ember.computed.alias("deploymentController.isOpenStack"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  isOpenShift: Ember.computed.alias("deploymentController.isOpenShift"),

  nameRHCI: Ember.computed.alias("deploymentController.nameRHCI"),
  nameRhev: Ember.computed.alias("deploymentController.nameRhev"),
  nameOpenStack: Ember.computed.alias("deploymentController.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("deploymentController.nameCloudForms"),
  nameSatellite: Ember.computed.alias("deploymentController.nameSatellite"),
  nameOpenShift: Ember.computed.alias("deploymentController.nameOpenShift"),

  progressDeployment: Ember.computed.alias("deployTask.progress"),
  resultDeployment: Ember.computed.alias("deployTask.result"),
  stateDeployment: Ember.computed.alias("deployTask.state"),

  deployTaskIsStopped: Ember.computed('stateDeployment', function() {
    return ((this.get('stateDeployment') === 'stopped') || (this.get('stateDeployment') === 'paused'));
  }),

  deployTaskIsFinished: Ember.computed('progressDeployment', 'resultDeployment', function() {
    return ((this.get('progressDeployment') === '1') && (this.get('resultDeployment') === 'success'));
  }),

  //Deploy task is not 100% but All subtasks are 100%
  showDeployTaskProgressBar: Ember.computed(
    'isRhev',
    'isOpenStack',
    'isCloudForms',
    'isOpenShift',
    'manageContentTask.progress',
    'rhevTask.progress',
    'openstackTask.progress',
    'cfmeTask.progress',
    'openshiftTask.progress',
    'progressDeployment',
    function() {
      if (this.get('progressDeployment') === '1' || this.get('manageContentTask.progress') !== '1') {
        return false;
      }

      if (this.get('isRhev') && this.get('rhevTask.progress') !== '1') {
        return false;
      }

      if (this.get('isOpenStack') && this.get('openstackTask.progress') !== '1') {
        return false;
      }

      if (this.get('isCloudForms') && this.get('cfmeTask.progress') !== '1') {
        return false;
      }

      if (this.get('isOpenShift') && this.get('openshiftTask.progress') !== '1') {
        return false;
      }

      return true;
    }
  ),

  loadingRedeployment: false,

  actions: {
    redeploy() {
      this.set('loadingRedeployment', true);

      let depl = this.get('deploymentController.model');
      let token = Ember.$('meta[name="csrf-token"]').attr('content');

      request({
        url: '/fusor/api/v3/deployments/' + depl.get('id') + '/redeploy',
        type: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
          "Authorization": "Basic " + this.get('session.basicAuthToken')
        }
      }).then((response) => {
        let newTaskUUID = response.id;
        depl.set('foreman_task_uuid', newTaskUUID);
        depl.set('has_content_error', false);
        depl.save();
        this.send('refreshModelOnOverviewRoute');
      }).catch((err) => {
        console.log('ERROR occurred attempting a redeploy', err);
      }).finally(() => this.set('loadingRedeployment', false));
    },
    abandonAndDelete() {
      this.set('openModal', true);
    },
    abandon() {
      this.transitionToRoute('deployments');
    },
    executeAbandonment() {
      let depl = this.get('deploymentController.model');
      depl.destroyRecord();
      this.transitionToRoute('deployments');
    }
  }
});
