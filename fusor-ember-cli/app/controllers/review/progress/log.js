import Ember from 'ember';
import NeedsDeploymentMixin from '../../../mixins/needs-deployment-mixin';

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  //TODO
  //deploymentInProgress: Ember.computed.alias('deployment.isInProgress'),

  searchLogInputValue: null,
  scrollToEndChecked: true,
  errorChecked: true,
  warnChecked: true,
  infoChecked: true,
  debugChecked: false,

  isLogEmpty: Ember.computed('model.log.entries.[]', function() {
    var entries = this.get('model.log.entries');
    return !this.get('isLoading') && (!entries || !entries.length);
  }),

  logOptionsChanged: Ember.observer('errorChecked', 'warnChecked', 'infoChecked', 'debugChecked', function() {
    Ember.run.once(this, 'refreshProcessedLog');
  }),

  isSearchActive:Ember.computed('searchLogString', function() {
    return !!this.get('searchLogString');
  }),

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
      Ember.run.later(() => this.send('navNextSearchResult'));
    }
  },

  refreshProcessedLog: function() {
    this.send('refreshProcessedLog');
    if (this.get('isSearchActive')) {
      Ember.run.later(() => this.send('navNextSearchResult'));
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
