import Ember from 'ember';

export default Ember.Mixin.create({

  needs: ['configure-organization', 'configure-environment'],

  rhciModalButtons: [
      Ember.Object.create({title: 'No', clicked:"cancel", dismiss: 'modal'}),
      Ember.Object.create({title: 'Yes', clicked:"redirectToDeployments", type: 'primary'})
  ],

  actions: {
    redirectToDeployments: function () {
      this.transitionTo('deployments');
    }
  }

});
