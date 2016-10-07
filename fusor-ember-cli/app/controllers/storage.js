import Ember from 'ember';
import NeedsDeploymentMixin from '../mixins/needs-deployment-mixin';
import ValidatesMounts from '../mixins/validates-mounts';
import {
  AllValidator,
  PresenceValidator,
  AlphaNumericDashUnderscoreValidator,
  HostnameValidator,
  NfsPathValidator,
  GlusterPathValidator
} from '../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, ValidatesMounts, {
  actions: {
    testMountPoint() {
      var deployment = this.get('model');
      deployment.trimFieldsForSave();
      this.set('errorMsg', null);
      this.set('storageNotEmptyError', null);
      const checkExport = this.get('isCloudForms');
      const checkHosted = this.get('rhevIsSelfHosted');

      const storageParams = {
        path: this.get('model.rhev_share_path'),
        address: this.get('model.rhev_storage_address'),
        type: this.get('model.rhev_storage_type')
      };

      const validationPromises = {
        storage: this.fetchMountValidation(this.get('deploymentId'), storageParams)
      };

      if(checkExport) {
        const exportParams = {
          path: this.get('model.rhev_export_domain_path'),
          address: this.get('model.rhev_export_domain_address'),
          type: this.get('model.rhev_storage_type')
        };

        validationPromises.export = this.fetchMountValidation(
          this.get('deploymentId'),
          exportParams
        );
      }

      if(checkHosted) {
        const hostedParams = {
          path: this.get('model.hosted_storage_path'),
          address: this.get('model.hosted_storage_address'),
          type: this.get('model.rhev_storage_type')
        };

        validationPromises.hosted = this.fetchMountValidation(
          this.get('deploymentId'),
          hostedParams
        );
      }

      this.set('loadingSpinnerText', `Trying to mount storage paths...`);
      this.set('showLoadingSpinner', true);

      Ember.RSVP.hash(validationPromises).then((resultHash) => {
        this.set('showLoadingSpinner', false);
        let validMounts = resultHash.storage.mounted;
        let isStorageEmpty = resultHash.storage.is_empty;

        if(checkExport) {
          validMounts = validMounts && resultHash.export.mounted;
          isStorageEmpty = isStorageEmpty && resultHash.export.is_empty;
        }
        if(checkHosted) {
          validMounts = validMounts && resultHash.hosted.mounted;
          isStorageEmpty = isStorageEmpty && resultHash.hosted.is_empty;
        }

        const handleMountError = (checkProp, errorProp, errorMsg) => {
          let failedDomain;
          if(!resultHash.storage[checkProp]) {
            failedDomain = 'storage';
          } else if(checkHosted && !resultHash.hosted[checkProp]) {
            failedDomain = 'self-hosted';
          } else if(checkExport && !resultHash.export[checkProp]) {
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

          this.set(errorProp, errorMsg({failedDomain, failedDomainName}));
        };

        if(validMounts && isStorageEmpty) {
          this.set('errorMsg', null);
          this.set('storageNotEmptyError', null);
          this.transitionToRoute(this.get('step3RouteName'));
        } else if(!validMounts){
          const errorMsg = err => {
            return `Error mounting ${err.failedDomain} domain ${err.failedDomainName}, ` +
              'please make sure it is a valid mount point';
          };
          handleMountError('mounted', 'errorMsg', errorMsg);
        } else {
          const errorMsg = err => {
            return `Storage domain ${err.failedDomainName} is not empty. ` +
              `This could cause deployment problems.`;
          };
          handleMountError('is_empty', 'storageNotEmptyError', errorMsg);
        }
      }).catch(err => {
        console.error(err);
        this.set(
          'errorMsg',
          'Error occurred while attempting to validate storage paths');
      });
    }
  },

  deploymentId: Ember.computed.alias('deploymentController.model.id'),
  step3RouteName: Ember.computed.alias("deploymentController.step3RouteName"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  errorMsg: null,
  storageNotEmptyError: null,

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

