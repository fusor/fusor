import Ember from 'ember';
import OpenshiftMixin from "../mixins/openshift-mixin";

import {
  AllValidator,
  PresenceValidator,
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

  exportPathValidator: Ember.computed('deploymentController.model.openshift_storage_type', function() {
    if (this.get('deploymentController.model.openshift_storage_type') === 'NFS') {
      return this.get('nfsPathValidator');
    }

    return this.get('glusterPathValidator');
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
