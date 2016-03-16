import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import { AllValidator, PresenceValidator, AlphaNumericDashUnderscoreValidator, HostnameValidator } from '../../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  openshiftController: Ember.inject.controller('openshift'),

  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  isSubscriptions: Ember.computed.alias("deploymentController.isSubscriptions"),

  nextRouteNameAfterOpenshift: Ember.computed(
    'isCloudForms',
    'isSubscriptions',
    function() {
        if (this.get('isCloudForms')) {
          return 'cloudforms';
        } else if (this.get('isSubscriptions')) {
          return 'subscriptions';
        } else {
          return 'review';
        }
    }
  ),

  openshiftUsernameValidator: Ember.computed.alias("openshiftController.openshiftUsernameValidator"),
  isValidOpenshiftConfiguration: Ember.computed.alias("openshiftController.isValidOpenshiftConfiguration"),
  isInvalidOpenshiftConfiguration: Ember.computed.alias("openshiftController.isInvalidOpenshiftConfiguration"),

  hasEndingSlashInExportPath: Ember.computed('model.openshift_export_path', function() {
    if (Ember.isPresent(this.get('model.openshift_export_path'))) {
      return (this.get('model.openshift_export_path').slice('-1') === '/');
    }
  }),

  hasNoLeadingSlashInExportPath: Ember.computed('model.openshift_export_path', function() {
    if (Ember.isPresent(this.get('model.openshift_export_path'))) {
      return (this.get('model.openshift_export_path').charAt(0) !== '/');
    }
  }),

  errorsHashExportPath: Ember.computed('hasEndingSlashInExportPath', 'model.openshift_export_path', function() {
    if (this.get('hasNoLeadingSlashInExportPath')) {
      return {"name": 'You must have a leading slash'};
    } else if (this.get('hasEndingSlashInExportPath')) {
      return {"name": 'You cannot have a trailing slash'};
    } else {
      return {};
    }
  }),

  isNFS: Ember.computed('model.openshift_storage_type', function() {
    return (this.get('model.openshift_storage_type') === 'NFS');
  }),

  isDoNotUse: Ember.computed('model.openshift_storage_type', function() {
    return (this.get('model.openshift_storage_type') === 'DoNotUse');
  }),

  isGluster: Ember.computed('model.openshift_storage_type', function() {
    return (this.get('model.openshift_storage_type') === 'Gluster');
  }),

  isInvalidExportPath: Ember.computed(
    'model.openshift_export_path',
    'hasEndingSlashInExportPath',
    'hasNoLeadingSlashInExportPath',
    function() {
      return (Ember.isBlank(this.get('model.openshift_export_path')) ||
              this.get('hasEndingSlashInExportPath') ||
              this.get('hasNoLeadingSlashInExportPath')
             );
    }
  ),

  invalidStorageName: Ember.computed('model.openshift_storage_name', function() {
      var validAlphaNumbericRegex = new RegExp(/^[A-Za-z0-9_-]+$/);
      if (Ember.isPresent(this.get('model.openshift_storage_name'))) {
          return !(this.get('model.openshift_storage_name').trim().match(validAlphaNumbericRegex));
      }
  }),

  hostnameValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      AlphaNumericDashUnderscoreValidator.create({})
    ]
  }),

  postTextDomainName: Ember.computed('domainName', function() {
    return "." + this.get('domainName');
  }),

  invalidSubdomain: Ember.computed('model.openshift_subdomain_name', function() {
    return !this.get('hostnameValidator').isValid(this.get('model.openshift_subdomain_name'));
  }),

  disableNextOpenshiftConfig: Ember.computed(
    'invalidStorageName',
    'isInvalidExportPath',
    'invalidSubdomain',
    function () {
        return (this.get('invalidStorageName') ||
                this.get('isInvalidExportPath') ||
                this.get('invalidSubdomain'));
    }
  ),

  validRhevStorage: Ember.computed.not('disableNextStorage'),

});
