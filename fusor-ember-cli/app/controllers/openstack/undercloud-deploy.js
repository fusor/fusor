import Ember from 'ember';
import NeedsDeploymentMixin from '../../mixins/needs-deployment-mixin';

const UndercloudDeployController = Ember.Controller.extend(NeedsDeploymentMixin, {

  deploymentId: Ember.computed.alias('deploymentController.model.id'),
  openstackDeployment: Ember.computed.alias('model'),

  // these 3 attributes are not persisted by UI.
  // backend controller will persist these
  undercloudIP: null,
  sshUser: null,
  sshPassword: null,

  isRhev: Ember.computed.alias('deploymentController.isRhev'),
  fullnameOpenStack: Ember.computed.alias('deploymentController.fullnameOpenStack'),

  undercloudIPHelp: Ember.computed('fullnameOpenStack', function() {
    return `The IP address that the already-installed ${this.get('fullnameOpenStack')} undercloud is running on.`;
  }),

  //reusing the same validator from openstackDeployment object to make sure we're using the same validations
  undercloudIpValidator: Ember.computed.alias('openstackDeployment.validations.undercloud_ip_address'),

  stackDeleteFailed: Ember.computed('stack.stack_status', function() {
    return this.get('stack.stack_status') === 'DELETE_FAILED';
  }),

  deployDisabled: Ember.computed('openstackDeployment.isUndercloudConnected', 'undercloudIP', 'sshUser', 'sshPassword', function () {
    return this.get('openstackDeployment.isUndercloudConnected') ||
      this.get('undercloudIpValidator').isInvalid(this.get('undercloudIP')) ||
      Ember.isBlank(this.get('sshUser')) ||
      Ember.isBlank(this.get('sshPassword'));
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
      this.get('openstackDeployment').save();
    }
  }
});

export default UndercloudDeployController;
