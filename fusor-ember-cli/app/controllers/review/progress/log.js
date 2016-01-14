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
    Ember.run.once(this, () => this.send('updateDisplayedLog'));
  }),

  isSearchActive:Ember.computed('searchLogString', function() {
    return !!this.get('searchLogString');
  }),

  logTypeChanged: function() {
    this.set('displayedLogHtml', '');
    this.set('newEntries', []);
    // run later to allow the dropdown to close and log to clear before doing the real work
    Ember.run.later(this, () => { this.send('changeLogType'); });
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
      return true; //bubble anc execute route action
    },

    clearSearch() {
      this.set('searchLogInputValue', null);
      this.set('searchLogString', null);
      return true; //bubble anc execute route action
    },

    navPreviousSearchResult() {
      this.navSearchResult(-1);
    },

    navNextSearchResult() {
      this.navSearchResult(1);
    }
  },

  navSearchResult(idxChange) {
    var numSearchResults = this.get('numSearchResults'),
      searchResultIdx = this.get('searchResultIdx'),
      isSearchActive = this.get('isSearchActive');

    if (!isSearchActive || numSearchResults === 0) {
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
