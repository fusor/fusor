import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  isStarted: function() {
    return !!(this.get('deployment.foreman_task_uuid'));
  }.property('deployment.foreman_task_uuid'),

  isComplete: function() {
   return this.get('deployment.progress') === '1';
  }.property('deployment.progress'),

  formanTaskResult: function() {
    var self = this;
    if (this.get('deployment.foreman_task_uuid')) {
      var call = this.get('targetObject.store').find('foreman-task', this.get('deployment.foreman_task_uuid'));
      return call.then(function(result) {
          return self.set('formanTaskResult', result.get('result'));
      });
    } else {
      return null;
    }
  }.property('deployment.foreman_task_uuid'),

  isError: function() {
    return (this.get('formanTaskResult') === 'error');
  }.property('formanTaskResult'),

  canDelete: function() {
    if (!(this.get('isStarted'))) {
      return true;
    } else {
      return this.get('isError');
    }
  }.property('isStarted', 'isError'),

  routeNameForEdit: function() {
    if (this.get('isComplete')) {
      return 'review.summary';
    } else if (this.get('isStarted')) {
      return 'review.progress.overview';
    }

    return 'deployment';
  }.property('isComplete', 'isStarted'),

  actions: {
    openDeploymentModal: function (item) {
      this.get('targetObject').set('deploymentInModal', item);
      return this.get('targetObject').set('isOpenModal', true);
    }
  }

});
