import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['row'],

  valueProgress: function() {
    if (this.get('model.state') === 'planning') {
        return 0.1;
    } else if (this.get('model.state')) {
        return (this.get('model.progress') * 100);
    } else {
        return 0;
    }
  }.property('model.progress'),

  percentProgress: function() {
    return this.get('valueProgress').toFixed(1);
  }.property('valueProgress'),

  percentProgressInt: function() {
    return this.get('valueProgress').toFixed(0);
  }.property('valueProgress'),

  styleWidth: function () {
    return new Ember.Handlebars.SafeString(this.get('percentProgressInt') + '%');
  }.property('percentProgressInt'),

  progressBarClass: function() {
    var result = this.get('model.result');
    if (result === 'success') {
      return 'progress-bar progress-bar-success';
    } else if (result === 'error') {
      return 'progress-bar progress-bar-danger';
    } else if (result === 'warning') {
      return 'progress-bar progress-bar-warning';
    } else {
      return 'progress-bar';
    }
  }.property('model.result'),

  deploymentStatus: function() {
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
  }.property('valueProgress'),

  isSpin: function() {
    return ((this.get('deploymentStatus') === 'In Process') && (this.get('model.result') === 'pending'));
  }.property('deploymentStatus', 'model.result'),

  progressBarMsg: function() {
    if ((this.get('deploymentStatus') === 'In Process') && (this.get('model.result') === 'pending')) {
      if (this.get('isSatelliteProgressBar')) {
        return "Syncing content";
      } else {
        return "Installing components";
      }
    } else if (this.get('model.result') === 'error') {
      return "Error";
    } else if (this.get('model.result') === 'warning') {
      return "Warning";
    } else if (!this.get('isStarted')) {
      return "Waiting for content";
    } else if (this.get('isFinished')) {
      if (this.get('isSatelliteProgressBar')) {
        return "Sync content and setup successful";
      } else {
        return "Deployment successful";
      }
    }
  }.property('deploymentStatus', 'model.result', 'isFinished', 'isSatelliteProgressBar'),

  isFinished: function() {
    return (this.get('valueProgress') === 100);
  }.property('valueProgress'),

  isStarted: function() {
    return(this.get('valueProgress') > 0);
  }.property('valueProgress'),

  isError: function() {
    return(this.get('model.result') === 'error');
  }.property('model.result'),

  hasHumanizedErrors: function() {
    return (Ember.isPresent(this.get('model.humanized_errors')));
  }.property('model.humanized_errors')

});
