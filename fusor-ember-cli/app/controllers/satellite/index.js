import Ember from 'ember';

export default Ember.ObjectController.extend({

  name: '',

  disable1B: function() {
    return (this.get('name.length') === 0);
  }.property('name'),

  disable1ANext: Ember.computed.alias("disable1B"),

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
