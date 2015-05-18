import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.store.find('session-portal').then(function(results) {
      return results.get('firstObject');
    });
  },

  actions: {
    error: function(reason, transition) {
      console.log(reason);
      alert(reason.statusText);
    }
  }
});
