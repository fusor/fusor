import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['row'],

  runStartPolling: function() {
    return this.send('startPolling');
  }.on('didInsertElement'),

  runStopPolling: function() {
    return this.send('stopPolling');
  }.on('willDestroyElement'),

  // START REFRESH
  intervalPolling: function() {
    return 5000; // Time between refreshing (in ms)
  }.property().readOnly(),

  scheduleNextRefresh: function() {
    return Ember.run.later(this, function() {
      this.set('timer', this.scheduleNextRefresh(this.sendAction()));
    }, this.get('intervalPolling'));
  },

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
    if (this.get('isFinished')) {
      if (this.get('isSatelliteProgressBar')) {
        return "Sync content and setup successful";
      } else {
        return "Deployment successful";
      }
    } else if ((this.get('deploymentStatus') === 'In Process') && (this.get('model.result') === 'pending')) {
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
  }.property('model.humanized_errors'),

  progressSynctask0: function() {
    if (this.get('synctask0.progress')) {
      return (this.get('synctask0.progress') * 100).toFixed(1);
    } else {
      return 0;
    }
  }.property('synctask0.progress'),

  progressSynctask1: function() {
    if (this.get('synctask1.progress')) {
      return (this.get('synctask1.progress') * 100).toFixed(1);
    } else {
      return 0;
    }
  }.property('synctask1.progress'),

  progressSynctask2: function() {
    if (this.get('synctask2.progress')) {
      return (this.get('synctask2.progress') * 100).toFixed(1);
    } else {
      return 0;
    }
  }.property('synctask2.progress'),

  progressSynctask3: function() {
    if (this.get('synctask3.progress')) {
      return (this.get('synctask3.progress') * 100).toFixed(1);
    } else {
      return 0;
    }
  }.property('synctask3.progress'),

  progressSynctask4: function() {
    if (this.get('synctask4.progress')) {
      return (this.get('synctask4.progress') * 100).toFixed(1);
    } else {
      return 0;
    }
  }.property('synctask4.progress'),

  progressSynctask5: function() {
    if (this.get('synctask5.progress')) {
      return (this.get('synctask5.progress') * 100).toFixed(1);
    } else {
      return 0;
    }
  }.property('synctask5.progress'),

  progressSynctask6: function() {
    if (this.get('synctask6.progress')) {
      return (this.get('synctask6.progress') * 100).toFixed(1);
    } else {
      return 0;
    }
  }.property('synctask6.progress'),

  progressSynctask7: function() {
    if (this.get('synctask7.progress')) {
      return (this.get('synctask7.progress') * 100).toFixed(1);
    } else {
      return 0;
    }
  }.property('synctask7.progress'),

  progressSynctask8: function() {
    if (this.get('synctask8.progress')) {
      return (this.get('synctask8.progress') * 100).toFixed(1);
    } else {
      return 0;
    }
  }.property('synctask8.progress'),

  actions: {
    // executes `refreshModel` for every intervalPolling.
    startPolling: function() {
      this.sendAction(); // run immediately
      this.set('timer', this.scheduleNextRefresh(this.sendAction())); //and then repeats
    },

    stopPolling: function() {
      Ember.run.cancel(this.get('timer'));
    }
  }
});
