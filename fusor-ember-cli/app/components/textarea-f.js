import Ember from 'ember';

export default Ember.Component.extend({

  rowsPassed: Ember.computed('rows', function() {
    if(this.get('rows')) {
      if (this.get('rows') > 0) {
        return true;
      }
    }
  }),

  numRows: Ember.computed(function () {
    return this.getWithDefault('rows', '');
  }),

  numCols: Ember.computed(function () {
    return this.getWithDefault('cols', '');
  })

});
