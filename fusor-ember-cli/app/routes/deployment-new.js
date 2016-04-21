import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {

  model() {
    return this.store.createRecord('deployment', {
      enable_access_insights: false,
      rhev_cluster_name: 'Default',
      rhev_storage_name: 'my_storage',
      rhev_export_domain_name: 'my_export',
      rhev_data_center_name: 'Default',
      rhev_storage_type: 'NFS',
      openstack_overcloud_ext_net_interface: 'nic2',
      openstack_overcloud_libvirt_type: 'kvm',
      openstack_overcloud_compute_flavor: 'baremetal',
      openstack_overcloud_compute_count: 0,
      openstack_overcloud_controller_flavor: 'baremetal',
      openstack_overcloud_controller_count: 0,
      openstack_overcloud_ceph_storage_flavor: 'baremetal',
      openstack_overcloud_ceph_storage_count: 0,
      openstack_overcloud_cinder_storage_flavor: 'baremetal',
      openstack_overcloud_cinder_storage_count: 0,
      openstack_overcloud_swift_storage_flavor: 'baremetal',
      openstack_overcloud_swift_storage_count: 0
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'deployment-new.satellite.index');
    controller.set('lifecycleEnvironmentTabRouteName', 'deployment-new.satellite.configure-environment');
    this.controllerFor('application').set('isNewDeployment', true);
  },

  // rollback if new deployment not saved
  // TODO modal confirm/cancel
  deactivate() {
    var deployment = this.modelFor('deployment-new');
    if (deployment.get('isNew')) {
      return deployment.rollbackAttributes();
    }
  },

  actions: {
    cancelAndRollbackNewDeployment() {
      this.get('controller.model').rollbackAttributes();
      return this.transitionTo('deployments');
    }
  }

});
