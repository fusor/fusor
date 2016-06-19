import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";
import OpenshiftMixin from "../mixins/openshift-mixin";

import {
  AllValidator,
  PresenceValidator,
  IpAddressValidator,
  NfsPathValidator,
  AlphaNumericDashUnderscoreValidator,
  HostnameValidator,
  validateZipper
} from '../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, OpenshiftMixin, {

  stepNumberOpenShift: Ember.computed.alias("deploymentController.stepNumberOpenShift"),

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
    'isUnderCapacity',
    function() {
      return (Ember.isPresent(this.get('openshiftInstallLoc')) &&
              isPositiveInteger(this.get('numMasterNodes')) &&
              isPositiveInteger(this.get('numWorkerNodes')) &&
              isPositiveInteger(this.get('storageSize')) &&
              isPositiveInteger(this.get('masterVcpu')) &&
              isPositiveInteger(this.get('masterRam')) &&
              isPositiveInteger(this.get('masterDisk')) &&
              isPositiveInteger(this.get('workerVcpu')) &&
              isPositiveInteger(this.get('workerRam')) &&
              isPositiveInteger(this.get('workerDisk')) &&
              this.get('isUnderCapacity'));
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
      IpAddressValidator.create({})
    ]
  }),

  exportPathValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      NfsPathValidator.create({})
    ]
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
    'model.openshift_storage_host',
    'model.openshift_export_path',
    'model.openshift_username',
    'model.openshift_subdomain_name',
    function() {
      return validateZipper([
        [this.get('storageHostValidator'), this.get('model.openshift_storage_host')],
        [this.get('exportPathValidator'), this.get('model.openshift_export_path')],
        [this.get('usernameValidator'), this.get('model.openshift_username')],
        [this.get('subdomainValidator'), this.get('model.openshift_subdomain_name')]
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
