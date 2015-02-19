import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['subscriptions', 'rhci', 'satellite/index', 'configure-organization', 'configure-environment'],

  disable1B: Ember.computed.alias("controllers.satellite/index.disable1B"),

  disable1BNext: Ember.computed.alias("controllers.configure-organization.disable1BNext"),

  disable1CNext: Ember.computed.alias("controllers.configure-environment.disable1CNext"),

  disable1C: Ember.computed.any("disable1B", "disable1BNext"),

  disableAll: Ember.computed.any("disable1B", "disable1BNext", "disable1CNext")

});
