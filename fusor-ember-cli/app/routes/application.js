// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    invalidateSession: function () {
      return this.transitionTo('login');
    },

    notImplemented: function() {
      alert('This link is not implemented in the fusor-ember-cli prototype');
    },
    willImplement: function() {
      alert('Check back soon. This will be implemented soon.');
    },

  }
});
