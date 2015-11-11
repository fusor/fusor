import Ember from 'ember';

export default Ember.Mixin.create({

  deploymentController: Ember.inject.controller('deployment'),
  applicationController: Ember.inject.controller('application'),

  isStarted: Ember.computed.alias("deploymentController.isStarted"),
  isNotStarted: Ember.computed.alias("deploymentController.isNotStarted")

});
