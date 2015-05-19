import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    var self = this;
    return this.store.find('session-portal').then(function(results) {
      if (Ember.isBlank(results)) {
        return self.store.createRecord('session-portal');
      } else {
        return results.get('firstObject');
      }
    });
  },

  actions: {
    error: function(reason, transition) {
      console.log(reason);
      alert(reason.statusText);
    }
  }
});
