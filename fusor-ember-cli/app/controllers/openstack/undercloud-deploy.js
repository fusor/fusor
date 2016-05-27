import Ember from 'ember';
import NeedsDeploymentMixin from '../../mixins/needs-deployment-mixin';

const UndercloudDeployController = Ember.Controller.extend(NeedsDeploymentMixin, {

  deployment: Ember.computed.alias('deploymentController.model'),
  deploymentId: Ember.computed.alias('deployment.id'),
  openstackDeployment: Ember.computed.alias('model'),

  isRhev: Ember.computed.alias('deploymentController.isRhev'),
  fullnameOpenStack: Ember.computed.alias('deploymentController.fullnameOpenStack'),

  undercloudIPHelp: Ember.computed('fullnameOpenStack', function() {
    return `The IP address that the already-installed ${this.get('fullnameOpenStack')} undercloud is running on.`;
  }),

  undercloudIpValidator: Ember.computed.alias('openstackDeployment.validations.undercloud_ip_address'),

  stackDeleteFailed: Ember.computed('stack.stack_status', function() {
    return this.get('stack.stack_status') === 'DELETE_FAILED';
  }),

  isConnected: Ember.computed('isStarted', 'openstackDeployment.isUndercloudConnected', function() {
    return !this.get('isStarted') && this.get('openstackDeployment.isUndercloudConnected');
  }),

  deployDisabled: Ember.computed(
    'isStarted',
    'openstackDeployment.undercloud_ip_address',
    'openstackDeployment.undercloud_ssh_username',
    'openstackDeployment.undercloud_ssh_password',
    'openstackDeployment.isUndercloudConnected',
    function () {
      return this.get('isStarted') ||
        this.get('openstackDeployment.isUndercloudConnected') ||
        !this.get('openstackDeployment').validateField('undercloud_ip_address') ||
        !this.get('openstackDeployment').validateField('undercloud_ssh_username') ||
        !this.get('openstackDeployment').validateField('undercloud_ssh_password');
    }),

  disableDeployUndercloudNext: Ember.computed.not('openstackDeployment.isUndercloudReady'),

  backRouteNameUndercloud: Ember.computed('isRhev', function() {
    if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'satellite.access-insights';
    }
  }),

  actions: {
    resetCredentials() {
      this.set('undercloudIP', null);
      this.set('sshUser', null);
      this.set('sshPassword', null);
      this.set('openstackDeployment.undercloud_admin_password', null);
      this.set('openstackDeployment.undercloud_ip_address', null);
      this.set('openstackDeployment.undercloud_ssh_username', null);
      this.set('openstackDeployment.undercloud_ssh_password', null);
      this.send('saveOpenstackDeployment', null);
    }
  }
});

export default UndercloudDeployController;
