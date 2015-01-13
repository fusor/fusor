import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    save: function() {
      return this.transitionTo('deployments');
    }
  }
});
