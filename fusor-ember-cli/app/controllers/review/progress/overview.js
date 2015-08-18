import Ember from 'ember';
import ProgressBarMixin from "../../../mixins/progress-bar-mixin";

export default Ember.Controller.extend(ProgressBarMixin, {
  needs: ['deployment'],

  isRhev: Ember.computed.alias("controllers.deployment.isRhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.isOpenStack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.isCloudForms"),

  nameRHCI: Ember.computed.alias("controllers.deployment.nameRHCI"),
  nameRhev: Ember.computed.alias("controllers.deployment.nameRhev"),
  nameOpenStack: Ember.computed.alias("controllers.deployment.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("controllers.deployment.nameCloudForms"),
  nameSatellite: Ember.computed.alias("controllers.deployment.nameSatellite"),
  progressDeployment: Ember.computed.alias("model.deployTask.progress"),
  resultDeployment: Ember.computed.alias("model.deployTask.result"),
  stateDeployment: Ember.computed.alias("model.deployTask.state"),

  deployTaskIsStopped: function() {
    console.log('calculating deployTaskIsStopped');
    return ((this.get('stateDeployment') === 'stopped') || (this.get('stateDeployment') === 'paused'));
  }.property('stateDeployment'),

  deployTaskIsFinished: function() {
    console.log('calculating deployTaskIsFinished');
    return ((this.get('progressDeployment') === '1') && (this.get('resultDeployment') === 'success'));
  }.property('progressDeployment')

});
