import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
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
      this.updateDisplayedLog().then(() => this.navNextSearchResult());
    },

    search() {
      this.updateDisplayedLog().then(() => this.navNextSearchResult());
    },

    clearSearch() {
      this.updateDisplayedLog();
    },

    changeLogType() {
      var logType = this.get('controller.logType') || 'fusor_log';

      this.stopPolling();
      this.set('controller.displayedLog', this.get(`controller.model.${logType}`));

      this.updateDisplayedLog()
        .then(() => this.initLog())
        .then(() => this.navNextSearchResult());
    }
  },

  updateDisplayedLog() {
    var logType = this.get('controller.logType') || 'fusor_log',
      promises = [], entries, idx = 0, chunksize = 200, showLogTruncated;

    this.set('controller.searchResultIdx', 0);
    this.set('controller.searchResults', []);
    this.set('controller.logPath', this.get(`controller.model.${logType}.path`));
    this.set('controller.displayedLogHtml', '');
    this.set('controller.newEntries', []);

    entries = this.get(`controller.model.${logType}.entries`);

    if (entries) {
      showLogTruncated = entries[0] && entries[0].get('line_number') > 1;
      this.set('controller.showLogTruncated', showLogTruncated);

      while (idx < entries.length) {
        promises.push(this.updateDisplayedLogChunk(logType, entries, idx, chunksize));
        idx += chunksize;
      }
    }

    return Ember.RSVP.Promise.all(promises).then((values) => {
      this.sortSearchResults();
      this.set('controller.displayedLogHtml', Ember.String.htmlSafe(values.join('')));
    });
  },

  updateDisplayedLogChunk(logType, allLogEntries, firstIndex, chunkSize) {
    var max = Math.min(firstIndex + chunkSize, allLogEntries.length);
    var controller = this.get('controller');

    return new Promise((resolve, reject) => {
      let displayedLogHtml = this.get('controller.displayedLogHtml') || '';
      let displayedLogEntries = [];
      let controllerLogType = controller.get('logType') || 'fusor_log';

      if (controllerLogType !== logType) {
        return reject('log type has changed');
      }

      for (var i = firstIndex; i < max; i++) {
        let entry = allLogEntries[i];
        if (this.isIncluded(entry)) {
          displayedLogEntries.push(this.getHtml(entry));
        }
      }

      resolve(displayedLogEntries.join(''));
    });
  },

  initLog() {
    var self = this, controller = self.get('controller');

    self.set('pollingActive', true);
    return Ember.RSVP.Promise.all([
      self.updateForemanTask(),
      self.updateLog()
    ]).then(function () {
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
      this.updateLog().then(() => this.updateForemanTask());
  },

  getFullLog(params) {
    var self = this, controller = this.get('controller');

    controller.set('isLoading', true);
    return this.getJsonLog(params).then(
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
    var promises = [], idx = 0, chunksize = 200, showLogTruncated,
      responseLog = response[logType];

    this.set('controller.searchResultIdx', 0);
    this.set('controller.searchResults', []);
    this.set(`controller.model.${logType}.path`, responseLog.path);
    this.set(`controller.model.${logType}.entries`, []);
    this.set('controller.logPath', responseLog.path);
    this.set('controller.displayedLogHtml', '');
    this.set('controller.newEntries', []);

    showLogTruncated = responseLog.entries[0] && responseLog.entries[0].line_number > 1;
    this.set('controller.showLogTruncated', showLogTruncated);

    while (idx < responseLog.entries.length) {
      promises.push(this.loadLogChunk(logType, responseLog.entries, idx, chunksize));
      idx += chunksize;
    }

    return Ember.RSVP.Promise.all(promises).then((values) => {
      this.sortSearchResults();
      this.set('controller.displayedLogHtml', Ember.String.htmlSafe(values.join('')));
      this.scrollToEnd();
    });
  },

  loadLogChunk(logType, responseEntries, firstIndex, chunkSize) {
    var max = Math.min(firstIndex + chunkSize, responseEntries.length);
    var controller = this.get('controller');
    var entries = this.get(`controller.model.${logType}.entries`);
    var displayedLogHtml = this.get('controller.displayedLogHtml') || '';
    var displayedLogEntries = [];

    return new Promise((resolve, reject) => {
      let controllerLogType = controller.get('logType') || 'fusor_log';

      for (var i = firstIndex; i < max; i++) {
        let entryObject = Ember.Object.create(responseEntries[i]);
        entries.pushObject(entryObject);
        if (controllerLogType === logType && this.isIncluded(entryObject)) {
          displayedLogEntries.push(this.getHtml(entryObject));
        }
      }

      resolve(displayedLogEntries.join(''));
    });
  },

  getJsonLog(params) {
    var self = this,
      token = Ember.$('meta[name="csrf-token"]').attr('content'),
      deploymentId = this.modelFor('deployment').get('id'),
      url = '/fusor/api/v21/unlogged/deployments/' + deploymentId + "/log";

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
    var newEntries, logType, promises = [], idx = 0, chunksize = 200;

    logType = controller.get('logType') || 'fusor_log';

    if (!response[logType] || !response[logType].entries || response[logType].entries.length === 0) {
      return 0;
    }

    newEntries = response[logType].entries;

    while (idx < newEntries.length) {
      promises.push(this.loadLogChunk(logType, newEntries, idx, chunksize));
      idx += chunksize;
    }

    return Ember.RSVP.Promise.all(promises).then((values) => {
      // concatenating the values to a very large displayedLogHtml hung the UI
      // so we'll add to a list of new entries and display those separately in the
      // template until the next refresh
      this.get('controller.newEntries').pushObject(values.join(''));
      this.sortSearchResults();
      if (newEntries.length > 0) {
        this.scrollToEnd();
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

  getHtml(entry) {
    var searchExp, formattedText, searchLogString,
      controller = this.get('controller'),
      searchResults = controller.get('searchResults'),
      entryNumSearchResults = 0, entryClass;

    searchLogString = controller.get('searchLogString');
    formattedText = entry.get('text');
    entryClass = entry && entry.level ? `log-entry log-entry-level-${entry.level.toLowerCase()}` : 'log-entry';

    if (searchLogString) {
      searchExp = new RegExp(searchLogString, 'gi');
      formattedText = formattedText.replace(searchExp, function (match) {
        let uniqueIdx = {
          line: entry.line_number,
          idx: entryNumSearchResults,
          cssClass: `log-entry-search-result-${entry.line_number}-${entryNumSearchResults}`
        };
        entryNumSearchResults++;
        searchResults.pushObject(uniqueIdx);
        return `<span class="log-entry-search-result ${uniqueIdx.cssClass}">${match}</span>`;
      });
    }

    formattedText = `<p class="${entryClass}">${formattedText}</p>`;
    return formattedText;
  },

  sortSearchResults() {
    var searchResults = this.get('controller.searchResults');

    if (!searchResults) {
      return;
    }

    searchResults.sort((resultA, resultB) => {
      var cmp = resultA.line - resultB.line;

      if (cmp !== 0) {
        return cmp;
      }

      return resultA.idx - resultB.idx;
    });
  },

  navNextSearchResult() {
    Ember.run.later(this, () => { this.get('controller').send('navNextSearchResult'); });
  },

  scrollToEnd() {
    Ember.run.later(this, () => { this.get('controller').send('scrollToEnd'); });
  }
});
