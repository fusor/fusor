import Ember from 'ember';
import ProgressBar from './progress-bar';

const TASK_WEIGHT = {
  // Say configure host groups is 5% of the total satellite depl progress
  configureHostGroups: 0.05,
  manageContent: 0.95
};

export default ProgressBar.extend({
  // Keeps external interface specfiic but aliases manageContentTask
  // to task so inherited behavior expecting 'task' works unaltered
  task: Ember.computed.alias('manageContentTask'),

  hasConfigureHostGroupsError: Ember.computed(
    'configureHostGroupsTask.result',
    function() {
      return this.get('configureHostGroupsTask.result') === 'error';
    }
  ),

  hasManageContentError: Ember.computed(
    'manageContentTask.result',
    function() {
      return this.get('manageContentTask.result') === 'error';
    }
  ),

  hasConfigureHostGroupsWarning: Ember.computed(
    'configureHostGroupsTask.result',
    function() {
      return this.get('configureHostGroupsTask.result') === 'warning';
    }
  ),

  hasManageContentWarning: Ember.computed(
    'manageContentTask.result',
    function() {
      return this.get('manageContentTask.result') === 'warning';
    }
  ),

  progressBarMsg: Ember.computed(
    'deploymentStatus',
    'manageContentTask.result',
    'isFinished',
    'isStopped',
    'isSatelliteProgressBar',
    'hasConfigureHostGroupsError',
    function() {
      return this.get('hasConfigureHostGroupsError') ?
        'Error' : this._super();
    }
  ),

  isError: Ember.computed(
    'manageContentTask.result',
    'hasConfigureHostGroupsError',
    function() {
      return this.get('hasConfigureHostGroupsError') || this._super();
    }
  ),

  isStopped: Ember.computed(
    'hasConfigureHostGroupsError',
    'hasConfigureHostGroupsWarning',
    'configureHostGroupsTask.state',
    'hasManageContentError',
    'hasManageContentWarning',
    'manageContentTask.state',
    function() {
      const mcUnexpectedResult=
        this.get('hasManageContentError') ||
        this.get('hasManageContentWarning');
      const mcState = this.get('manageContentTask.state');
      const mcStopped = mcState === 'stopped' || mcState === 'paused';

      const chgUnexpectedResult =
        this.get('hasConfigureHostGroupsError') ||
        this.get('hasConfigureHostGroupsWarning');
      const chgState = this.get('configureHostGroupsTask.state');
      const chgStopped = chgState === 'stopped' || chgState === 'paused';

      const isStopped =
        (mcStopped && mcUnexpectedResult) &&
        (chgStopped && chgUnexpectedResult);

      return isStopped;
    }
  ),

  progressBarClass: Ember.computed(
    'manageContentTask.result',
    'hasConfigureHostGroupsError',
    function() {
      let progressBarClass = 'progress-bar';

      if(this.get('hasManageContentError') || this.get('hasConfigureHostGroupsError')) {
        progressBarClass += ' progress-bar-danger';
      } else if(this.get('hasManageContentWarning') || this.get('hasConfigureHostGroupsWarning')) {
        progressBarClass += ' progress-bar-warning';
      } else if(this.get('valueProgress') === 100.0){
        progressBarClass += ' progress-bar-success';
      }

      return progressBarClass;
    }
  ),

  valueProgress: Ember.computed(
    'manageContentTask.progress',
    'configureHostGroupsTask.progress',
    'manageContentTask.state',
    'configureHostGroupsTask.state',
    function() {
      const mcProgress = this.get('manageContentTask.progress') || 0;
      const chgProgress = this.get('configureHostGroupsTask.progress') || 0;
      const mcState = this.get('manageContentTask.state');
      const chgState = this.get('configureHostGroupsTask.state');

      let retVal = 0;

      const progressComplete = mcProgress === 1 && chgProgress === 1;
      if(progressComplete || this.get('isError')) {
        retVal = 1.0;
      } else if(mcState || chgState) {
        // Discount progress by task weight
        retVal = mcProgress * TASK_WEIGHT.manageContent +
                 chgProgress * TASK_WEIGHT.configureHostGroups;
      }

      return retVal * 100;
    }
  )
});
