// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);
    var deploymentNames = Ember.A();
    controller.set('deploymentNames', Ember.A());
    this.store.findAll('deployment').then(function(results) {
      deploymentNames = results.getEach('name');
      console.log(deploymentNames);
      return controller.set('deploymentNames', deploymentNames);
    });
  },

  actions: {
    invalidateSession: function () {
      return this.transitionTo('login');
    }
  }
});
