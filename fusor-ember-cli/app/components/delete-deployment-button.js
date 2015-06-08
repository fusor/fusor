import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',

  click: function(event) {
    this.sendAction('action', this.get('deployment'));
  },

});
