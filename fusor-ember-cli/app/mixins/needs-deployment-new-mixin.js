import Ember from 'ember';

export default Ember.Mixin.create({

  deploymentNewController: Ember.inject.controller('deployment-new'),
  applicationController: Ember.inject.controller('application'),

  isStarted: Ember.computed.alias("deploymentNewController.isStarted"),
  isNotStarted: Ember.computed.alias("deploymentNewController.isNotStarted"),

  isNew: true,

  deploymentName: Ember.computed.alias("deploymentNewController.model.name")

});
