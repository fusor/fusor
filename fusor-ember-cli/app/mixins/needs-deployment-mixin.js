import Ember from 'ember';

export default Ember.Mixin.create({

  deploymentController: Ember.inject.controller('deployment'),
  applicationController: Ember.inject.controller('application'),

  isStarted: Ember.computed.alias("deploymentController.isStarted"),
  isNotStarted: Ember.computed.alias("deploymentController.isNotStarted"),

  isNew: false,

  deploymentName: Ember.computed.alias("deploymentController.model.name"),

  ////////////////////////////////////////////////////////////
  // ALIASES AND COMMONLY USED COMPUTED PROPS
  // Consolidates these and makes them available for free to any mixee
  // Prevents littering leaf controllers with duplicated aliases
  ////////////////////////////////////////////////////////////
  upstreamConsumerUuid: Ember.computed.alias(
    'deploymentController.model.upstream_consumer_uuid'),
  hasUpstreamConsumerUuid: Ember.computed('upstreamConsumerUuid', function() {
    return Ember.isPresent(this.get('upstreamConsumerUuid'));
  }),
  upstreamConsumerName: Ember.computed.alias(
    'deploymentController.model.upstream_consumer_name'),

  // Product names
  fullnameSatellite: Ember.computed.alias('deploymentController.fullnameSatellite'),
  fullnameRhev: Ember.computed.alias('deploymentController.fullnameRhev'),
  fullnameOpenStack: Ember.computed.alias('deploymentController.fullnameOpenStack'),
  fullnameCloudForms: Ember.computed.alias('deploymentController.fullnameCloudForms'),
  fullnameOpenShift: Ember.computed.alias('deploymentController.fullnameOpenShift')
});
