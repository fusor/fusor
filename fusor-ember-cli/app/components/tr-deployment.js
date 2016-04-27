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

  canDelete: Ember.computed('isStarted', 'isError', function() {
    if (!(this.get('isStarted'))) {
      return true;
    } else {
      return this.get('isError');
    }
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
