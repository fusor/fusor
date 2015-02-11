import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['subscriptions', 'rhci', 'satellite/index'],
  disableContentTab: Ember.computed.alias("controllers.subscriptions.disableNext"),
  disable1ANext: Ember.computed.alias("controllers.satellite/index.disable1ANext"),
});
