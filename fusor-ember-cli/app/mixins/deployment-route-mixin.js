import Ember from 'ember';

export default Ember.Mixin.create({

  actions: {
    saveDeployment(routeNameForTransition) {
      var deployment = this.get('controller.model');
      var self = this;
      deployment.save().then(
        function(result) {
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
  }

});



