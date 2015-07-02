import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',

  click: function() {
    this.sendAction('action', this.get('deployment'));
  },

});
