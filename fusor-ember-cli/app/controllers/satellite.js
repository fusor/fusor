import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['subscriptions', 'rhci'],
  disableContentTab: Ember.computed.alias("controllers.subscriptions.disableNext"),
});
