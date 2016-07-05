import Ember from 'ember';

export default Ember.Route.extend({

  deactivate() {
    if (!this.get('controller.model.external_ceph_storage')) {
      this.clearCephParams();
    }
    return this.send('saveOpenstackDeployment', null);
  },

  clearCephParams() {
    let openstackDeployment = this.get('controller.model');
    openstackDeployment.set('ceph_ext_mon_host', '');
    openstackDeployment.set('ceph_cluster_fsid', '');
    openstackDeployment.set('ceph_client_username', '');
    openstackDeployment.set('ceph_client_key', '');
    openstackDeployment.set('nova_rbd_pool_name', 'vms');
    openstackDeployment.set('cinder_rbd_pool_name', 'volumes');
    openstackDeployment.set('glance_rbd_pool_name', 'images');
  }
});
