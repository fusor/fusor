import Ember from 'ember';

export default Ember.Mixin.create({

  needs: ['deployment', 'application'],

  isStarted: Ember.computed.alias("controllers.deployment.isStarted"),
  isNotStarted: Ember.computed.alias("controllers.deployment.isNotStarted")

});
