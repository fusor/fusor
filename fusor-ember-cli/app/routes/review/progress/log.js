import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  // TODO
  // break out Polling Mixin into something we can use in any route

  model() {
    return {
      log: { path: '' }
    };
  },

  setupController(controller, model) {
    var self = this, deployment = self.modelFor('deployment');

    controller.set('model', model);
    controller.set('deploymentInProgress', deployment.get('isInProgress'));

    this.set('pollingActive', true);
    return this.getFullLog().finally(function () {
      controller.set('deploymentInProgress', deployment.get('isInProgress'));
      if (self.get('pollingActive') && deployment.get('isInProgress')) {
        self.startPolling();
      } else {
        self.set('pollingActive', false);
      }
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

      if (!entries || entries.length === 0) {
        return self.getFullLog();
      }

      // get timestamp of last entry with a date
      for (i = entries.length - 1; i > 0; i--) {
        tmpDateStr = entries[i].date_time;
        if (tmpDateStr) {
          params = {date_time_gte: tmpDateStr};
          break;
        }
      }

      return self.getJsonLog(params).then(
        function (response) {
          var numAdded = self.mergeNewEntries(controller, response);
          if (numAdded > 0) {
            controller.send('scrollToEnd');
          }
        },
        function (error) {
          console.log('ERROR retrieving log');
          console.log(error.jqXHR);
        });
    },

    refreshProcessedLog() {
      var self = this,
        controller = this.get('controller'),
        entries = controller.get('model.log.entries'),
        processedLogEntries = [],
        entry, i;

      // Add the the most recent filtered log entries up to 5000
      controller.set('isLogTooLarge', false);
      if (entries) {
        for (i = entries.length - 1; i >= 0; i--) {
          entry = entries[i];
          if (self.isIncluded(entry)) {
            processedLogEntries.push(Ember.Object.create(entry));
          }

          if (processedLogEntries.length > 5000) {
            controller.set('isLogTooLarge', true);
            break;
          }
        }
      }

      // reverse and run search so results are ordered correctly
      processedLogEntries = processedLogEntries.reverse();
      controller.set('processedLogEntries', processedLogEntries);
      this.send('formatLog');
    },

    formatLog() {
      var self = this,
        controller = this.get('controller'),
        processedLogEntries = controller.get('processedLogEntries');

      controller.set('searchResultIdx', 0);
      controller.set('numSearchResults', 0);
      for (var i = 0; i < processedLogEntries.length; i++) {
        self.formatEntry(processedLogEntries[i]);
      }
    }
  },

  scheduleAction(f) {
    var deploymentInProgress = this.modelFor('deployment').get('isInProgress');
    this.get('controller').set('deploymentInProgress', deploymentInProgress);

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

  getFullLog() {
    var self = this, controller = this.get('controller');

    controller.set('isLoading', true);
    return this.getJsonLog()
      .then(
        function (response) {
          controller.set('model', response);
          self.send('refreshProcessedLog');
          controller.send('scrollToEnd');
        },
        function (error) {
          console.log('ERROR retrieving log');
          console.log(error.jqXHR);
        })
      .finally(function () {
        controller.set('isLoading', false);
      });
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
    var firstDate, dupIndex, i, tmpDateStr, newEntries, numAdded = 0, self = this,
      existingEntries = this.get('controller').get('model.log.entries'),
      numSearchResults = controller.get('numSearchResults'),
      processedLogEntries = controller.get('processedLogEntries'),
      processedLogEntry, newEntry;

    if (!response.log || !response.log.entries || response.log.entries.length === 0) {
      return;
    }

    newEntries = response.log.entries;
    firstDate = (newEntries.find(function(entry) { return !!entry.date_time; })).date_time;

    dupIndex = existingEntries.length;
    // Find the first dated entry previous to response
    // and ignore undated entries
    for (i = existingEntries.length - 1; i > 0; i--) {
      tmpDateStr = existingEntries[i].date_time;
      if (tmpDateStr >= firstDate) {
        dupIndex = i;
      }
      if (tmpDateStr && tmpDateStr < firstDate) {
        break;
      }
    }
    // Replacing existingEntries duplicates with new entries
    existingEntries.splice(dupIndex, existingEntries.length - dupIndex);
    newEntries.forEach(function(newEntry) { existingEntries.pushObject(newEntry); });

    // Also remove duplicates from processed entries
    dupIndex = processedLogEntries.length;
    for (i = processedLogEntries.length - 1; i > 0; i--) {
      tmpDateStr = processedLogEntries[i].get('date_time');
      if (tmpDateStr >= firstDate) {
        dupIndex = i;
      }
      if (tmpDateStr && tmpDateStr < firstDate) {
        break;
      }
    }

    for (i = processedLogEntries.length - 1 ; i >= dupIndex; i--) {
      processedLogEntry = processedLogEntries.popObject();
      numSearchResults -= processedLogEntry.get('numSearchResults');
      numAdded--;
    }
    controller.set('numSearchResults', numSearchResults);

    //Add all the new processed entries
    for (i = 0; i < newEntries.length; i++) {
      newEntry = newEntries[i];
      if (self.isIncluded(newEntry)) {
        processedLogEntry = Ember.Object.create(newEntry);
        self.formatEntry(processedLogEntry);
        processedLogEntries.pushObject(processedLogEntry);
        numAdded++;
      }
    }

    return numAdded;
  },

  isIncluded(entry) {
    var controller = this.get('controller');

    switch (entry.level) {
      case 'E':
        return controller.get('errorChecked');
      case 'W':
        return controller.get('warnChecked');
      case 'I':
        return controller.get('infoChecked');
      case 'D':
        return controller.get('debugChecked');
      default:
        return true;
    }
  },

  formatEntry(entry) {
    var searchExp, formattedText, searchLogString,
      controller = this.get('controller'),
      numSearchResults = controller.get('numSearchResults'),
      entryNumSearchResults = 0;

    searchLogString = Ember.String.htmlSafe(controller.get('searchLogString'));
    formattedText = Ember.String.htmlSafe(entry.get('text')).toString();

    if (!searchLogString) {
      entry.set('formattedText', formattedText);
      entry.set('numSearchResults', 0);
      return;
    }

    searchExp = new RegExp(searchLogString, 'gi');
    formattedText = formattedText.replace(searchExp, function(match) {
      numSearchResults++;
      entryNumSearchResults++;
      return `<span class="log-entry-search-result log-entry-search-result-${numSearchResults}">${match}</span>`;
    });

    controller.set('numSearchResults', numSearchResults);
    entry.set('formattedText', formattedText);
    entry.set('numSearchResults', entryNumSearchResults);
  }
});
