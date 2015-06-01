import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  upstream_consumer_uuid: Ember.computed.alias("controllers.deployment.upstream_consumer_uuid"),
  upstream_consumer_name: Ember.computed.alias("controllers.deployment.upstream_consumer_name"),

  isRhev: Ember.computed.alias("controllers.deployment.deploy_rhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.deploy_openstack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.deploy_cfme"),

  //overwritten by setupController
  organizationUpstreamConsumerUUID: null,
  organizationUpstreamConsumerName: null,

  disableCredentialsNext: function() {
    return !(Ember.isPresent(this.get('identification')) && Ember.isPresent(this.get('password')) || Ember.isPresent(this.get('model.isAuthenticated')));
  }.property('username', 'password', 'model.isAuthenticated'),

  hasUpstreamConsumerUuid: function() {
    return Ember.isPresent(this.get('upstream_consumer_uuid'));
  }.property('upstream_consumer_uuid'),

  hasOrganizationUpstreamConsumerUUID: function() {
    return Ember.isPresent(this.get('organizationUpstreamConsumerUUID'));
  }.property('organizationUpstreamConsumerUUID'),

  backRouteNameonCredentials: function() {
    if (this.get('isCloudForms')) {
      return 'cloudforms.cfme-configuration';
    } else if (this.get('isOpenStack')) {
      return 'assign-nodes';
    } else if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'configure-environment';
    }
  }.property('isRhev', 'isOpenStack', 'isCloudForms'),

  nextButtonTitle: 'Next',

  actionCredentialsNext: function() {
    if (this.get('model.isAuthenticated')) {
      return 'redirectToManagementApplication';
    } else {
      return 'loginPortal';
    }
  }.property('model.isAuthenticated'),


});
