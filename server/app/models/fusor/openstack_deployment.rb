#
# Copyright 2015 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Fusor
  class OpenstackDeployment < ActiveRecord::Base
    OVERCLOUD_ATTR_PARAM_HASH = {
        overcloud_ext_net_interface: 'NeutronPublicInterface',
        overcloud_libvirt_type: 'NovaComputeLibvirtType',
        overcloud_password: 'AdminPassword',
        overcloud_compute_flavor: 'OvercloudComputeFlavor',
        overcloud_compute_count: 'ComputeCount',
        overcloud_controller_flavor: 'OvercloudControlFlavor',
        overcloud_controller_count: 'ControllerCount',
        overcloud_ceph_storage_flavor: 'OvercloudCephStorageFlavor',
        overcloud_ceph_storage_count: 'CephStorageCount',
        overcloud_block_storage_flavor: 'OvercloudBlockStorageFlavor',
        overcloud_block_storage_count: 'BlockStorageCount',
        overcloud_object_storage_flavor: 'OvercloudSwiftStorageFlavor',
        overcloud_object_storage_count: 'ObjectStorageCount'
    }

    CEPH_ATTR_PARAM_HASH = {
        ceph_ext_mon_host: 'CephExternalMonHost',
        ceph_cluster_fsid: 'CephClusterFSID',
        ceph_client_username: 'CephClientUserName',
        ceph_client_key: 'CephClientKey',
        nova_rbd_pool_name: 'NovaRbdPoolName',
        cinder_rbd_pool_name: 'CinderRbdPoolName',
        glance_rbd_pool_name: 'GlanceRbdPoolName'
    }

    attr_accessor :warnings

    after_initialize :setup_warnings
    validates_with Fusor::Validators::OpenstackDeploymentValidator, on: :update

    has_one :deployment, :class_name => "Fusor::Deployment"

    def setup_warnings
      self.warnings = []
    end

    def deploy_cfme?
      deployment && deployment.deploy_cfme && deployment.cfme_install_loc == 'OpenStack'
    end
  end
end
