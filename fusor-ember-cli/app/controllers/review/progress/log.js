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
    {label: 'QCI Deployment (deployment.log)', value: 'fusor_log'},
    {label: 'Satellite (foreman.log)', value: 'foreman_log'},
    //{label: 'Satellite Proxy (proxy.log)', value: 'foreman_proxy_log'},
    {label: 'Subscriptions (candlepin.log)', value: 'candlepin_log'},
    {label: 'System Messages (messages)', value: 'messages_log'}
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
    var searchResults = this.get('searchResults'),
      searchResultIdx = this.get('searchResultIdx'),
      isSearchActive = this.get('isSearchActive');

    if (!isSearchActive || searchResults.length === 0) {
      return;
    }

    searchResultIdx += idxChange;
    if (searchResultIdx > searchResults.length) {
      searchResultIdx = 1;
    }

    if (searchResultIdx < 1) {
      searchResultIdx = searchResults.length;
    }

    this.set('searchResultIdx', searchResultIdx);
    this.markAndScrollToSearchResult(idxChange < 0);
  },

  markAndScrollToSearchResult(showAtTop) {
    var searchResults = this.get('searchResults'),
      searchResultIdx = this.get('searchResultIdx'),
      currentlySelected, searchResult, searchTag;

    searchTag = searchResults[searchResultIdx - 1];
    currentlySelected = Ember.$('.log-entry-search-selected');
    searchResult = Ember.$(`.${searchTag.cssClass}`);

    this.set('scrollToEndChecked', false);
    currentlySelected.removeClass('log-entry-search-selected');

    if (searchResult && searchResult[0]) {
      searchResult.addClass('log-entry-search-selected');
      searchResult[0].scrollIntoView(showAtTop);
    }
  }
});
