import Ember from 'ember';
import request from 'ic-ajax';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";
import { AllValidator, PresenceValidator, AlphaNumericDashUnderscoreValidator, HostnameValidator } from '../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, {
  actions: {
    testMountPoint() {
      let checkExport = this.get('isCloudForms');
      this.storageMountRequest(this.get('model.rhev_share_path'), this.get('model.rhev_storage_address'), this.get('model.rhev_storage_type')).then(result => {
        this.set('errorMsg', null);
        if (!checkExport) {
          this.transitionTo(this.get('step3RouteName'));
        }
        this.set('showLoadingSpinner', false);
      }).catch(error => {
        this.set('errorMsg', "Error mounting data domain, please make sure it is a valid mount point");
      }).then(response => {
        if (checkExport && this.get('errorMsg') == null) {
          this.storageMountRequest(this.get('model.rhev_export_domain_path'), this.get('model.rhev_export_domain_address'), this.get('model.rhev_storage_type')).then(result => {
            this.set('errorMsg', null);
            this.transitionTo(this.get('step3RouteName'));
            this.set('showLoadingSpinner', false);
          }).catch(error => {
            this.set('errorMsg', "Error mounting export domain, please make sure it is a valid mount point");
          });
        }
      });
    }
  },

  storageMountRequest(path, address, type) {
    let deploymentId = this.get('deploymentId');
    this.set('loadingSpinnerText', `Trying to mount storage paths...`);
    this.set('showLoadingSpinner', true);
    return request({
      url: `/fusor/api/v21/deployments/${deploymentId}/check_mount_point`,
      type: 'GET',
      data: {
        path: path,
        address: address,
        type: type
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': Ember.$('meta[name="csrf-token"]').attr('content')
      }
    }).then(response => {
      if(!response.mounted) {
        throw 'There was an issue mounting the share... check the logs for errors';
      }
    });
  },


  deploymentId: Ember.computed.alias('deploymentController.model.id'),
  step3RouteName: Ember.computed.alias("deploymentController.step3RouteName"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),
  errorMsg: null,

  hasEndingSlashInSharePath: Ember.computed('deploymentController.model.rhev_share_path', function() {
    if (Ember.isPresent(this.get('deploymentController.model.rhev_share_path'))) {
      return (this.get('deploymentController.model.rhev_share_path').slice('-1') === '/');
    }
  }),

  hasEndingSlashInExportPath: Ember.computed('deploymentController.model.rhev_export_domain_path', function() {
    if (Ember.isPresent(this.get('deploymentController.model.rhev_export_domain_path'))) {
      return (this.get('deploymentController.model.rhev_export_domain_path').slice('-1') === '/');
    }
  }),

  hasNoLeadingSlashInSharePath: Ember.computed('deploymentController.model.rhev_share_path', function() {
    if (Ember.isPresent(this.get('deploymentController.model.rhev_share_path'))) {
      return (this.get('deploymentController.model.rhev_share_path').charAt(0) !== '/');
    }
  }),

  hasNoLeadingSlashInExportPath: Ember.computed('deploymentController.model.rhev_export_domain_path', function() {
    if (Ember.isPresent(this.get('deploymentController.model.rhev_export_domain_path'))) {
      return (this.get('deploymentController.model.rhev_export_domain_path').charAt(0) !== '/');
    }
  }),

  errorsHashSharePath: Ember.computed('hasEndingSlashInSharePath', 'deploymentController.model.rhev_share_path', function() {
    if (this.get('isNFS') && this.get('hasNoLeadingSlashInSharePath')) {
      return {"name": 'You must have a leading slash'};
    } else if (this.get('isGluster') && !this.get('hasNoLeadingSlashInSharePath')) {
      return {"name": 'You cannot have a leading slash'};
    } else if (this.get('hasEndingSlashInSharePath')) {
      return {"name": 'You cannot have a trailing slash'};
    } else {
      return {};
    }
  }),

  errorsHashExportPath: Ember.computed('hasEndingSlashInExportPath', 'deploymentController.model.rhev_export_domain_path', function() {
    if (this.get('isNFS') && this.get('hasNoLeadingSlashInExportPath')) {
      return {"name": 'You must have a leading slash'};
    } else if (this.get('isGluster') && !this.get('hasNoLeadingSlashInExportPath')) {
      return {"name": 'You cannot have a leading slash'};
    } else if (this.get('hasEndingSlashInExportPath')) {
      return {"name": 'You cannot have a trailing slash'};
    } else {
      return {};
    }
  }),

  isNFS: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    return (this.get('deploymentController.model.rhev_storage_type') === 'NFS');
  }),

  isLocal: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    return (this.get('deploymentController.model.rhev_storage_type') === 'Local');
  }),

  isGluster: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    return (this.get('deploymentController.model.rhev_storage_type') === 'glusterfs');
  }),

  isInvalidStorageFields: Ember.computed(
    'deploymentController.model.rhev_storage_type',
    'invalidStorageName',
    'invalidStorageAddress',
    'invalidSharePath',
    function() {
      return  Ember.isBlank(this.get('deploymentController.model.rhev_storage_type')) ||
              this.get('invalidStorageName') ||
              this.get('invalidStorageAddress') ||
              this.get('invalidSharePath');
    }
  ),

  isInvalidExportDomainFields: Ember.computed(
    'invalidExportDomainName',
    'invalidExportAddress',
    'invalidExportPath',
    function() {
      return this.get('invalidExportDomainName') ||
        this.get('invalidExportAddress') ||
        this.get('invalidExportPath');
    }
  ),

  computerNameValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      AlphaNumericDashUnderscoreValidator.create({})
    ]
  }),

  hostnameValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      HostnameValidator.create({})
    ]
  }),

  invalidStorageName: Ember.computed('deploymentController.model.rhev_storage_name', function() {
    return !this.get('computerNameValidator').isValid(this.get('deploymentController.model.rhev_storage_name'));
  }),

  invalidStorageAddress: Ember.computed('deploymentController.model.rhev_storage_address', function() {
    return !this.get('hostnameValidator').isValid(this.get('deploymentController.model.rhev_storage_address'));
  }),

  invalidSharePath: Ember.computed(
    'deploymentController.model.rhev_share_path',
    'hasEndingSlashInSharePath',
    'hasNoLeadingSlashInSharePath',
    'isNFS',
    'isGluster',
    function () {
      return Ember.isBlank(this.get('deploymentController.model.rhev_share_path')) ||
        this.get('hasEndingSlashInSharePath') ||
        (this.get('isNFS') && this.get('hasNoLeadingSlashInSharePath')) ||
        (this.get('isGluster') && !this.get('hasNoLeadingSlashInSharePath'));
    }),

  invalidExportDomainName: Ember.computed('deploymentController.model.rhev_export_domain_name', function() {
    return !this.get('computerNameValidator').isValid(this.get('deploymentController.model.rhev_export_domain_name'));
  }),

  invalidExportAddress: Ember.computed('deploymentController.model.rhev_export_domain_address', function() {
    return !this.get('hostnameValidator').isValid(this.get('deploymentController.model.rhev_export_domain_address'));
  }),

  invalidExportPath: Ember.computed(
    'deploymentController.model.rhev_export_domain_path',
    'hasEndingSlashInExportPath',
    'hasNoLeadingSlashInExportPath',
    'isNFS',
    'isGluster',
    function () {
      return Ember.isBlank(this.get('deploymentController.model.rhev_export_domain_path')) ||
        this.get('hasEndingSlashInExportPath') ||
        (this.get('isNFS') && this.get('hasNoLeadingSlashInExportPath')) ||
        (this.get('isGluster') && !this.get('hasNoLeadingSlashInExportPath'));
    }),


  disableNextStorage: Ember.computed(
    'isCloudForms',
    'isInvalidStorageFields',
    'isInvalidExportDomainFields',
    'invalidStorageName',
    'invalidStorageAddress',
    'invalidExportDomainName',
    'invalidExportAddress',
    function () {
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
    }
  ),

  validRhevStorage: Ember.computed.not('disableNextStorage')

});

