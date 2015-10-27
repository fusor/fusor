import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  step2RouteName: Ember.computed.alias("controllers.deployment.step2RouteName"),
  isStarted: Ember.computed.alias("model.isStarted"),

  analyticsColor: function() {
    if (this.get('isStarted')) { return 'disabled'; } else { return ''; }
  }.property('isStarted')


});
