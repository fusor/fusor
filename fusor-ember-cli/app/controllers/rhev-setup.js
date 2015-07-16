import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  rhevIsSelfHosted: Ember.computed.alias("controllers.deployment.model.rhev_is_self_hosted"),

  rhevSetup: function() {
    return (this.get('rhevIsSelfHosted') ? "selfhost" : "rhevhost");
  }.property('rhevIsSelfHosted'),

  rhevSetupTitle: function() {
    return (this.get('rhevIsSelfHosted') ? "Self Hosted" : "Host + Engine");
  }.property('rhevIsSelfHosted'),

  isSelfHosted: function() {
    return (this.get('rhevSetup') === 'selfhost');
  }.property('rhevSetup'),

  actions: {
    rhevSetupChanged: function() {
      return this.get('controllers.deployment.model').set('rhev_is_self_hosted', this.get('isSelfHosted'));
    }
  }

});
