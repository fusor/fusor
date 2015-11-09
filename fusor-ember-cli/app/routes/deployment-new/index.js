import Ember from 'ember';

export default Ember.Route.extend({

  // if user manually hits this route (deployments/news), then redirecto to deployments/news/start
  beforeModel() {
    return this.transitionTo('deployment-new.start');
  }

});
