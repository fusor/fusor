import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

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

  hasNoLeadingSlashInSharePath: function() {
    if (Ember.isPresent(this.get('rhev_share_path'))) {
      return (this.get('rhev_share_path').charAt(0) !== '/');
    }
  }.property('rhev_share_path'),

  hasNoLeadingSlashInExportPath: function() {
    if (Ember.isPresent(this.get('rhev_export_domain_path'))) {
      return (this.get('rhev_export_domain_path').charAt(0) !== '/');
    }
  }.property('rhev_export_domain_path'),

  errorsHashSharePath: function() {
    if (this.get('hasNoLeadingSlashInSharePath')) {
      return {"name": 'You must have a leading slash'};
    } else if (this.get('hasEndingSlashInSharePath')) {
      return {"name": 'You cannot have a trailing slash'};
    } else {
      return {};
    }
  }.property('hasEndingSlashInSharePath', 'rhev_share_path'),

  errorsHashExportPath: function() {
    if (this.get('hasNoLeadingSlashInExportPath')) {
      return {"name": 'You must have a leading slash'};
    } else if (this.get('hasEndingSlashInExportPath')) {
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
            this.get('hasEndingSlashInSharePath') ||
            this.get('hasNoLeadingSlashInSharePath')
           );
  }.property('rhev_storage_type', 'rhev_storage_name', 'rhev_storage_address', 'rhev_share_path', 'hasEndingSlashInSharePath', 'hasNoLeadingSlashInSharePath'),

  isInvalidExportDomainFields: function() {
    return (Ember.isBlank(this.get('rhev_export_domain_name')) ||
            Ember.isBlank(this.get('rhev_export_domain_address')) ||
            Ember.isBlank(this.get('rhev_export_domain_path')) ||
            this.get('hasEndingSlashInExportPath') ||
            this.get('hasNoLeadingSlashInExportPath')
           );
  }.property('rhev_export_domain_name', 'rhev_export_domain_address', 'rhev_export_domain_path', 'hasEndingSlashInExportPath', 'hasNoLeadingSlashInExportPath'),

  invalidStorageName: function() {
      var validAlphaNumbericRegex = new RegExp(/^[A-Za-z0-9_-]+$/);
      if (Ember.isPresent(this.get('rhev_storage_name'))) {
          return !(this.get('rhev_storage_name').match(validAlphaNumbericRegex));
      }
  }.property('rhev_storage_name'),

  invalidStorageAddress: function() {
      var validHostnameRegex = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$";
      if (Ember.isPresent(this.get('rhev_storage_address'))) {
          return !(this.get('rhev_storage_address').match(validHostnameRegex));
      }
  }.property('rhev_storage_address'),

  invalidExportDomainName: function() {
      var validAlphaNumbericRegex = new RegExp(/^[A-Za-z0-9_-]+$/);
      if (Ember.isPresent(this.get('rhev_export_domain_name'))) {
          return !(this.get('rhev_export_domain_name').match(validAlphaNumbericRegex));
      }
  }.property('rhev_export_domain_name'),

  invalidExportAddress: function() {
      var validHostnameRegex = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$";
      if (Ember.isPresent(this.get('rhev_export_domain_address'))) {
          return !(this.get('rhev_export_domain_address').match(validHostnameRegex));
      }
  }.property('rhev_export_domain_address'),

  disableNextStorage: function () {
    if (this.get('isCloudForms')) {
      return (this.get('isInvalidStorageFields') ||
              this.get('isInvalidExportDomainFields') ||
              this.get('invalidStorageName') ||
              this.get('invalidStorageAddress') ||
              this.get('invalidExportDomainName') ||
              this.get('invalidExportAddress'));
    } else {
      return (this.get('isInvalidStorageFields') ||
              this.get('invalidStorageName') ||
              this.get('invalidStorageAddress'));
    }
  }.property('isInvalidStorageFields', 'isInvalidExportDomainFields',
             'invalidStorageName', 'invalidStorageAddress',
             'invalidExportDomainName', 'invalidExportAddress'),

  validRhevStorage: Ember.computed.not('disableNextStorage')

});

