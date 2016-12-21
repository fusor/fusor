import Ember from 'ember';
import NeedsDeploymentMixin from '../mixins/needs-deployment-mixin';
import ValidatesMounts from '../mixins/validates-mounts';
import {
  AllValidator,
  PresenceValidator,
  EqualityValidator,
  UniquenessValidator,
  AlphaNumericDashUnderscoreValidator,
  HostnameValidator,
  NfsPathValidator,
  GlusterPathValidator
} from '../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, ValidatesMounts, {
  step3RouteName: Ember.computed.alias("deploymentController.step3RouteName"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  errorMsg: null,
  storageNotEmptyError: null,

  actions: {
    testMountPoint() {
      var deployment = this.get('deployment');
      deployment.trimFieldsForSave();
      this.set('errorMsg', null);
      this.set('storageNotEmptyError', null);
      const checkExport = this.get('isCloudForms');
      const checkHosted = this.get('rhevIsSelfHosted');

      const storageParams = {
        path: this.get('deployment.rhev_share_path'),
        address: this.get('deployment.rhev_storage_address'),
        type: this.get('deployment.rhev_storage_type'),
        unique_suffix: 'rhv'
      };

      const validationPromises = {
        storage: this.fetchMountValidation(this.get('deploymentId'), storageParams)
      };

      if(checkExport) {
        const exportParams = {
          path: this.get('deployment.rhev_export_domain_path'),
          address: this.get('deployment.rhev_export_domain_address'),
          type: this.get('deployment.rhev_storage_type'),
          unique_suffix: 'export'
        };

        validationPromises.export = this.fetchMountValidation(
          this.get('deploymentId'),
          exportParams
        );
      }

      if(checkHosted) {
        const hostedParams = {
          path: this.get('deployment.hosted_storage_path'),
          address: this.get('deployment.hosted_storage_address'),
          type: this.get('deployment.rhev_storage_type'),
          unique_suffix: 'selfhosted'
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
            failedDomainName = this.get('deployment.rhev_storage_name');
            break;
          case 'self-hosted':
            failedDomainName = this.get('deployment.hosted_storage_name');
            break;
          case 'export':
            failedDomainName = this.get('deployment.rhev_export_domain_name');
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

  isNFS: Ember.computed('deployment.rhev_storage_type', function() {
    return (this.get('deployment.rhev_storage_type') === 'NFS');
  }),

  isLocal: Ember.computed('deployment.rhev_storage_type', function() {
    return (this.get('deployment.rhev_storage_type') === 'Local');
  }),

  isGluster: Ember.computed('deployment.rhev_storage_type', function() {
    return (this.get('deployment.rhev_storage_type') === 'glusterfs');
  }),

  hostnameValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      HostnameValidator.create({})
    ]
  }),

  storageNames: Ember.computed(
    'deployment.deploy_rhev',
    'deployment.deploy_cfme',
    'deployment.rhev_is_self_hosted',
    'deployment.rhev_storage_name',
    'deployment.rhev_export_domain_name',
    'deployment.hosted_storage_name',
    function () {
      let storageNames = [];

      if (this.get('deployment.deploy_rhev') && Ember.isPresent('deployment.rhev_storage_name')) {
        storageNames.push(this.get('deployment.rhev_storage_name'));
      }

      if (this.get('deployment.deploy_cfme') && Ember.isPresent('deployment.rhev_export_domain_name')) {
        storageNames.push(this.get('deployment.rhev_export_domain_name'));
      }

      if (this.get('deployment.rhev_is_self_hosted') && Ember.isPresent('deployment.hosted_storage_name')) {
        storageNames.push(this.get('deployment.hosted_storage_name'));
      }

      return storageNames;
    }),

  storageNameValidator: Ember.computed('storageNames', function () {
    return AllValidator.create({
      validators: [
        PresenceValidator.create({}),
        AlphaNumericDashUnderscoreValidator.create({}),
        UniquenessValidator.create({selfIncluded: true, existingValues: this.get('storageNames')})
      ]
    });
  }),

  rhvPathValidator: Ember.computed(
    'deployment.rhev_storage_type',
    'deployment.rhev_storage_address',
    'deployment.deploy_cfme',
    'deployment.rhev_export_domain_address',
    'deployment.rhev_export_domain_path',
    'deployment.rhev_is_self_hosted',
    'deployment.hosted_storage_address',
    'deployment.hosted_storage_path',
    function () {
      let rhevStorageAddress = this.get('deployment.rhev_storage_address');
      let deployCfme = this.get('deployment.deploy_cfme');
      let rhevExportDomainAddress = this.get('deployment.rhev_export_domain_address');
      let rhevExportDomainPath = this.get('deployment.rhev_export_domain_path');
      let rhevIsSelfHosted = this.get('deployment.rhev_is_self_hosted');
      let hostedStorageAddress = this.get('deployment.hosted_storage_address');
      let hostedStoragePath = this.get('deployment.hosted_storage_path');

      let validators = [];

      validators.push(PresenceValidator.create({}));

      if (this.get('deployment.rhev_storage_type') === 'NFS') {
        validators.push(NfsPathValidator.create({}));
      } else {
        validators.push(GlusterPathValidator.create({}));
      }

      if (Ember.isPresent(rhevStorageAddress)) {
        rhevStorageAddress = rhevStorageAddress.trim();

        if (deployCfme && Ember.isPresent(rhevExportDomainAddress) && Ember.isPresent(rhevExportDomainPath)) {
          if (rhevStorageAddress === rhevExportDomainAddress.trim()) {
            validators.push(EqualityValidator.create({doesNotEqual: rhevExportDomainPath, message: 'This field must not equal RHV Export Domain Share Path'}));
          }
        }

        if (rhevIsSelfHosted && Ember.isPresent(hostedStorageAddress) && Ember.isPresent(hostedStoragePath)) {
          if (rhevStorageAddress === hostedStorageAddress) {
            validators.push(EqualityValidator.create({doesNotEqual: hostedStoragePath, message: 'This field must not equal RHV Self-Hosted Share Path'}));
          }
        }
      }

      return AllValidator.create({
        validators: validators
      });
    }),

  exportPathValidator: Ember.computed(
    'deployment.rhev_storage_type',
    'deployment.rhev_export_domain_address',
    'deployment.deploy_rhev',
    'deployment.rhev_storage_address',
    'deployment.rhev_share_path',
    'deployment.rhev_is_self_hosted',
    'deployment.hosted_storage_address',
    'deployment.hosted_storage_path',
    function () {
      let rhevExportDomainAddress = this.get('deployment.rhev_export_domain_address');
      let deployRhev = this.get('deployment.deploy_rhev');
      let rhevStorageAddress = this.get('deployment.rhev_storage_address');
      let rhevSharePath = this.get('deployment.rhev_share_path');
      let rhevIsSelfHosted = this.get('deployment.rhev_is_self_hosted');
      let hostedStorageAddress = this.get('deployment.hosted_storage_address');
      let hostedStoragePath = this.get('deployment.hosted_storage_path');
      let validators = [];

      validators.push(PresenceValidator.create({}));

      if (this.get('deployment.rhev_storage_type') === 'NFS') {
        validators.push(NfsPathValidator.create({}));
      } else {
        validators.push(GlusterPathValidator.create({}));
      }

      if (Ember.isPresent(rhevExportDomainAddress)) {
        rhevExportDomainAddress = rhevExportDomainAddress.trim();

        if (deployRhev && Ember.isPresent(rhevStorageAddress) && Ember.isPresent(rhevSharePath)) {
          if (rhevExportDomainAddress === rhevStorageAddress.trim()) {
            validators.push(EqualityValidator.create({doesNotEqual: rhevSharePath, message: 'This field must not equal RHV Data Domain Share Path'}));
          }
        }

        if (rhevIsSelfHosted && Ember.isPresent(hostedStorageAddress) && Ember.isPresent(hostedStoragePath)) {
          if (rhevExportDomainAddress === hostedStorageAddress) {
            validators.push(EqualityValidator.create({doesNotEqual: hostedStoragePath, message: 'This field must not equal RHV Self-Hosted Share Path'}));
          }
        }
      }

      return AllValidator.create({
        validators: validators
      });
    }),

  hostedPathValidator: Ember.computed(
    'deployment.rhev_storage_type',
    'deployment.hosted_storage_address',
    'deployment.deploy_rhev',
    'deployment.rhev_storage_address',
    'deployment.rhev_share_path',
    'deployment.deploy_cfme',
    'deployment.rhev_export_domain_address',
    'deployment.rhev_export_domain_path',
    function () {
      let hostedStorageAddress = this.get('deployment.hosted_storage_address');
      let deployRhev = this.get('deployment.deploy_rhev');
      let rhevStorageAddress = this.get('deployment.rhev_storage_address');
      let rhevSharePath = this.get('deployment.rhev_share_path');
      let deployCfme = this.get('deployment.deploy_cfme');
      let rhevExportDomainAddress = this.get('deployment.rhev_export_domain_address');
      let rhevExportDomainPath = this.get('deployment.rhev_export_domain_path');

      let validators = [];

      validators.push(PresenceValidator.create({}));

      if (this.get('deployment.rhev_storage_type') === 'NFS') {
        validators.push(NfsPathValidator.create({}));
      } else {
        validators.push(GlusterPathValidator.create({}));
      }

      if (Ember.isPresent(hostedStorageAddress)) {
        hostedStorageAddress = hostedStorageAddress.trim();

        if (deployRhev && Ember.isPresent(rhevStorageAddress) && Ember.isPresent(rhevSharePath)) {
          if (hostedStorageAddress === rhevStorageAddress.trim()) {
            validators.push(EqualityValidator.create({doesNotEqual: rhevSharePath, message: 'This field must not equal RHV Data Domain Share Path'}));
          }
        }

        if (deployCfme && Ember.isPresent(rhevExportDomainAddress) && Ember.isPresent(rhevExportDomainPath)) {
          if (hostedStorageAddress === rhevExportDomainAddress) {
            validators.push(EqualityValidator.create({doesNotEqual: rhevExportDomainPath, message: 'This field must not equal RHV Export Domain Share Path'}));
          }
        }
      }

      return AllValidator.create({
        validators: validators
      });
    }),

  invalidStorageName: Ember.computed('storageNameValidator', 'deployment.rhev_storage_name', function() {
    return this.get('storageNameValidator').isInvalid(this.get('deployment.rhev_storage_name'));
  }),

  invalidStorageAddress: Ember.computed('deployment.rhev_storage_address', function() {
    return this.get('hostnameValidator').isInvalid(this.get('deployment.rhev_storage_address'));
  }),

  invalidSharePath: Ember.computed('deployment.rhev_share_path', 'rhvPathValidator', function () {
    return this.get('rhvPathValidator').isInvalid(this.get('deployment.rhev_share_path'));
  }),

  invalidExportDomainName: Ember.computed('storageNameValidator', 'deployment.rhev_export_domain_name', function() {
    return this.get('storageNameValidator').isInvalid(this.get('deployment.rhev_export_domain_name'));
  }),

  invalidExportAddress: Ember.computed('deployment.rhev_export_domain_address', function() {
    return this.get('hostnameValidator').isInvalid(this.get('deployment.rhev_export_domain_address'));
  }),

  invalidExportPath: Ember.computed('deployment.rhev_export_domain_path', 'exportPathValidator', function () {
    return this.get('exportPathValidator').isInvalid(this.get('deployment.rhev_export_domain_path'));
  }),

  invalidHostedName: Ember.computed('storageNameValidator', 'deployment.hosted_storage_name', function() {
    return this.get('storageNameValidator').isInvalid(this.get('deployment.hosted_storage_name'));
  }),

  invalidHostedAddress: Ember.computed('deployment.hosted_storage_address', function() {
    return this.get('hostnameValidator').isInvalid(this.get('deployment.hosted_storage_address'));
  }),

  invalidHostedPath: Ember.computed('deployment.hosted_storage_path', 'hostedPathValidator', function () {
    return this.get('hostedPathValidator').isInvalid(this.get('deployment.hosted_storage_path'));
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
