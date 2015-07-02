import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  rhev_is_self_hosted: Ember.computed.alias("controllers.deployment.rhev_is_self_hosted"),

  rhevSetup: function() {
    return (this.get('rhev_is_self_hosted') ? "selfhost" : "rhevhost");
  }.property('rhev_is_self_hosted'),

  rhevSetupTitle: function() {
    return (this.get('rhev_is_self_hosted') ? "Self Hosted" : "Host + Engine");
  }.property('rhev_is_self_hosted'),

  isSelfHosted: function() {
    return (this.get('rhevSetup') === 'selfhost');
  }.property('rhevSetup'),

  actions: {
    rhevSetupChanged: function() {
      return this.get('controllers.deployment').set('rhev_is_self_hosted', this.get('isSelfHosted'));
    }
  }

});
