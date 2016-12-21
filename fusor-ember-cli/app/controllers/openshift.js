import Ember from 'ember';
import OpenshiftMixin from "../mixins/openshift-mixin";

import {
  AllValidator,
  PresenceValidator,
  EqualityValidator,
  NfsPathValidator,
  GlusterPathValidator,
  AlphaNumericDashUnderscoreValidator,
  HostnameValidator,
  HostAddressValidator,
  validateZipper
} from '../utils/validators';

export default Ember.Controller.extend(OpenshiftMixin, {
  stepNumberOpenShift: Ember.computed.alias('deploymentController.stepNumberOpenShift'),

  isVcpuOverCapacity: Ember.computed('vcpuNeeded', 'vcpuAvailable', function() {
    return (this.get('vcpuNeeded') > this.get('vcpuAvailable'));
  }),

  isRamOverCapacity: Ember.computed('ramNeeded', 'ramAvailable', function() {
    return (this.get('ramNeeded') > this.get('ramAvailable'));
  }),

  isDiskOverCapacity: Ember.computed('diskNeeded', 'diskAvailable', function() {
    return (this.get('diskNeeded') > this.get('diskAvailable'));
  }),

  isOverCapacity: Ember.computed(
    'isVcpuOverCapacity',
    'isRamOverCapacity',
    'isDiskOverCapacity',
    function() {
      return this.get('isVcpuOverCapacity') ||
        this.get('isRamOverCapacity') ||
        this.get('isDiskOverCapacity');
    }
  ),
  isUnderCapacity: Ember.computed.not("isOverCapacity"),

  isValidOpenshiftNodes: Ember.computed(
    'openshiftInstallLoc',
    'numMasterNodes',
    'numWorkerNodes',
    'storageSize',
    'masterVcpu',
    'masterRam',
    'masterDisk',
    'workerVcpu',
    'workerRam',
    'workerDisk',
    function() {
      return Ember.isPresent(this.get('openshiftInstallLoc')) &&
             isPositiveInteger(this.get('numMasterNodes')) &&
             isPositiveInteger(this.get('numWorkerNodes')) &&
             isPositiveInteger(this.get('storageSize')) &&
             isPositiveInteger(this.get('masterVcpu')) &&
             isPositiveInteger(this.get('masterRam')) &&
             isPositiveInteger(this.get('masterDisk')) &&
             isPositiveInteger(this.get('workerVcpu')) &&
             isPositiveInteger(this.get('workerRam')) &&
             isPositiveInteger(this.get('workerDisk'));
    }
  ),
  isInvalidOpenshiftNodes: Ember.computed.not("isValidOpenshiftNodes"),

  ////////////////////////////////////////////////////////////
  // OpenShift Configuration
  ////////////////////////////////////////////////////////////
  usernameValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      AlphaNumericDashUnderscoreValidator.create({})
    ]
  }),

  storageNameValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      AlphaNumericDashUnderscoreValidator.create({})
    ]
  }),

  storageHostValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      HostAddressValidator.create({})
    ]
  }),

  exportPathValidator: Ember.computed(
    'model.openshift_storage_type',
    'model.openshift_storage_host',
    'model.rhev_storage_type',
    'model.deploy_rhev',
    'model.rhev_storage_address',
    'model.rhev_share_path',
    'model.deploy_cfme',
    'model.rhev_export_domain_address',
    'model.rhev_export_domain_path',
    'model.rhev_is_self_hosted',
    'model.hosted_storage_address',
    'model.hosted_storage_path',
    function () {
      let openshiftStorageType = this.get('model.openshift_storage_type');
      let openshiftStorageHost = this.get('model.openshift_storage_host');
      let rhevStorageType = this.get('model.rhev_storage_type');
      let deployRhev = this.get('model.deploy_rhev');
      let rhevStorageAddress = this.get('model.rhev_storage_address');
      let rhevSharePath = this.get('model.rhev_share_path');
      let deployCfme = this.get('model.deploy_cfme');
      let rhevExportDomainAddress = this.get('model.rhev_export_domain_address');
      let rhevExportDomainPath = this.get('model.rhev_export_domain_path');
      let rhevIsSelfHosted = this.get('model.rhev_is_self_hosted');
      let hostedStorageAddress = this.get('model.hosted_storage_address');
      let hostedStoragePath = this.get('model.hosted_storage_path');

      let validators = [];

      validators.push(PresenceValidator.create({}));

      if (openshiftStorageType === 'NFS') {
        validators.push(NfsPathValidator.create({}));
      } else {
        validators.push(GlusterPathValidator.create({}));
      }

      if (openshiftStorageType === rhevStorageType && Ember.isPresent(openshiftStorageHost)) {
        openshiftStorageHost = openshiftStorageHost.trim();

        if (deployRhev && Ember.isPresent(rhevStorageAddress) && Ember.isPresent(rhevSharePath)) {
          if (openshiftStorageHost === rhevStorageAddress.trim()) {
            validators.push(EqualityValidator.create({doesNotEqual: rhevSharePath, message: 'This field must not equal RHV Share Path'}));
          }
        }

        if (deployCfme && Ember.isPresent(rhevExportDomainAddress) && Ember.isPresent(rhevExportDomainPath)) {
          if (openshiftStorageHost === rhevExportDomainAddress.trim()) {
            validators.push(EqualityValidator.create({doesNotEqual: rhevExportDomainPath, message: 'This field must not equal RHV Export Domain Share Path'}));
          }
        }

        if (rhevIsSelfHosted && Ember.isPresent(hostedStorageAddress) && Ember.isPresent(hostedStoragePath)) {
          if (openshiftStorageHost === hostedStorageAddress) {
            validators.push(EqualityValidator.create({doesNotEqual: hostedStoragePath, message: 'This field must not equal RHV Self-Hosted Share Path'}));
          }
        }
      }

      return AllValidator.create({
        validators: validators
      });
    }),

  subdomainValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      HostnameValidator.create({})
    ]
  }),

  isValidOpenshiftConfiguration: Ember.computed(
    'storageNameValidator',
    'storageHostValidator',
    'exportPathValidator',
    'usernameValidator',
    'subdomainValidator',
    'deployment.openshift_storage_host',
    'deployment.openshift_export_path',
    'deployment.openshift_username',
    'deployment.openshift_subdomain_name',
    function() {
      return validateZipper([
        [this.get('storageHostValidator'), this.get('deployment.openshift_storage_host')],
        [this.get('exportPathValidator'), this.get('deployment.openshift_export_path')],
        [this.get('usernameValidator'), this.get('deployment.openshift_username')],
        [this.get('subdomainValidator'), this.get('deployment.openshift_subdomain_name')]
      ]);
    }
  ),

  isInvalidOpenshiftConfiguration: Ember.computed.not('isValidOpenshiftConfiguration'),
  validOpenshift: Ember.computed('isValidOpenshiftNodes', 'isValidOpenshiftConfiguration', function() {
    return this.get('isValidOpenshiftNodes') && this.get('isValidOpenshiftConfiguration');
  })
});

function isPositiveInteger(value) {
  //http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
  return value > 0 && !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}
