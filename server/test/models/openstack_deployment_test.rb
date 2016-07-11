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

require 'test_plugin_helper'

class OpenstackDeploymentTest < ActiveSupport::TestCase

  describe 'openstack deployment' do

    describe 'validate overcloud' do
      test 'openstack deployments validates true when all fields are valid' do
        osp = fusor_openstack_deployments(:osp)
        assert osp.valid?, 'Validated openstack deployment with valid data'
        assert_empty osp.errors
      end

      test 'openstack deployments must specify undercloud admin password' do
        osp = fusor_openstack_deployments(:osp)
        osp.undercloud_admin_password = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify undercloud admin password'
        assert_not_empty osp.errors[:undercloud_admin_password]
      end

      test 'openstack deployments must specify undercloud IP address' do
        osp = fusor_openstack_deployments(:osp)
        osp.undercloud_ip_address = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify undercloud IP address'
        assert_not_empty osp.errors[:undercloud_ip_address]
      end

      test 'openstack deployments must specify undercloud SSH user' do
        osp = fusor_openstack_deployments(:osp)
        osp.undercloud_ssh_username = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify undercloud SSH user'
        assert_not_empty osp.errors[:undercloud_ssh_username]
      end

      test 'openstack deployments must specify undercloud SSH password' do
        osp = fusor_openstack_deployments(:osp)
        osp.undercloud_ssh_password = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify undercloud SSH password'
        assert_not_empty osp.errors[:undercloud_ssh_password]
      end

      test 'openstack deployments overcloud_deployed must be false' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_deployed = true
        assert_not osp.valid?, 'Validated openstack deployment that already had a deployed overcloud'
        assert_not_empty osp.errors[:overcloud_deployed]
      end

      test 'openstack deployments must specify overcloud admin password' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_password = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud admin password'
        assert_not_empty osp.errors[:overcloud_password]
      end

      test 'openstack deployments must specify overcloud external network interface' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_ext_net_interface = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud external network interface'
        assert_not_empty osp.errors[:overcloud_ext_net_interface]
      end

      test 'openstack deployments must specify overcloud private network' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_private_net = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud private network'
        assert_not_empty osp.errors[:overcloud_private_net]
      end

      test 'openstack deployments must specify overcloud floating network' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_float_net = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud floating network'
        assert_not_empty osp.errors[:overcloud_float_net]
      end

      test 'openstack deployments must specify overcloud floating network gateway' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_float_gateway = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud floating network gateway'
        assert_not_empty osp.errors[:overcloud_float_gateway]
      end

      test 'openstack deployments must specify overcloud compute flavor' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_compute_flavor = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud compute flavor'
        assert_not_empty osp.errors[:overcloud_compute_flavor]
      end

      test 'openstack deployments must specify overcloud compute node count' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_compute_count = nil
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud compute node count'
        assert_not_empty osp.errors[:overcloud_compute_count]
      end

      test 'openstack deployments must have at least 1 compute node' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_compute_count = 0
        assert_not osp.valid?, 'Validated openstack deployment that did not have at least 1 compute node'
        assert_not_empty osp.errors[:overcloud_compute_count]
      end

      test 'openstack deployments must specify overcloud controller flavor' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_controller_flavor = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud controller flavor'
        assert_not_empty osp.errors[:overcloud_controller_flavor]
      end

      test 'openstack deployments must specify overcloud controller node count' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_controller_count = nil
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud controller node count'
        assert_not_empty osp.errors[:overcloud_controller_count]
      end

      test 'openstack deployments must have at least 1 controller node' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_controller_count = 0
        assert_not osp.valid?, 'Validated openstack deployment that did not have at least 1 controller node'
        assert_not_empty osp.errors[:overcloud_controller_count]
      end

      test 'openstack deployments must specify overcloud ceph-storage flavor' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_ceph_storage_flavor = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud ceph-storage flavor'
        assert_not_empty osp.errors[:overcloud_ceph_storage_flavor]
      end

      test 'openstack deployments must specify overcloud ceph-storage nodecount' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_ceph_storage_count = nil
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud ceph-storage node count'
        assert_not_empty osp.errors[:overcloud_ceph_storage_count]
      end

      test 'openstack deployments must specify overcloud block-storage flavor' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_block_storage_flavor = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud block-storage flavor'
        assert_not_empty osp.errors[:overcloud_block_storage_flavor]
      end

      test 'openstack deployments must specify overcloud block-storage nodecount' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_block_storage_count = nil
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud block-storage node count'
        assert_not_empty osp.errors[:overcloud_block_storage_count]
      end

      test 'openstack deployments must specify overcloud object-storage flavor' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_object_storage_flavor = ''
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud object-storage flavor'
        assert_not_empty osp.errors[:overcloud_object_storage_flavor]
      end

      test 'openstack deployments must specify overcloud object-storage nodecount' do
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_object_storage_count = nil
        assert_not osp.valid?, 'Validated openstack deployment that did not specify overcloud object-storage node count'
        assert_not_empty osp.errors[:overcloud_object_storage_count]
      end
    end

    describe 'validate ceph' do
      test 'openstack deployments validates with ceph enabled' do
        osp_ceph = fusor_openstack_deployments(:osp_ceph)
        assert osp_ceph.valid?, 'Validated openstack deployment with valid ceph data'
        assert_empty osp_ceph.errors
      end

      test 'openstack deployments must specify external host ip if external ceph is enabled' do
        osp_ceph = fusor_openstack_deployments(:osp_ceph)
        osp_ceph.ceph_ext_mon_host = nil
        assert_not osp_ceph.valid?, 'Validated openstack deployment that did not specify Ceph external host'
        assert_not_empty osp_ceph.errors[:ceph_ext_mon_host]
      end

      test 'openstack deployments must specify Ceph cluster FSID if external ceph is enabled' do
        osp_ceph = fusor_openstack_deployments(:osp_ceph)
        osp_ceph.ceph_cluster_fsid = nil
        assert_not osp_ceph.valid?, 'Validated openstack deployment that did not specify Ceph cluster FSID'
        assert_not_empty osp_ceph.errors[:ceph_cluster_fsid]
      end

      test 'openstack deployments must specify Ceph client username if external ceph is enabled' do
        osp_ceph = fusor_openstack_deployments(:osp_ceph)
        osp_ceph.ceph_client_username = nil
        assert_not osp_ceph.valid?, 'Validated openstack deployment that did not specify Ceph client username'
        assert_not_empty osp_ceph.errors[:ceph_client_username]
      end

      test 'openstack deployments must specify Ceph client Key if external ceph is enabled' do
        osp_ceph = fusor_openstack_deployments(:osp_ceph)
        osp_ceph.ceph_client_key = nil
        assert_not osp_ceph.valid?, 'Validated openstack deployment that did not specify Ceph client key'
        assert_not_empty osp_ceph.errors[:ceph_client_key]
      end

      test 'openstack deployments must specify Nova RBD pool name if external ceph is enabled' do
        osp_ceph = fusor_openstack_deployments(:osp_ceph)
        osp_ceph.nova_rbd_pool_name = ''
        assert_not osp_ceph.valid?, 'Validated openstack deployment that did not specify Nova RBD pool name'
        assert_not_empty osp_ceph.errors[:nova_rbd_pool_name]
      end

      test 'openstack deployments must specify Cinder RBD pool name if external ceph is enabled' do
        osp_ceph = fusor_openstack_deployments(:osp_ceph)
        osp_ceph.cinder_rbd_pool_name = ''
        assert_not osp_ceph.valid?, 'Validated openstack deployment that did not specify Cinder RBD pool name'
        assert_not_empty osp_ceph.errors[:cinder_rbd_pool_name]
      end

      test 'openstack deployments must specify Glance RBD pool name if external ceph is enabled' do
        osp_ceph = fusor_openstack_deployments(:osp_ceph)
        osp_ceph.glance_rbd_pool_name = ''
        assert_not osp_ceph.valid?, 'Validated openstack deployment that did not specify Glance RBD pool name'
        assert_not_empty osp_ceph.errors[:glance_rbd_pool_name]
      end
    end

    describe 'validate network' do
      test 'should not set warning if deployment is not deploying cfme' do
        Nic::Base.create({host: hosts(:managed_host1), ip: '192.168.152.2', primary: true})
        Nic::Base.create({host: hosts(:managed_host2), ip: '192.168.153.2', primary: true})
        osp = fusor_openstack_deployments(:osp)
        osp.deployment.deploy_cfme = false
        osp.deployment.save
        osp.overcloud_float_net = '192.168.153.0/24'
        osp.save
        assert_empty osp.warnings
      end

      test 'should not set warning if deployment is not deploying cfme on OpenStack' do
        Nic::Base.create({host: hosts(:managed_host1), ip: '192.168.152.2', primary: true})
        Nic::Base.create({host: hosts(:managed_host2), ip: '192.168.153.2', primary: true})
        osp = fusor_openstack_deployments(:osp)
        osp.deployment.cfme_install_loc = 'RHEV'
        osp.deployment.save
        osp.overcloud_float_net = '192.168.153.0/24'
        osp.save
        assert_empty osp.warnings
      end

      test 'should set warning if a host is found on overcloud float network' do
        Nic::Base.create({host: hosts(:managed_host1), ip: '192.168.152.2', primary: true})
        Nic::Base.create({host: hosts(:managed_host2), ip: '192.168.153.2', primary: true})
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_float_net = '192.168.153.0/24'
        osp.save
        assert_not_empty osp.warnings
      end

      test 'should not set warning if no hosts are found on overcloud float network' do
        Nic::Base.create({host: hosts(:managed_host1), ip: '192.168.152.2', primary: true})
        Nic::Base.create({host: hosts(:managed_host2), ip: '192.168.154.2', primary: true})
        osp = fusor_openstack_deployments(:osp)
        osp.overcloud_float_net = '192.168.153.0/24'
        osp.save
        assert_empty osp.warnings
      end
    end
  end
end
