import Ember from 'ember';

export default Ember.Component.extend({

  prevPage: Ember.computed('pageNumber', function() {
    return parseInt(this.get('pageNumber')) - 1;
  }),

  nextPage: Ember.computed('nextPage', function() {
    return parseInt(this.get('pageNumber')) + 1;
  }),

  disablePrevPage: Ember.computed('pageNumber', function() {
    return parseInt(this.get('pageNumber')) === 1 || Ember.isBlank(this.get('pageNumber'));
  }),

  disableNextPage: Ember.computed('pageNumber', 'totalPages', function() {
    return parseInt(this.get('pageNumber')) === parseInt(this.get('totalPages'));
  }),

  entriesFrom: Ember.computed('pageNumber', 'totalPages', 'totalCnt', function() {
    return ((parseInt(this.get('pageNumber')) * 20) - 19);
  }),

  entriesTo: Ember.computed('pageNumber', 'totalPages', 'totalCnt', function() {
    if (parseInt(this.get('pageNumber')) === parseInt(this.get('totalPages'))) {
      return this.get('totalCnt');
    } else {
      return (parseInt(this.get('pageNumber')) * 20);
    }
  }),

  showPagination: Ember.computed('totalPages', function() {
    return (parseInt(this.get('totalPages')) > 1);
  }),

  displayingEntries: Ember.computed('totalCnt', 'totalPages', 'entriesFrom', 'entriesTo', function() {
    if (parseInt(this.get('totalCnt') === 0)) {
      return 'No entries found';
    } else if (parseInt(this.get('totalPages')) < 2) {
      return `Displaying <strong>all ${this.get('totalCnt')}</strong> entries`.htmlSafe();
    } else {
      return `Displaying entries <strong>${this.get('entriesFrom')} - ${this.get('entriesTo')}</strong> of <strong>${this.get('totalCnt')}</strong> in total`.htmlSafe();
    }
  })

});
