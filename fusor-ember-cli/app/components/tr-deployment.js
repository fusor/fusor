import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNames: ['deployment-row'],

  isStarted: Ember.computed('deployment.foreman_task_uuid', function() {
    return !!(this.get('deployment.foreman_task_uuid'));
  }),

  isComplete: Ember.computed('deployment.progress', function() {
   return this.get('deployment.progress') === '1';
  }),

  formanTaskResult: Ember.computed('deployment.foreman_task_uuid', function() {
    var self = this;
    if (this.get('deployment.foreman_task_uuid')) {
      var call = this.get('targetObject.store').findRecord('foreman-task', this.get('deployment.foreman_task_uuid'));
      return call.then(function(result) {
          return self.set('formanTaskResult', result.get('result'));
      });
    } else {
      return null;
    }
  }),

  isError: Ember.computed('formanTaskResult', function() {
    return (this.get('formanTaskResult') === 'error');
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
    }

    return 'deployment';
  }),

  actions: {
    openDeploymentModal(item) {
      this.get('targetObject').set('deploymentInModal', item);
      return this.get('targetObject').set('isOpenModal', true);
    }
  }

});
