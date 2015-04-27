import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.startPolling();
  },

  deactivate: function() {
    this.get('controller').stopPolling();
  }

});
