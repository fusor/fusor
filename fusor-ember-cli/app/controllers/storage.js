import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  rhev_storage_type: Ember.computed.alias("controllers.deployment.rhev_storage_type"),
  rhev_storage_address: Ember.computed.alias("controllers.deployment.rhev_storage_address"),
  rhev_share_path: Ember.computed.alias("controllers.deployment.rhev_share_path"),

  rhev_export_domain_name: Ember.computed.alias("controllers.deployment.rhev_export_domain_name"),
  rhev_export_domain_address: Ember.computed.alias("controllers.deployment.rhev_export_domain_address"),
  rhev_export_domain_path: Ember.computed.alias("controllers.deployment.rhev_export_domain_path"),

  step3RouteName: Ember.computed.alias("controllers.deployment.step3RouteName"),
  isCloudForms: Ember.computed.alias("controllers.deployment.isCloudForms"),

  isNFS: function() {
    return (this.get('rhev_storage_type') === 'NFS');
  }.property('rhev_storage_type'),

  isLocal: function() {
    return (this.get('rhev_storage_type') === 'Local');
  }.property('rhev_storage_type'),

  isGluster: function() {
    return (this.get('rhev_storage_type') === 'Gluster');
  }.property('rhev_storage_type'),

});
