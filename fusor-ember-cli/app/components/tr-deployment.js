import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNames: ['deployment-row'],

  isStarted: Ember.computed('deployment.foreman_task_uuid', function() {
    return !!(this.get('deployment.foreman_task_uuid'));
  }),

  isComplete: Ember.computed('foremanTask', 'foremanTask.progress', function() {
    return this.get('foremanTask.progress') === '1';
  }),

  statusDisplay: Ember.computed('foremanTask.result', function() {
    let statusDisplay = 'not yet started';
    const result = this.get('foremanTask.result');

    if(result === 'pending') {
      return 'running';
    } else if(result){
      statusDisplay = result;
    }

    return statusDisplay;
  }),

  foremanTask: Ember.computed('deployment.foreman_task_uuid', function() {
    let foremanTaskUuid = this.get('deployment.foreman_task_uuid');

    if (!foremanTaskUuid) {
      return null;
    }

    return this.get('targetObject.store').findRecord('foreman-task', foremanTaskUuid);
  }),

  isError: Ember.computed('foremanTask.result', function() {
    return (this.get('foremanTask.result') === 'error');
  }),

  isSuccessful: Ember.computed('foremanTask.result', function() {
    return this.get('foremanTask.result') === 'success';
  }),

  canDelete: Ember.computed('isStarted', 'isError', 'isSuccessful', function() {
    return !this.get('isStarted') ||
      this.get('isSuccessful') ||
      this.get('isError');
  }),

  routeNameForEdit: Ember.computed('isComplete', 'isStarted', function() {
    if (this.get('isComplete')) {
      return 'review.summary';
    } else if (this.get('isStarted')) {
      return 'review.progress.overview';
    } else {
      return 'deployment';
    }
  }),

  actions: {
    openDeploymentModal(item) {
      this.get('targetObject').set('deploymentInModal', item);
      this.get('targetObject').set('openModal', true);
    }
  }

});
