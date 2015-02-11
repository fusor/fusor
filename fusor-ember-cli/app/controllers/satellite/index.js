import Ember from 'ember';

export default Ember.ObjectController.extend({

  name: '',

  disable1ANext: function() {
    return (this.get('name.length') === 0);
  }.property('name'),

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
