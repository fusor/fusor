import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  rhev_storage_type: Ember.computed.alias("controllers.deployment.model.rhev_storage_type"),
  rhev_storage_name: Ember.computed.alias("controllers.deployment.model.rhev_storage_name"),
  rhev_storage_address: Ember.computed.alias("controllers.deployment.model.rhev_storage_address"),
  rhev_share_path: Ember.computed.alias("controllers.deployment.model.rhev_share_path"),

  rhev_export_domain_name: Ember.computed.alias("controllers.deployment.model.rhev_export_domain_name"),
  rhev_export_domain_address: Ember.computed.alias("controllers.deployment.model.rhev_export_domain_address"),
  rhev_export_domain_path: Ember.computed.alias("controllers.deployment.model.rhev_export_domain_path"),

  step3RouteName: Ember.computed.alias("controllers.deployment.step3RouteName"),
  isCloudForms: Ember.computed.alias("controllers.deployment.isCloudForms"),

  hasEndingSlashInSharePath: function() {
    if (Ember.isPresent(this.get('rhev_share_path'))) {
      return (this.get('rhev_share_path').slice('-1') === '/');
    }
  }.property('rhev_share_path'),

  hasEndingSlashInExportPath: function() {
    if (Ember.isPresent(this.get('rhev_export_domain_path'))) {
      return (this.get('rhev_export_domain_path').slice('-1') === '/');
    }
  }.property('rhev_export_domain_path'),

  errorsHashSharePath: function() {
    if (this.get('hasEndingSlashInSharePath')) {
      return {"name": 'You cannot have a trailing slash'};
    } else {
      return {};
    }
  }.property('hasEndingSlashInSharePath', 'rhev_share_path'),

  errorsHashExportPath: function() {
    if (this.get('hasEndingSlashInExportPath')) {
      return {"name": 'You cannot have a trailing slash'};
    } else {
      return {};
    }
  }.property('hasEndingSlashInExportPath', 'rhev_export_domain_path'),

  isNFS: function() {
    return (this.get('rhev_storage_type') === 'NFS');
  }.property('rhev_storage_type'),

  isLocal: function() {
    return (this.get('rhev_storage_type') === 'Local');
  }.property('rhev_storage_type'),

  isGluster: function() {
    return (this.get('rhev_storage_type') === 'Gluster');
  }.property('rhev_storage_type'),

  isInvalidStorageFields: function() {
    return (Ember.isBlank(this.get('rhev_storage_type')) ||
            Ember.isBlank(this.get('rhev_storage_name')) ||
            Ember.isBlank(this.get('rhev_storage_address')) ||
            Ember.isBlank(this.get('rhev_share_path')) ||
            this.get('hasEndingSlashInSharePath')
           );
  }.property('rhev_storage_type', 'rhev_storage_name', 'rhev_storage_address', 'rhev_share_path', 'hasEndingSlashInSharePath'),

  isInvalidExportDomainFields: function() {
    return (Ember.isBlank(this.get('rhev_export_domain_name')) ||
            Ember.isBlank(this.get('rhev_export_domain_address')) ||
            Ember.isBlank(this.get('rhev_export_domain_path')) ||
            this.get('hasEndingSlashInExportPath')
           );
  }.property('rhev_export_domain_name', 'rhev_export_domain_address', 'rhev_export_domain_path', 'hasEndingSlashInExportPath'),

  disableNextStorage: function () {
    if (this.get('isCloudForms')) {
      return (this.get('isInvalidStorageFields') || this.get('isInvalidExportDomainFields'));
    } else {
      return (this.get('isInvalidStorageFields'));
    }
  }.property('isInvalidStorageFields', 'isInvalidExportDomainFields'),

  validRhevStorage: Ember.computed.not('disableNextStorage'),

});

