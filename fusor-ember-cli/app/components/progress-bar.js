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

  scheduleNextRefresh: function(f) {
    return Ember.run.later(this, function() {
      this.set('timer', this.scheduleNextRefresh(this.sendAction()));
    }, this.get('intervalPolling'));
  },

  percentProgress: function() {
    if (this.get('isAggregated')) {
        if ((parseFloat(this.get('progressSyncAvg'), 10.0) >= -1) && (parseInt(this.get('progressSyncAvg'), 10) <= 0.5)) {
          return 0.5;
        } else if ((parseFloat(this.get('progressSyncAvg'), 10.0) > 0) && (parseInt(this.get('progressSyncAvg'), 10) < 99)) {
          return this.get('progressSyncAvg');
        } else if (parseInt(this.get('model.progress'), 10) === 1) {
          return 100;
        } else if (parseInt(this.get('progressSyncAvg'), 10) === 99) {
          return 99;
        } else {
          return 0;
        }
    } else if (parseFloat(this.get('model.progress'), 10.0) > 0) {
        return (this.get('model.progress') * 100).toFixed(1);
    } else {
        return 0;
    }
  }.property('model.progress', 'isAggregated', 'progressSyncAvg'),

  percentProgressInt: function() {
    return (this.get('percentProgress')); //.toFixed(0);
  }.property('percentProgress'),

  styleWidth: function () {
    return new Ember.Handlebars.SafeString(this.get('percentProgressInt') + '%');
  }.property('percentProgress'),

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
    var progress = this.get('model.progress');
    if (progress) {
      if (progress === 1) {
        return 'Finished';
      } else {
        return 'In Process';
      }
    } else {
      return 'Waiting for content';
    }
  }.property('model.progress'),

  isSpin: function() {
    return ((this.get('deploymentStatus') === 'In Process') && (this.get('model.result') === 'pending'));
  }.property('deploymentStatus', 'model.result'),

  progressBarMsg: function() {
    if (this.get('isFinished')) {
      if (this.get('isAggregated')) {
        return "Sync content and setup successful";
      } else {
        return "Deployment successful";
      }
    } else if ((this.get('deploymentStatus') === 'In Process') && (this.get('model.result') === 'pending')) {
      if (this.get('isAggregated')) {
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
  }.property('deploymentStatus', 'model.result', 'isFinished', 'isAggregated'),

  isFinished: function() {
    // model.progress returns 1 (for some strange reason) before the sync subtasks start to return, so also need to check if progressSyncAvg is 99
    return ((parseInt(this.get('model.progress', 10)) === 1) && (parseInt(this.get('progressSyncAvg', 10)) === 99));
  }.property('model.progress', 'progressSyncAvg'),

  isStarted: function() {
    return(parseFloat(this.get('percentProgress'), 10.0) > 0);
  }.property('percentProgress'),

  isError: function() {
    return(this.get('model.result') === 'error');
  }.property('model.result'),

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

  progressSyncAvg: function() {
    return (((parseFloat(this.get('progressSynctask0'), 10.0) +
             parseFloat(this.get('progressSynctask1'), 10.0) +
             parseFloat(this.get('progressSynctask2'), 10.0) +
             parseFloat(this.get('progressSynctask3'), 10.0) +
             parseFloat(this.get('progressSynctask4'), 10.0) +
             parseFloat(this.get('progressSynctask5'), 10.0) +
             parseFloat(this.get('progressSynctask6'), 10.0) +
             parseFloat(this.get('progressSynctask7'), 10.0) +
             parseFloat(this.get('progressSynctask8'), 10.0)
           ) / 9).toFixed(1) - 1);
  }.property('progressSynctask0', 'progressSynctask1', 'progressSynctask2', 'progressSynctask3',
             'progressSynctask4', 'progressSynctask5', 'progressSynctask6', 'progressSynctask7',
             'progressSynctask8'),

  actions: {
    // executes `refreshModel` for every intervalPolling.
    startPolling: function() {
      console.log('startPolling');
      this.sendAction(); // run immediately
      this.set('timer', this.scheduleNextRefresh(this.sendAction())); //and then repeats
    },

    stopPolling: function() {
      console.log('stopPolling');
      Ember.run.cancel(this.get('timer'));
    }
  }
});
