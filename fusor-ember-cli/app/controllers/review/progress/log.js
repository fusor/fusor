import Ember from 'ember';
import NeedsDeploymentMixin from '../../../mixins/needs-deployment-mixin';

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  searchLogInputValue: null,
  scrollToEndChecked: true,
  errorChecked: true,
  warnChecked: true,
  infoChecked: true,
  debugChecked: false,
  logTypes: [
    {label: 'Deployment', value: 'fusor_log'},
    {label: 'Foreman', value: 'foreman_log'},
    //{label: 'Foreman Proxy', value: 'foreman_proxy_log'},
    {label: 'Candlepin', value: 'candlepin_log'},
    {label: 'Messages', value: 'messages_log'}
  ],

  showLogLoading: Ember.computed('errorMessage', 'isLoading', function() {
    return !this.get('errorMessage') && this.get('isLoading');
  }),

  showLogUpdating: Ember.computed('errorMessage', 'isLoading', 'deploymentInProgress', function () {
    return !this.get('errorMessage') && !this.get('isLoading') && this.get('deploymentInProgress');
  }),

  showLogTruncated: Ember.computed('errorMessage', 'isLoading', 'processedLogEntries.[]', function () {
    var processedLogEntries = this.get('processedLogEntries');
    return !this.get('errorMessage') && !this.get('isLoading') &&
      processedLogEntries && processedLogEntries[0] && processedLogEntries[0].get('line_number') !== 1;
  }),

  showLogEmpty: Ember.computed('errorMessage', 'isLoading', 'logType',
    'model.fusor_log.entries.[]',  'model.foreman_log.entries.[]', 'model.foreman_proxy_log.entries.[]',
    'model.candlepin_log.entries.[]', 'model.messages_log.entries.[]',
    function () {
      var logType, entries;
      logType = this.get('logType') || 'fusor_log';
      entries = this.get(`model.${logType}.entries`);
      return !this.get('errorMessage') && !this.get('isLoading') && (!entries || !entries.length);
    }),

  logOptionsChanged: Ember.observer('errorChecked', 'warnChecked', 'infoChecked', 'debugChecked', function () {
    Ember.run.once(this, 'refreshProcessedLog');
  }),

  isSearchActive:Ember.computed('searchLogString', function() {
    return !!this.get('searchLogString');
  }),

  logTypeChanged: function() {
    var self = this;
    self.set('processedLogEntries', []);
    self.send('changeLogType');
  }.observes('logType'),

  actions: {
    scrollToEnd() {
      if (this.get('deploymentInProgress') && this.get('scrollToEndChecked')) {
        var logOutput = Ember.$('.log-output')[0];
        if (logOutput) {
          logOutput.scrollTop = logOutput.scrollHeight;
        }
      }
    },

    search() {
      this.set('scrollToEndChecked', false);
      this.set('searchLogString', this.get('searchLogInputValue'));
      this.formatLog();
    },

    clearSearch() {
      this.set('searchLogInputValue', null);
      this.set('searchLogString', null);
      this.formatLog();
    },

    navPreviousSearchResult() {
      this.navSearchResult(-1);
    },

    navNextSearchResult() {
      this.navSearchResult(1);
    }
  },

  formatLog: function() {
    this.send('formatLog');
    if (this.get('isSearchActive')) {
      Ember.run.later(this, () => this.send('navNextSearchResult'));
    }
  },

  refreshProcessedLog: function() {
    this.send('refreshProcessedLog');
    if (this.get('isSearchActive')) {
      Ember.run.later(this, () => this.send('navNextSearchResult'));
    }
  },

  navSearchResult(idxChange) {
    var numSearchResults = this.get('numSearchResults'),
      searchResultIdx = this.get('searchResultIdx');

    if (numSearchResults === 0) {
      return;
    }

    searchResultIdx += idxChange;
    if (searchResultIdx > numSearchResults) {
      searchResultIdx = 1;
    }

    if (searchResultIdx < 1) {
      searchResultIdx = numSearchResults;
    }

    this.set('searchResultIdx', searchResultIdx);
    this.markAndScrollToSearchResult(idxChange < 0);
  },

  markAndScrollToSearchResult(showAtTop) {
    var searchResultIdx = this.get('searchResultIdx'),
     currentlySelected = Ember.$('.log-entry-search-selected'),
     searchResult = Ember.$(`.log-entry-search-result-${searchResultIdx}`);

    this.set('scrollToEndChecked', false);
    currentlySelected.removeClass('log-entry-search-selected');
    searchResult.addClass('log-entry-search-selected');
    searchResult[0].scrollIntoView(showAtTop);
  }
});
