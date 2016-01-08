import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  // TODO
  // break out Polling Mixin into something we can use in any route
  // pull push all the formatting logic into the log-entry component
  // convert any big loops to chunked async promise based loops

  model() {
    return {
      fusor_log: {path: ''},
      foreman_log: {path: ''},
      foreman_proxy_log: {path: ''},
      candlepin_log: {path: ''},
      messages_log: {path: ''}
    };
  },

  setupController(controller, model) {
    controller.set('model', model);
    this.initLog();
  },

  deactivate() {
    this.stopPolling();
  },

  actions: {
    refreshProcessedLog() {
      this.refreshProcessedLog();
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
    },

    changeLogType() {
      this.stopPolling();
      Ember.run.later(this, this.refreshProcessedLog);
      Ember.run.later(this, this.initLog);
    }
  },

  refreshProcessedLog() {
    var self = this,
      controller = this.get('controller'),
      logType = controller.get('logType') || 'fusor_log',
      processedLogEntries = [],
      entries, entry, i;

    entries = controller.get(`model.${logType}.entries`);

    controller.set('isLogTooLarge', false);
    if (entries) {
      for (i = entries.length - 1; i >= 0; i--) {
        entry = entries[i];
        if (self.isIncluded(entry)) {
          processedLogEntries.push(Ember.Object.create(entry));
        }
      }
    }

    // reverse and run search so results are ordered correctly
    processedLogEntries = processedLogEntries.reverse();
    controller.set('logPath', controller.get(`model.${logType}.path`));
    controller.set('processedLogEntries', processedLogEntries);
    this.send('formatLog');
  },

  initLog() {
    var self = this,
      deployment = self.modelFor('deployment'),
      controller = this.get('controller');

    self.set('pollingActive', true);
    return Ember.RSVP.Promise.all([this.updateForemanTask(), this.updateLog()]).finally(function () {
      if (self.get('pollingActive') && controller.get('deploymentInProgress')) {
        self.startPolling();
      } else {
        self.set('pollingActive', false);
      }
    });
  },

  updateLog() {
    var self = this,
      controller = this.get('controller'),
      params = {log_type: controller.get('logType') || 'fusor_log'},
      entries = controller.get(`model.${params.log_type}.entries`);

    if (!entries || entries.length === 0) {
      return self.getFullLog(params);
    }

    params.line_number_gt = (entries[entries.length - 1]).line_number;
    return self.getJsonLog(params).then(
      function (response) {
        var numAdded = self.addNewEntries(controller, response);
        if (numAdded > 0) {
          controller.send('scrollToEnd');
        }
      },
      function (error) {
        self.showError(error);
      });
  },

  updateForemanTask() {
    var self = this,
      deployment = self.modelFor('deployment'),
      controller = this.get('controller');
    return this.store.findRecord('foreman-task', deployment.get('foreman_task_uuid')).then(
      function (result) {
        deployment.set('foreman_task', result);
        controller.set('deploymentInProgress', result.get('progress') !== '1');
      });
  },

  scheduleAction(f) {
    return Ember.run.later(this, function () {
      f.apply(this);
      if (this.get('controller').get('deploymentInProgress')) {
        this.set('timer', this.scheduleAction(f));
      }
    }, 10000);
  },

  startPolling() {
    this.set('pollingActive', true);
    this.set('timer', this.scheduleAction(this.pollingAction));
  },

  stopPolling() {
    this.set('pollingActive', false);
    Ember.run.cancel(this.get('timer'));
  },

  pollingAction() {
    return Ember.RSVP.Promise.all([this.updateLog(), this.updateForemanTask()]);
  },

  getFullLog(params) {
    var self = this, controller = this.get('controller');

    controller.set('isLoading', true);
    return this.getJsonLog(params)
      .then(
        function (response) {
          var model = controller.get('model');
          controller.set(`model.${params.log_type}`, response[params.log_type]);
          self.refreshProcessedLog();
          controller.send('scrollToEnd');
        },
        function (error) {
          self.showError(error);
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

  showError(error) {
    console.log('ERROR retrieving log');
    console.log(error);
    if (error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.displayMessage) {
      this.get('controller').set('errorMessage', error.jqXHR.responseJSON.displayMessage);
    } else {
      this.get('controller').set('errorMessage', 'error retrieving log');
    }
  },

  addNewEntries(controller, response) {
    var newEntries, self = this, logType, existingEntries, processedLogEntry, newEntry, i,
      numSearchResults = controller.get('numSearchResults'),
      processedLogEntries = controller.get('processedLogEntries');

    logType = controller.get('logType') || 'fusor_log';

    if (!response[logType] || !response[logType].entries || response[logType].entries.length === 0) {
      return 0;
    }

    newEntries = response[logType].entries;
    existingEntries = controller.get(`model.${logType}.entries`);

    newEntries.forEach(function(newEntry) { existingEntries.pushObject(newEntry); });

    //Add all the new processed entries
    for (i = 0; i < newEntries.length; i++) {
      newEntry = newEntries[i];
      if (self.isIncluded(newEntry)) {
        processedLogEntry = Ember.Object.create(newEntry);
        self.formatEntry(processedLogEntry);
        processedLogEntries.pushObject(processedLogEntry);
      }
    }

    return newEntries.length;
  },

  isIncluded(entry) {
    var controller = this.get('controller');

    switch (entry.level) {
      case 'error':
        return controller.get('errorChecked');
      case 'warn':
        return controller.get('warnChecked');
      case 'info':
        return controller.get('infoChecked');
      case 'debug':
        return controller.get('debugChecked');
      default:
        return true;
    }
  },

  formatEntry(entry) {
    var searchExp, formattedText, searchLogString,
      controller = this.get('controller'),
      numSearchResults = controller.get('numSearchResults'),
      entryNumSearchResults = 0, entryClass;

    searchLogString = Ember.String.htmlSafe(controller.get('searchLogString'));
    formattedText = Ember.String.htmlSafe(entry.get('text')).toString();
    entryClass = entry && entry.level ? `log-entry log-entry-level-${entry.level.toLowerCase()}` : 'log-entry';

    if (searchLogString) {
      searchExp = new RegExp(searchLogString, 'gi');
      formattedText = formattedText.replace(searchExp, function (match) {
        numSearchResults++;
        entryNumSearchResults++;
        return `<span class="log-entry-search-result log-entry-search-result-${numSearchResults}">${match}</span>`;
      });
    }

    formattedText = `<p class="${entryClass}">${formattedText}</p>`;

    controller.set('numSearchResults', numSearchResults);
    entry.set('formattedText', formattedText);
    entry.set('numSearchResults', entryNumSearchResults);
  }
});
