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

  describe "openstack deployment" do
    test "openstack deployments must specify undercloud admin password" do
      osp = fusor_openstack_deployments(:osp)
      osp.undercloud_admin_password = ''
      assert_not osp.save, "Saved openstack deployment that did not specify undercloud admin password"
    end

    test "openstack deployments must specify undercloud IP address" do
      osp = fusor_openstack_deployments(:osp)
      osp.undercloud_ip_address = ''
      assert_not osp.save, "Saved openstack deployment that did not specify undercloud IP address"
    end

    test "openstack deployments must specify undercloud SSH user" do
      osp = fusor_openstack_deployments(:osp)
      osp.undercloud_ssh_username = ''
      assert_not osp.save, "Saved openstack deployment that did not specify undercloud SSH user"
    end

    test "openstack deployments must specify undercloud SSH password" do
      osp = fusor_openstack_deployments(:osp)
      osp.undercloud_ssh_password = ''
      assert_not osp.save, "Saved openstack deployment that did not specify undercloud SSH password"
    end

    test "openstack deployments overcloud_deployed must be false" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_deployed = true
      assert_not osp.save, "Saved openstack deployment that already had a deployed overcloud"
    end

    test "openstack deployments must specify overcloud admin password" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_password = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud admin password"
    end

    test "openstack deployments must specify overcloud external network interface" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_ext_net_interface = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud external network interface"
    end

    test "openstack deployments must specify overcloud private network" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_private_net = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud private network"
    end

    test "openstack deployments must specify overcloud floating network" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_float_net = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud floating network"
    end

    test "openstack deployments must specify overcloud floating network gateway" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_float_gateway = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud floating network gateway"
    end

    test "openstack deployments must specify overcloud compute flavor" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_compute_flavor = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud compute flavor"
    end

    test "openstack deployments must specify overcloud compute node count" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_compute_count = nil
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud compute node count"
    end

    test "openstack deployments must have at least 1 compute node" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_compute_count = 0
      assert_not osp.save, "Saved openstack deployment that did not have at least 1 compute node"
    end

    test "openstack deployments must specify overcloud controller flavor" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_controller_flavor = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud controller flavor"
    end

    test "openstack deployments must specify overcloud controller node count" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_controller_count = nil
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud controller node count"
    end

    test "openstack deployments must have at least 1 controller node" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_controller_count = 0
      assert_not osp.save, "Saved openstack deployment that did not have at least 1 controller node"
    end

    test "openstack deployments must specify overcloud ceph-storage flavor" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_ceph_storage_flavor = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud ceph-storage flavor"
    end

    test "openstack deployments must specify overcloud ceph-storage nodecount" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_ceph_storage_count = nil
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud ceph-storage node count"
    end

    test "openstack deployments must specify overcloud block-storage flavor" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_block_storage_flavor = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud block-storage flavor"
    end

    test "openstack deployments must specify overcloud block-storage nodecount" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_block_storage_count = nil
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud block-storage node count"
    end

    test "openstack deployments must specify overcloud object-storage flavor" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_object_storage_flavor = ''
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud object-storage flavor"
    end

    test "openstack deployments must specify overcloud object-storage nodecount" do
      osp = fusor_openstack_deployments(:osp)
      osp.overcloud_object_storage_count = nil
      assert_not osp.save, "Saved openstack deployment that did not specify overcloud object-storage node count"
    end
  end
end
