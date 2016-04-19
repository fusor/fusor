import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('model', model);
    this.loadOpenStack();
  },

  deactivate() {
    this.updateDeployment();
    this.send('saveDeployment', null);
  },

  loadOpenStack() {
    let controller = this.get('controller');
    let deployment = this.get('controller.deployment');

    controller.set('showSpinner', true);
    controller.set('errorMsg', null);

    if (deployment.get('deploy_openstack') && !Ember.isBlank(deployment.get('openstack_undercloud_password'))) {
      controller.set('isOspLoading', true);
      Ember.RSVP.hash({
        plan: this.store.findRecord('deployment-plan', deployment.get('id')),
        nodes: this.store.query('node', {deployment_id: deployment.get('id')}),
        profiles: this.store.query('flavor', {deployment_id: deployment.get('id')})
      }).then(
        hash => {
          controller.set('plan', hash.plan);
          controller.set('nodes', hash.nodes);
          controller.set('profiles', hash.profiles);
          this.updateDeployment();
          controller.set('showSpinner', false);
        },
        error => {
          controller.set('showSpinner', false);
          controller.set('errorMsg', 'Error retrieving OpenStack data: ' + this.formatError(error));
          console.log('Error retrieving OpenStack data: ', error);
        });
    }
  },

  updateDeployment() {
    this.set('controller.deployment.openstack_overcloud_compute_flavor', this.get('controller.plan.computeRoleFlavor'));
    this.set('controller.deployment.openstack_overcloud_compute_count', this.get('controller.plan.computeRoleCount'));
    this.set('controller.deployment.openstack_overcloud_controller_flavor', this.get('controller.plan.controllerRoleFlavor'));
    this.set('controller.deployment.openstack_overcloud_controller_count', this.get('controller.plan.controllerRoleCount'));
    this.set('controller.deployment.openstack_overcloud_ceph_storage_flavor', this.get('controller.plan.cephStorageRoleFlavor'));
    this.set('controller.deployment.openstack_overcloud_ceph_storage_count', this.get('controller.plan.cephStorageRoleCount'));
    this.set('controller.deployment.openstack_overcloud_cinder_storage_flavor', this.get('controller.plan.cinderStorageRoleFlavor'));
    this.set('controller.deployment.openstack_overcloud_cinder_storage_count', this.get('controller.plan.cinderStorageRoleCount'));
    this.set('controller.deployment.openstack_overcloud_swift_storage_flavor', this.get('controller.plan.swiftStorageRoleFlavor'));
    this.set('controller.deployment.openstack_overcloud_swift_storage_count', this.get('controller.plan.swiftStorageRoleCount'));
  },

  formatError(error) {
    let errorMessage = '';
    if (Ember.typeOf(error) === 'error') {
        errorMessage = error.message + ': ';
        if (error.errors) {
          error.errors.forEach(subError => errorMessage += ' ' + subError);
        }
    }

    return errorMessage;
  }

});
