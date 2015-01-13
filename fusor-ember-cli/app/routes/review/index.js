import Ember from 'ember';

export default Ember.Route.extend({
  afterModel: function() {
    if (!(this.controllerFor('application').get('isUpstream')) && this.controllerFor('subscriptions').get('disableNext')) {
     this.transitionTo('subscriptions');
    } else {
     this.transitionTo('review.installation');
    }
  }
});
