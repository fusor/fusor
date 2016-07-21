import Ember from 'ember';
import request from 'ic-ajax';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";
import {
  AllValidator,
  PresenceValidator,
  AlphaNumericDashUnderscoreValidator,
  HostnameValidator,
  NfsPathValidator,
  GlusterPathValidator
} from '../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, {
  actions: {
    testMountPoint() {
      var deployment = this.get('model');
      deployment.trimFieldsForSave();
      this.set('errorMsg', null);
      const checkExport = this.get('isCloudForms');
      const checkHosted = this.get('rhevIsSelfHosted');

      const storageParams = {
        path: this.get('model.rhev_share_path'),
        address: this.get('model.rhev_storage_address'),
        type: this.get('model.rhev_storage_type')
      };

      const validationPromises = {
        storage: this.storageMountRequest(storageParams)
      };

      if(checkExport) {
        const exportParams = {
          path: this.get('model.rhev_export_domain_path'),
          address: this.get('model.rhev_export_domain_address'),
          type: this.get('model.rhev_storage_type')
        };

        validationPromises.export = this.storageMountRequest(exportParams);
      }

      if(checkHosted) {
        const hostedParams = {
          path: this.get('model.hosted_storage_path'),
          address: this.get('model.hosted_storage_address'),
          type: this.get('model.rhev_storage_type')
        };

        validationPromises.hosted = this.storageMountRequest(hostedParams);
      }

      this.set('loadingSpinnerText', `Trying to mount storage paths...`);
      this.set('showLoadingSpinner', true);

      Ember.RSVP.hash(validationPromises).then((resultHash) => {
        this.set('showLoadingSpinner', false);
        let validMounts = resultHash.storage.mounted;

        if(checkExport) {
          validMounts = validMounts && resultHash.export.mounted;
        }
        if(checkHosted) {
          validMounts = validMounts && resultHash.hosted.mounted;
        }

        if(validMounts) {
          this.set('errorMsg', null);
          this.transitionTo(this.get('step3RouteName'));
        } else {
          let failedDomain;
          if(!resultHash.storage.mounted) {
            failedDomain = 'storage';
          } else if(checkHosted && !resultHash.hosted.mounted) {
            failedDomain = 'self-hosted';
          } else if(checkExport && !resultHash.export.mounted) {
            failedDomain = 'export';
          }

          if(!failedDomain) {
            // Catch handler manages this
            throw 'Could not detect failed domain...';
          }

          let failedDomainName;
          switch(failedDomain) {
          case 'storage':
            failedDomainName = this.get('deploymentController.model.rhev_storage_name');
            break;
          case 'self-hosted':
            failedDomainName = this.get('deploymentController.model.hosted_storage_name');
            break;
          case 'export':
            failedDomainName = this.get('deploymentController.model.rhev_export_domain_name');
            break;
          default:
            failedDomainName = '';
          }

          const errorMsg =
            `Error mounting ${failedDomain} domain ${failedDomainName}, ` +
            'please make sure it is a valid mount point';

          this.set('errorMsg', errorMsg);
        }
      }).catch(err => {
        console.error(err);
        this.set(
          'errorMsg',
          'Error occurred while attempting to validate storage paths');
      });
    }
  },

  storageMountRequest(params) {
    const deploymentId = this.get('deploymentId');
    return request({
      url: `/fusor/api/v21/deployments/${deploymentId}/check_mount_point`,
      type: 'GET',
      data: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': Ember.$('meta[name="csrf-token"]').attr('content')
      }
    });
  },

  deploymentId: Ember.computed.alias('deploymentController.model.id'),
  step3RouteName: Ember.computed.alias("deploymentController.step3RouteName"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),
  errorMsg: null,

  isNFS: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    return (this.get('deploymentController.model.rhev_storage_type') === 'NFS');
  }),

  isLocal: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    return (this.get('deploymentController.model.rhev_storage_type') === 'Local');
  }),

  isGluster: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    return (this.get('deploymentController.model.rhev_storage_type') === 'glusterfs');
  }),

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

  nfsPathValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      NfsPathValidator.create({})
    ]
  }),

  glusterPathValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      GlusterPathValidator.create({})
    ]
  }),

  sharePathValidator: Ember.computed('deploymentController.model.rhev_storage_type', function() {
    if (this.get('deploymentController.model.rhev_storage_type') === 'NFS') {
      return this.get('nfsPathValidator');
    }

    return this.get('glusterPathValidator');
  }),

  invalidStorageName: Ember.computed('deploymentController.model.rhev_storage_name', function() {
    return this.get('computerNameValidator').isInvalid(this.get('deploymentController.model.rhev_storage_name'));
  }),

  invalidStorageAddress: Ember.computed('deploymentController.model.rhev_storage_address', function() {
    return this.get('hostnameValidator').isInvalid(this.get('deploymentController.model.rhev_storage_address'));
  }),

  invalidSharePath: Ember.computed('deploymentController.model.rhev_share_path', 'sharePathValidator', function () {
    return this.get('sharePathValidator').isInvalid(this.get('deploymentController.model.rhev_share_path'));
  }),

  invalidExportDomainName: Ember.computed('deploymentController.model.rhev_export_domain_name', function() {
    return this.get('computerNameValidator').isInvalid(this.get('deploymentController.model.rhev_export_domain_name'));
  }),

  invalidExportAddress: Ember.computed('deploymentController.model.rhev_export_domain_address', function() {
    return this.get('hostnameValidator').isInvalid(this.get('deploymentController.model.rhev_export_domain_address'));
  }),

  invalidExportPath: Ember.computed('deploymentController.model.rhev_export_domain_path', 'sharePathValidator', function () {
    return this.get('sharePathValidator').isInvalid(this.get('deploymentController.model.rhev_export_domain_path'));
  }),

  invalidHostedName: Ember.computed('deploymentController.model.hosted_storage_name', function() {
    return this.get('computerNameValidator').isInvalid(this.get('deploymentController.model.hosted_storage_name'));
  }),

  invalidHostedAddress: Ember.computed('deploymentController.model.hosted_storage_address', function() {
    return this.get('hostnameValidator').isInvalid(this.get('deploymentController.model.hosted_storage_address'));
  }),

  invalidHostedPath: Ember.computed('deploymentController.model.hosted_storage_path', 'sharePathValidator', function () {
    return this.get('sharePathValidator').isInvalid(this.get('deploymentController.model.hosted_storage_path'));
  }),

  disableNextStorage: Ember.computed(
    'isCloudForms',
    'rhevIsSelfHosted',
    'invalidStorageName',
    'invalidStorageAddress',
    'invalidSharePath',
    'invalidExportDomainName',
    'invalidExportAddress',
    'invalidExportPath',
    'invalidHostedName',
    'invalidHostedAddress',
    'invalidHostedPath',
    function () {
      return ((this.get('invalidStorageName') ||
               this.get('invalidStorageAddress') ||
               this.get('invalidSharePath')) ||
               (this.get('isCloudForms') &&
                 (this.get('invalidExportDomainName') ||
                  this.get('invalidExportAddress') ||
                  this.get('invalidExportPath'))) ||
               (this.get('rhevIsSelfHosted') &&
                 (this.get('invalidHostedName') ||
                  this.get('invalidHostedAddress') ||
                  this.get('invalidHostedPath'))));
    }
  ),

  validRhevStorage: Ember.computed.not('disableNextStorage')

});

