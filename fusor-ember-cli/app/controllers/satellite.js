import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['subscriptions', 'rhci', 'satellite/index', 'configure-organization'],

  disable1B: Ember.computed.alias("controllers.satellite/index.disable1B"),

  disable1BNext: Ember.computed.alias("controllers.configure-organization.disable1BNext"),

  disable1C: Ember.computed.any("disable1B", "disable1BNext"),

});
