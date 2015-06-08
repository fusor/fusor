import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment', 'cloudforms'],

  cfme_root_password: Ember.computed.alias("controllers.deployment.cfme_root_password"),
  isSubscriptions: Ember.computed.alias("controllers.deployment.isSubscriptions"),

  nextRouteNameAfterCFME: function() {
    if (this.get('isSubscriptions')) {
      return 'subscriptions';
    } else {
      return 'review';
    }
  }.property('isSubscriptions')
});
