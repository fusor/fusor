import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  // TODO
  // break out Polling Mixin into something we can use in any route
  // pull push all the formatting logic into the log-entry component

  model() {
    return Ember.Object.create({
      fusor_log: {path: ''},
      foreman_log: {path: ''},
      foreman_proxy_log: {path: ''},
      candlepin_log: {path: ''},
      messages_log: {path: ''}
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
    this.initLog();
  },

  deactivate() {
    this.stopPolling();
  },

  actions: {
    updateDisplayedLog() {
      this.updateDisplayedLog().then(() => {
        this.get('controller').send('navNextSearchResult');
      });
    },

    search() {
      this.formatLog().then(() => {
        this.get('controller').send('navNextSearchResult');
      });
    },

    clearSearch() {
      this.formatLog();
    },

    changeLogType() {
      var logType = this.get('controller.logType') || 'fusor_log';

      this.stopPolling();
      this.set('controller.displayedLog', this.get(`controller.model.${logType}`));

      return Ember.RSVP.Promise.all([
        this.updateDisplayedLog(),
        this.initLog()
      ]).then(() => {
          this.get('controller').send('navNextSearchResult');
        }
      );
    }
  },

  formatLog() {
    var controller = this.get('controller'),
      displayedLogEntries = controller.get('displayedLogEntries'),
      promises = [], idx = 0, chunksize = 200;

    controller.set('searchResultIdx', 0);
    controller.set('numSearchResults', 0);

    while (idx < displayedLogEntries.length) {
      promises.push(this.formatLogChunk(displayedLogEntries, idx, chunksize));
      idx += chunksize;
    }

    return Ember.RSVP.Promise.all(promises);
  },

  formatLogChunk(displayedLogEntries, firstIndex, chunkSize) {
    var max = Math.min(firstIndex + chunkSize, displayedLogEntries.length);

    return new Promise((resolve, reject) => {
      for (var i = firstIndex; i < max; i++) {
          this.formatEntry(displayedLogEntries[i]);
      }

      resolve(true);
    });
  },

  updateDisplayedLog() {
    var logType = this.get('controller.logType') || 'fusor_log',
      promises = [], displayedLogEntries = [],
      entries, idx = 0, chunksize = 200;

    this.set('controller.searchResultIdx', 0);
    this.set('controller.numSearchResults', 0);
    this.set('controller.logPath', this.get(`controller.model.${logType}.path`));
    this.set('controller.displayedLogEntries', []);

    entries = this.get(`controller.model.${logType}.entries`);

    if (entries) {
      while (idx < entries.length) {
        promises.push(this.updateDisplayedLogChunk(logType, entries, idx, chunksize));
        idx += chunksize;
      }
    }

    return Ember.RSVP.Promise.all(promises);
  },

  updateDisplayedLogChunk(logType, allLogEntries, firstIndex, chunkSize) {
    var max = Math.min(firstIndex + chunkSize, allLogEntries.length);
    var controller = this.get('controller');

    return new Promise((resolve, reject) => {
      let displayedLogEntries = controller.get(`displayedLogEntries`);
      let controllerLogType = controller.get('logType') || 'fusor_log';

      if (controllerLogType !== logType) {
        return reject('log type has changed');
      }

      for (var i = firstIndex; i < max; i++) {
        let entry = allLogEntries[i];
        if (this.isIncluded(entry)) {
          this.formatEntry(entry);
          displayedLogEntries.pushObject(entry);
        }
      }

      resolve(true);
    });
  },

  initLog() {
    var self = this,
      controller = this.get('controller');

    self.set('pollingActive', true);
    return Ember.RSVP.Promise.all([
        this.updateForemanTask(),
        this.updateLog()
    ]).finally(function () {
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
        self.addNewEntries(controller, response);
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
      function (foremanTask) {
        var deploymentInProgress = foremanTask.get('result') === 'pending' && foremanTask.get('progress') !== '1';
        controller.set('deploymentInProgress',  deploymentInProgress);
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
          self.loadLog(params.log_type, response);
        },
        function (error) {
          self.showError(error);
        })
      .finally(function () {
        controller.set('isLoading', false);
      });
  },

  loadLog(logType, response) {
    var promises = [], displayedLogEntries = [], idx = 0, chunksize = 200,
      responseLog = response[logType];

    this.set('controller.searchResultIdx', 0);
    this.set('controller.numSearchResults', 0);
    this.set(`controller.model.${logType}.path`, responseLog.path);
    this.set(`controller.model.${logType}.entries`, []);
    this.set('controller.logPath', responseLog.path);
    this.set('controller.displayedLogEntries', []);

    while (idx < responseLog.entries.length) {
      promises.push(this.loadLogChunk(logType, responseLog.entries, idx, chunksize));
      idx += chunksize;
    }

    return Ember.RSVP.Promise.all(promises).then(() => {
      this.get('controller').send('scrollToEnd');
    });
  },

  loadLogChunk(logType, responseEntries, firstIndex, chunkSize) {
    var max = Math.min(firstIndex + chunkSize, responseEntries.length);
    var controller = this.get('controller');
    var entries = this.get(`controller.model.${logType}.entries`);
    var displayedLogEntries = this.get(`controller.displayedLogEntries`);

    return new Promise((resolve, reject) => {
      let controllerLogType = controller.get('logType') || 'fusor_log';

      for (var i = firstIndex; i < max; i++) {
        let entryObject = Ember.Object.create(responseEntries[i]);
        entries.pushObject(entryObject);
        if (controllerLogType === logType && this.isIncluded(entryObject)) {
          this.formatEntry(entryObject);
          displayedLogEntries.pushObject(entryObject);
        }
      }

      resolve(true);
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
    var newEntries, logType, existingEntries, promises = [], idx = 0, chunksize = 200;

    logType = controller.get('logType') || 'fusor_log';

    if (!response[logType] || !response[logType].entries || response[logType].entries.length === 0) {
      return 0;
    }

    newEntries = response[logType].entries;
    existingEntries = controller.get(`model.${logType}.entries`);

    while (idx < newEntries.length) {
      promises.push(this.loadLogChunk(logType, newEntries, idx, chunksize));
      idx += chunksize;
    }

    return Ember.RSVP.Promise.all(promises).then(() => {
      if (newEntries.length > 0) {
        this.get('controller').send('scrollToEnd');
      }
    });
  },

  isIncluded(entry) {
    var controller = this.get('controller');

    switch (entry.get('level')) {
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

    searchLogString = controller.get('searchLogString');
    formattedText = entry.get('text');
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
    entry.set('formattedText', Ember.String.htmlSafe(formattedText));
    entry.set('numSearchResults', entryNumSearchResults);
  }
});
