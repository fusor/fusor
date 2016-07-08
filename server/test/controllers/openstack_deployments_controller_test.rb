require 'test_plugin_helper'

module Fusor
  class Api::V21::OpenstackDeploymentsControllerTest < ActionController::TestCase
    describe 'restful resource requests' do
      def setup
        @openstack_deployment = fusor_openstack_deployments(:osp)
        setup_fusor_routes
        @controller = ::Fusor::Api::V21::OpenstackDeploymentsController.new
      end

      test 'index request should return array of openstack_deployments' do
        body = JSON.parse(get(:index).body)
        assert_response :success
        openstack_deployment_found = body['openstack_deployments'].any? { |osp_d| osp_d['id'] == @openstack_deployment.id }
        assert openstack_deployment_found, 'Response was not correct, did not include openstack_deployment'
      end

      test 'show request should return the openstack deployment' do
        body = JSON.parse(get(:show, :id => @openstack_deployment.id).body)
        assert_response :success
        assert_equal @openstack_deployment.id, body['openstack_deployment']['id'], 'Response was not correct, OpenStack deployment was not returned'
      end

      test 'update request should successfully update openstack deployment' do
        new_overcloud_password = 'testing'
        body = JSON.parse(put(:update, :id => @openstack_deployment.id, openstack_deployment: {overcloud_password: new_overcloud_password}).body)
        assert_response :success
        assert_equal new_overcloud_password, body['openstack_deployment']['overcloud_password'], 'Response was not correct, OpenStack deployment was not updated'
        @openstack_deployment.reload
        assert_equal @openstack_deployment.overcloud_password, new_overcloud_password, 'Update not successful. OpenStack deployment record was not updated'
      end

      test 'create request should successfully create OpenStack deployment' do
        previous_count = OpenstackDeployment.count
        body = JSON.parse(post(:create).body)
        assert_equal previous_count + 1, OpenstackDeployment.count, 'The number of OpenStack deployments should increase by one if we create a new one'
        assert_response :success
        assert_not_nil body['openstack_deployment']['id'], 'Response was not correct, did not return OpenStack deployment'
        assert_not_nil OpenstackDeployment.find body['openstack_deployment']['id']
      end

      test 'delete request should successfully delete deployment' do
        previous_count = OpenstackDeployment.count
        JSON.parse(delete(:destroy, :id => @openstack_deployment.id).body)
        assert_equal previous_count - 1, OpenstackDeployment.count, 'The number of OpenStack deployments should decrease by one if we delete one'
        assert_response :success
        assert_empty OpenstackDeployment.where(id: @openstack_deployment.id)
      end
    end

    describe 'sync_openstack' do
      def build_overcloud_edit_plan_parameters(deployment)
        {
          'NeutronPublicInterface'      =>  deployment.overcloud_ext_net_interface,
          'NovaComputeLibvirtType'      =>  deployment.overcloud_libvirt_type,
          'AdminPassword'               =>  deployment.overcloud_password,
          'OvercloudComputeFlavor'      =>  deployment.overcloud_compute_flavor,
          'ComputeCount'                =>  deployment.overcloud_compute_count,
          'OvercloudControlFlavor'      =>  deployment.overcloud_controller_flavor,
          'ControllerCount'             =>  deployment.overcloud_controller_count,
          'OvercloudCephStorageFlavor'  =>  deployment.overcloud_ceph_storage_flavor,
          'CephStorageCount'            =>  deployment.overcloud_ceph_storage_count,
          'OvercloudBlockStorageFlavor' =>  deployment.overcloud_block_storage_flavor,
          'BlockStorageCount'           =>  deployment.overcloud_block_storage_count,
          'OvercloudSwiftStorageFlavor' =>  deployment.overcloud_object_storage_flavor,
          'ObjectStorageCount'          =>  deployment.overcloud_object_storage_count
        }
      end

      def build_ceph_edit_plan_parameters(deployment)
        {
          'CephExternalMonHost'         => deployment.ceph_ext_mon_host,
          'CephClusterFSID'             => deployment.ceph_cluster_fsid,
          'CephClientUserName'          => deployment.ceph_client_username,
          'CephClientKey'               => deployment.ceph_client_key,
          'NovaRbdPoolName'             => deployment.nova_rbd_pool_name,
          'CinderRbdPoolName'           => deployment.cinder_rbd_pool_name,
          'GlanceRbdPoolName'           => deployment.glance_rbd_pool_name
        }
      end

      def build_get_plan_parameters(deployment)
        {
          'NeutronPublicInterface'      => {'Default' => deployment.overcloud_ext_net_interface},
          'NovaComputeLibvirtType'      => {'Default' => deployment.overcloud_libvirt_type},
          'AdminPassword'               => {'Default' => deployment.overcloud_password},
          'OvercloudComputeFlavor'      => {'Default' => deployment.overcloud_compute_flavor},
          'ComputeCount'                => {'Default' => deployment.overcloud_compute_count},
          'OvercloudControlFlavor'      => {'Default' => deployment.overcloud_controller_flavor},
          'ControllerCount'             => {'Default' => deployment.overcloud_controller_count},
          'OvercloudCephStorageFlavor'  => {'Default' => deployment.overcloud_ceph_storage_flavor},
          'CephStorageCount'            => {'Default' => deployment.overcloud_ceph_storage_count},
          'OvercloudBlockStorageFlavor' => {'Default' => deployment.overcloud_block_storage_flavor},
          'BlockStorageCount'           => {'Default' => deployment.overcloud_block_storage_count},
          'OvercloudSwiftStorageFlavor' => {'Default' => deployment.overcloud_object_storage_flavor},
          'ObjectStorageCount'          => {'Default' => deployment.overcloud_object_storage_count},
          'CephExternalMonHost'         => {'Default' => deployment.ceph_ext_mon_host},
          'CephClusterFSID'             => {'Default' => deployment.ceph_cluster_fsid},
          'CephClientUserName'          => {'Default' => deployment.ceph_client_username},
          'CephClientKey'               => {'Default' => deployment.ceph_client_key},
          'NovaRbdPoolName'             => {'Default' => deployment.nova_rbd_pool_name},
          'CinderRbdPoolName'           => {'Default' => deployment.cinder_rbd_pool_name},
          'GlanceRbdPoolName'           => {'Default' => deployment.glance_rbd_pool_name}
        }
      end

      def build_get_plan_environments(ceph_enabled)
        {
          'root_environment' => 'overcloud-resource-registry-puppet.yaml',
          'root_template' => 'overcloud.yaml',
          'topics' => [
            {
              'environment_groups' => [
                {
                  'description' => 'Enable the use of an externally managed Ceph cluster\n',
                  'environments' => [
                    {
                      'description' => nil,
                      'enabled' => ceph_enabled,
                      'file' => 'environments/puppet-ceph-external.yaml',
                      'requires' => ['overcloud-resource-registry-puppet.yaml'],
                      'title' => 'Externally managed Ceph'
                    }
                  ],
                  'title' => 'Externally managed Ceph'
                }
              ],
              'title' => 'Storage'
            }
          ]
        }
      end

      def setup
        @openstack_deployment = fusor_openstack_deployments(:osp)
        @ceph_openstack_deployment = fusor_openstack_deployments(:osp_ceph)
        setup_fusor_routes
        @controller = ::Fusor::Api::V21::OpenstackDeploymentsController.new

        @overcloud_edit_parameters = build_overcloud_edit_plan_parameters(@openstack_deployment)
        @overcloud_get_parameters = build_get_plan_parameters(@openstack_deployment)

        @ceph_edit_parameters = build_overcloud_edit_plan_parameters(@ceph_openstack_deployment).merge(build_ceph_edit_plan_parameters(@ceph_openstack_deployment))
        @ceph_get_parameters = build_get_plan_parameters(@ceph_openstack_deployment)

        @overcloud_edit_environments = {'environments/puppet-ceph-external.yaml' => false}
        @overcloud_get_environments = build_get_plan_environments(false)

        @ceph_edit_environments = {'environments/puppet-ceph-external.yaml' => true}
        @ceph_get_environments = build_get_plan_environments(true)
      end

      test 'sync_openstack should sync overcloud parameters and environments when ceph is disabled' do
        Overcloud::UndercloudHandle.any_instance
          .expects(:list_stacks).returns([])
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_environments)
          .with('overcloud', @overcloud_edit_environments)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_parameters)
          .with('overcloud', @overcloud_edit_parameters)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_environments)
          .returns(@overcloud_get_environments)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_parameters)
          .returns(@overcloud_get_parameters)

        JSON.parse(post(:sync_openstack, :id => @openstack_deployment.id).body)
        assert_response :success
      end


      test 'sync_openstack should sync overcloud parameters and environments when ceph is enabled' do
        Overcloud::UndercloudHandle.any_instance
          .expects(:list_stacks).returns([])
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_environments)
          .with('overcloud', @ceph_edit_environments)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_parameters)
          .with('overcloud', @ceph_edit_parameters)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_environments)
          .returns(@ceph_get_environments)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_parameters)
          .returns(@ceph_get_parameters)

        JSON.parse(post(:sync_openstack, :id => @ceph_openstack_deployment.id).body)
        assert_response :success
      end

      test 'sync_openstack should fail if overcloud is deployed' do
        Overcloud::UndercloudHandle.any_instance
          .expects(:list_stacks)
          .returns(['overcloud'])
          .once
        JSON.parse(post(:sync_openstack, :id => @openstack_deployment.id).body)
        assert_response 422
      end

      test 'sync_openstack should return an error if environments are not synchronized when ceph is disabled' do
        bad_environments = build_get_plan_environments(true)

        Overcloud::UndercloudHandle.any_instance
          .expects(:list_stacks).returns([])
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_environments)
          .with('overcloud', @overcloud_edit_environments)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_parameters)
          .with('overcloud', @overcloud_edit_parameters)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_environments)
          .returns(bad_environments)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_parameters)
          .returns(@overcloud_get_parameters)

        body = JSON.parse(post(:sync_openstack, :id => @openstack_deployment.id).body)
        assert_response 500
        assert_not_empty body['errors']
      end

      test 'sync_openstack should return an error if environments are not synchronized when ceph is enabled' do
        bad_environments = build_get_plan_environments(false)

        Overcloud::UndercloudHandle.any_instance
          .expects(:list_stacks).returns([])
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_environments)
          .with('overcloud', @ceph_edit_environments)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_parameters)
          .with('overcloud', @ceph_edit_parameters)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_environments)
          .returns(bad_environments)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_parameters)
          .returns(@ceph_get_parameters)

        body = JSON.parse(post(:sync_openstack, :id => @ceph_openstack_deployment.id).body)
        assert_response 500
        assert_not_empty body['errors']
      end

      test 'sync_openstack should return an error if overcloud parameters are not synchronized when ceph is disabled' do
        bad_parameters = build_get_plan_parameters(@openstack_deployment)
        bad_parameters['NeutronPublicInterface']['Default'] = 'wrong'

        Overcloud::UndercloudHandle.any_instance
          .expects(:list_stacks).returns([])
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_environments)
          .with('overcloud', @overcloud_edit_environments)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_parameters)
          .with('overcloud', @overcloud_edit_parameters)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_environments)
          .returns(@overcloud_get_environments)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_parameters)
          .returns(bad_parameters)

        body = JSON.parse(post(:sync_openstack, :id => @openstack_deployment.id).body)
        assert_response 500
        assert_not_empty body['errors']
      end


      test 'sync_openstack should return an error if overcloud parameters are not synchronized when ceph is enabled' do
        bad_parameters = build_get_plan_parameters(@ceph_openstack_deployment)
        bad_parameters['CephExternalMonHost']['Default'] = ''

        Overcloud::UndercloudHandle.any_instance
          .expects(:list_stacks).returns([])
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_environments)
          .with('overcloud', @ceph_edit_environments)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:edit_plan_parameters)
          .with('overcloud', @ceph_edit_parameters)
          .returns(Excon::Response.new)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_environments)
          .returns(@ceph_get_environments)
        Overcloud::UndercloudHandle.any_instance
          .expects(:get_plan_parameters)
          .returns(bad_parameters)

        body = JSON.parse(post(:sync_openstack, :id => @ceph_openstack_deployment.id).body)
        assert_response 500
        assert_not_empty body['errors']
      end
    end
  end
end
