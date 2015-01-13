import Ember from 'ember';

export default Ember.Component.extend({

  rowsPassed: function() {
    if(this.get('rows')) {
      if (this.get('rows') > 0) {
        return true;
      }
    }
  }.property('rows'),

  numRows: function () {
    return this.getWithDefault('rows', '');
  }.property(),
  numCols: function () {
    return this.getWithDefault('cols', '');
  }.property(),
});
