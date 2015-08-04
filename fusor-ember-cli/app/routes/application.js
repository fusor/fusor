// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);
    var deploymentNames = [];
    this.store.find('deployment').then(function(results) {
      deploymentNames = results.getEach('name');
      console.log(deploymentNames);
      return controller.set('deploymentNames', deploymentNames);
    });
  },

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
