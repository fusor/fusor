import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['row'],

  valueProgress: Ember.computed('task.progress', function() {
    if (this.get('task.state') === 'planning') {
      return 0.1;
    } else if (this.get('task.state')) {
      return (this.get('task.progress') * 100);
    } else {
      return 0;
    }
  }),

  percentProgress: Ember.computed('valueProgress', function() {
    return this.get('valueProgress').toFixed(1);
  }),

  percentProgressInt: Ember.computed('valueProgress', function() {
    return this.get('valueProgress').toFixed(0);
  }),

  styleWidth: Ember.computed('percentProgressInt', function () {
    return Ember.String.htmlSafe('width: ' + this.get('percentProgressInt') + '%;');
  }),

  progressBarClass: Ember.computed('task.result', function() {
    var result = this.get('task.result');
    if (result === 'success') {
      return 'progress-bar progress-bar-success';
    } else if (result === 'error') {
      return 'progress-bar progress-bar-danger';
    } else if (result === 'warning') {
      return 'progress-bar progress-bar-warning';
    } else {
      return 'progress-bar';
    }
  }),

  deploymentStatus: Ember.computed('valueProgress', function() {
    var valueProgress = this.get('valueProgress');
    if (valueProgress) {
      if (valueProgress === 100) {
        return 'Finished';
      } else {
        return 'In Process';
      }
    } else {
      return 'Waiting for content';
    }
  }),

  isSpin: Ember.computed('deploymentStatus', 'task.result', function() {
    return ((this.get('deploymentStatus') === 'In Process') && (this.get('task.result') === 'pending'));
  }),

  progressBarMsg: Ember.computed(
    'deploymentStatus',
    'task.result',
    'isFinished',
    'isStopped',
    'isSatelliteProgressBar',
    function() {
      if ((this.get('deploymentStatus') === 'In Process') && (this.get('task.result') === 'pending')) {
        if (this.get('isSatelliteProgressBar')) {
          return "Syncing content";
        } else if (this.get('isNodeProgressBar')) {
          return "Registering Node";
        } else if (this.get('isStopped')) {
          return "Task is stopped";
        } else {
          return "Installing components";
        }
      } else if (this.get('task.result') === 'error') {
        return "Error";
      } else if (this.get('task.result') === 'warning') {
        return "Warning";
      } else if (!this.get('isStarted')) {
        return "Waiting for content";
      } else if (this.get('isFinished')) {
        if (this.get('isSatelliteProgressBar')) {
          return "Sync content and setup successful";
        } else {
          if (this.get('isNodeProgressBar')) {
            return "Node registration successful";
          } else {
            return "Deployment successful";
          }
        }
      }
    }
  ),

  isFinished: Ember.computed('valueProgress', function() {
    return (this.get('valueProgress') === 100);
  }),

  isStarted: Ember.computed('valueProgress', function() {
    return(this.get('valueProgress') > 0);
  }),

  isError: Ember.computed('task.result', function() {
    return(this.get('task.result') === 'error');
  }),

  isStopped: Ember.computed('task.state', function() {
    return ((this.get('task.state') === 'stopped') || (this.get('task.state') === 'paused'));
  }),

  hasHumanizedErrors: Ember.computed('task.humanized_errors', function() {
    return (Ember.isPresent(this.get('task.humanized_errors')));
  }),

  hostErrorInfo: Ember.computed('task.humanized_errors', function() {
    var error = this.get('task.humanized_errors'),
      host = '';

    if (error.match(/Failed to provision/)) {
      host = error.match(/host '(.*)'\./)[1];

      return "Please check the host logs or <a href='/hosts/" + host +
          "/reports'>puppet reports</a>.";
    }
  })

});
