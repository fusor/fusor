import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";
import OpenshiftMixin from "../mixins/openshift-mixin";
import { AggregateValidator, PresenceValidator, AlphaNumericDashUnderscoreValidator } from '../utils/validators';

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

  isOverCapacity: Ember.computed('isVcpuOverCapacity',
                                 'isRamOverCapacity',
                                 'isDiskOverCapacity', function() {
      return (this.get('isVcpuOverCapacity') ||
              this.get('isRamOverCapacity') ||
              this.get('isDiskOverCapacity'));
  }),
  isUnderCapacity: Ember.computed.not("isOverCapacity"),

  isValidOpenshiftNodes: Ember.computed('openshiftInstallLoc',
                                        'numMasterNodes',
                                        'numWorkerNodes',
                                        'storageSize',
                                        'masterVcpu',
                                        'masterRam',
                                        'masterDisk',
                                        'nodeVcpu',
                                        'nodeRam',
                                        'nodeDisk',
                                        'isUnderCapacity', function() {
      return (Ember.isPresent(this.get('openshiftInstallLoc')) &&
              (this.get('numMasterNodes') > 0) &&
              (this.get('numWorkerNodes') > 0) &&
              (this.get('storageSize') > 0) &&
              (this.get('masterVcpu') > 0) &&
              (this.get('masterRam') > 0) &&
              (this.get('masterDisk') > 0) &&
              (this.get('nodeVcpu') > 0) &&
              (this.get('nodeRam') > 0) &&
              (this.get('nodeDisk') > 0) &&
              this.get('isUnderCapacity'));
  }),
  isInvalidOpenshiftNodes: Ember.computed.not("isValidOpenshiftNodes"),

  openshiftUsernameValidator: AggregateValidator.create({
    validators: [
      PresenceValidator.create({}),
      AlphaNumericDashUnderscoreValidator.create({})
    ]
  }),

  isValidOpenshiftConfiguration: Ember.computed('model.openshift_username', function() {
    return this.get('openshiftUsernameValidator').isValid(this.get('model.openshift_username'));
  }),
  isInvalidOpenshiftConfiguration: Ember.computed.not("isValidOpenshiftConfiguration"),

  validOpenshift: Ember.computed('isValidOpenshiftNodes', 'isValidOpenshiftConfiguration', function() {
      return this.get('isValidOpenshiftNodes') && this.get('isValidOpenshiftConfiguration');
  })

});
