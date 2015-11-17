import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  // TODO
  // switch text area to div with overflow to support formatted text and search
  // break out Polling Mixin into something we can use in any route
  // add loading spinner at the bottom when deploying
  // add search functionality
  // add warning/error highlighting

  model() {
    return {
      log: { path: '' }
    };
  },

  setupController(controller, model) {
    var self = this, deployment = self.modelFor('deployment');

    controller.set('model', model);
    controller.set('scrollToEndChecked', true);
    self.refreshFormattedLog();
    this.set('pollingActive', true);

    return this.getJsonLog().then(
      function (response) {
        controller.set('model', response);
        self.refreshFormattedLog();
        controller.send('scrollToEnd');
        if (self.get('pollingActive') && deployment.get('isStarted') && !deployment.get('isComplete')) {
          self.startPolling();
        }
      },
      function (error) {
        console.log('ERROR retrieving log');
        console.log(error.jqXHR);
      });
  },

  deactivate() {
    this.stopPolling();
  },

  actions: {
    updateLog() {
      var i, tmpDateStr,
        self = this,
        controller = this.get('controller'),
        params = {},
        entries = controller.get('model.log.entries');

      // get timestamp of last entry with a date
      for (i = entries.length - 1; i > 0; i--) {
        tmpDateStr = entries[i].date_time;
        if (tmpDateStr) {
          params = {date_time_gte: tmpDateStr};
          break;
        }
      }

      return this.getJsonLog(params).then(
        function (response) {
          self.mergeNewEntries(controller, response);
          self.refreshFormattedLog();
          controller.send('scrollToEnd');
        },
        function (error) {
          console.log('ERROR retrieving log');
          console.log(error.jqXHR);
        });
    }
  },

  scheduleAction(f) {
    var deploymentInProgress = this.modelFor('deployment').get('isInProgress');

    return Ember.run.later(this, function () {
      f.apply(this);
      if (deploymentInProgress) {
        this.set('timer', this.scheduleAction(f));
      }
    }, 5000);
  },

  startPolling() {
    this.set('pollingActive', true);
    this.set('timer', this.scheduleAction(this.get('pollingAction')));
  },

  stopPolling() {
    this.set('pollingActive', false);
    Ember.run.cancel(this.get('timer'));
  },

  pollingAction() {
    return this.send('updateLog');
  },

  getJsonLog(params) {
    var self = this,
      token = Ember.$('meta[name="csrf-token"]').attr('content'),
      deploymentId = this.modelFor('deployment').get('id'),
      url = '/fusor/api/v21/deployments/' + deploymentId + "/log";

    this.set('requestActive', true);
    return request({
      url: url,
      type: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      data: params
    }).finally(function () {
      self.set('requestActive', false);
    });
  },

  mergeNewEntries(controller, response) {
    var firstDate, dupIndex, i, tmpDateStr, newEntries,
      existingEntries = this.get('controller').get('model.log.entries');

    if (!response.log || !response.log.entries || response.log.entries.length === 0) {
      return;
    }

    newEntries = response.log.entries;
    firstDate = (newEntries.find(function(entry) { return !!entry.date_time; })).date_time;

    dupIndex = existingEntries.length;
    for (i = existingEntries.length - 1; i > 0; i--) {
      tmpDateStr = existingEntries[i].date_time;
      if (tmpDateStr >= firstDate) {
        dupIndex = i;
      }
      if (tmpDateStr && tmpDateStr < firstDate) {
        break;
      }
    }

    existingEntries.splice(dupIndex, existingEntries.length - dupIndex);
    newEntries.forEach(function(newEntry) { existingEntries.pushObject(newEntry); });
  },

  refreshFormattedLog() {
    var controller = this.get('controller'),
      entries = controller.get('model.log.entries');
    if (!entries || entries.length === 0) {
      controller.set('formattedLog', 'No data in the log file yet, there should be something to see in a few minutes.');
    } else {
      controller.set('formattedLog', entries.mapBy('text').join('\n'));
    }
  }
});
