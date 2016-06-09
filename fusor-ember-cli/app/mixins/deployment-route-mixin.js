import Ember from 'ember';

export default Ember.Mixin.create({

  actions: {
    saveDeployment(routeNameForTransition) {
      let deployment = this.get('controller.model');
      let self = this;
      let isNew = Ember.isBlank(deployment.get('id'));

      deployment.save().then(
        function(result) {
          if (isNew) {
            self.updateOpenstackDefaults(result);
            if (routeNameForTransition === 'satellite.access-insights') {
              self.controllerFor('deployment').set('backRouteNameOnSatIndex', 'deployment.start');
            }
          }

          if (routeNameForTransition) {
            if (routeNameForTransition === 'deployments') {
              return self.transitionTo('deployments');
            } else {
              return self.transitionTo(routeNameForTransition, result);
            }
          }
        },
        function(error) {
          self.set('errorMsg', 'error saving organization' + error);
        }
      );
    }
  },

  updateOpenstackDefaults(deployment) {
    //override me
  }
});



