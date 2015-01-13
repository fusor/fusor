import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pull-left', 'toggle_updown'],

  actions: {

    showUpstream: function() {
      this.set('isUpstream', true);
    },

    showDownstream: function() {
      this.set('isUpstream', false);
    },

  }
});
