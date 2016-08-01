require 'test_plugin_helper'

module Fusor
  module Api
    module Openstack
      class NodesControllerTest < ActionController::TestCase
        class MockNode
          attr_accessor :uuid

          def initialize(params = {})
            @uuid = params[:uuid]
          end
        end

        class MockPort
          attr_accessor :uuid, :address, :node_uuid

          def initialize(params = {})
            @uuid = params[:uuid]
            @address = params[:address]
            @node_uuid = params[:node_uuid]
          end
        end

        class MockHost
          attr_accessor :hostname, :mac_addresses

          def initialize(params = {})
            @hostname = params[:hostname]
            @mac_addresses = params[:mac_addresses]
          end
        end

        def setup
          @deployment = fusor_deployments(:osp)
          setup_fusor_routes
          @controller = ::Fusor::Api::Openstack::NodesController.new
        end

        test 'index request should return array of nodes' do
          mock_nodes = %w(1 2 3).map { |uuid| MockNode.new({uuid: uuid}) }
          Overcloud::UndercloudHandle.any_instance
            .expects(:list_nodes)
            .once
            .returns(mock_nodes)

          response_body = JSON.parse(get(:index, deployment_id: @deployment.id).body)
          assert_response :success
          assert_not_empty response_body
          assert_not_empty response_body['nodes']

          mock_nodes.each do |fake_node|
            node_found = response_body['nodes'].any? { |node| node['uuid'] == fake_node.uuid }
            assert node_found, "Node #{fake_node.uuid} not found in response"
          end
        end

        test 'show request should return the node' do
          mock_node = MockNode.new({uuid: '1234'})
          Overcloud::UndercloudHandle.any_instance
            .expects(:get_node)
            .with(mock_node.uuid)
            .once
            .returns(mock_node)

          response_body = JSON.parse(get(:show, deployment_id: @deployment.id, id: mock_node.uuid).body)
          assert_response :success
          assert_not_empty response_body
          assert_not_empty response_body['node']
          assert_equal response_body['node']['uuid'], mock_node.uuid, "Node #{mock_node.uuid} not found in response"
        end

        describe 'create nodes' do
          def setup
            @deployment = fusor_deployments(:osp)
            setup_fusor_routes
            @controller = ::Fusor::Api::Openstack::NodesController.new

            @ssh_node_request = {
              driver:      'pxe_ssh',
              driver_info: {
                ssh_address:    '123.124.125.126',
                ssh_username:   'username',
                ssh_password:   'password',
                ssh_virt_type:  'virsh',
                deploy_kernel:  '1cfc9b5f-a2b3-4832-b8ba-c0a6c8d6815b',
                deploy_ramdisk: 'c4ad29a8-fa92-43b5-92c4-93ca34b72d4a'
              },
              properties:  {
                capabilities: 'boot_option:local'
              },
              address:     '52:54:00:99:0c:e8'
            }

            @ipmi_node_request = {
              driver:      'pxe_ipmitool',
              driver_info: {
                ipmi_address:   '123.124.125.126',
                ipmi_username:  'username',
                ipmi_password:  'password',

                deploy_kernel:  '1cfc9b5f-a2b3-4832-b8ba-c0a6c8d6815b',
                deploy_ramdisk: 'c4ad29a8-fa92-43b5-92c4-93ca34b72d4a'
              },
              properties:  {
                capabilities: 'boot_option:local'
              },
              address:     '52:54:00:99:0c:e8'
            }
          end

          test 'create request respond with success for a valid ssh node request' do
            mock_node = MockNode.new({uuid: '1234'})
            Overcloud::UndercloudHandle.any_instance
              .expects(:create_node_only)
              .returns(mock_node)
            response = post(:create, deployment_id: @deployment.id, node: @ssh_node_request)
            response_body = JSON.parse(response.body)

            assert_response :success
            assert_empty response_body['errors']
            assert_not_empty response_body

            task = ::Fusor::IntrospectionTask.where(task_id: response_body['id']).first
            assert_not_nil task
            assert_equal task.deployment_id, @deployment.id
            assert_equal task.node_uuid, mock_node.uuid
            assert_equal task.mac_address, @ssh_node_request[:address]
          end

          test 'create request respond with success for a valid ssh node request' do
            mock_node = MockNode.new({uuid: '1234'})
            Overcloud::UndercloudHandle.any_instance
              .expects(:create_node_only)
              .returns(mock_node)
            response = post(:create, deployment_id: @deployment.id, node: @ipmi_node_request)
            response_body = JSON.parse(response.body)

            assert_response :success
            assert_empty response_body['errors']
            assert_not_empty response_body

            task = ::Fusor::IntrospectionTask.where(task_id: response_body['id']).first
            assert_not_nil task
            assert_equal task.deployment_id, @deployment.id
            assert_equal task.node_uuid, mock_node.uuid
            assert_equal task.mac_address, @ipmi_node_request[:address]
          end


          test 'create request respond with an error if node information is missing' do
            response = post(:create, deployment_id: @deployment.id, node: {})
            errors = JSON.parse(response.body)['errors']

            assert_response 422
            assert_not_empty errors
            error_messages = %w(driver: driver_info: properties\[:capabilities\]: address:)
            error_messages.each do |msg|
              error_found = errors.any? { |error| Regexp.new(msg).match(error) }
              assert error_found, "#{msg} not found in listed errors"
            end
          end

          test 'create request respond with an error if node ssh driver info is missing' do
            @ssh_node_request[:driver_info] = {bad: 'data'}
            response = post(:create, deployment_id: @deployment.id, node: @ssh_node_request)
            errors = JSON.parse(response.body)['errors']

            assert_response 422
            assert_not_empty errors
            [
              'driver_info\[:ssh_address\]:',
              'driver_info\[:ssh_username\]:',
              'driver_info\[:ssh_password\]:',
              'driver_info\[:ssh_virt_type\]:',
              'driver_info\[:deploy_kernel\]:',
              'driver_info\[:deploy_ramdisk\]:'
            ].each do |msg|
              error_found = errors.any? { |error| Regexp.new(msg).match(error) }
              assert error_found, "#{msg} not found in listed errors"
            end
          end

          test 'create request respond with an error if node ipmi driver info is missing' do
            response = post(:create,
                            deployment_id: @deployment.id,
                            :node          => {
                              driver:      'pxe_ipmitool',
                              driver_info: {bad: 'data'}
                            })
            errors   = JSON.parse(response.body)['errors']

            assert_response 422
            assert_not_empty errors
            [
              'driver_info\[:ipmi_address\]:',
              'driver_info\[:ipmi_username\]:',
              'driver_info\[:ipmi_password\]:',
              'driver_info\[:deploy_kernel\]:',
              'driver_info\[:deploy_ramdisk\]:'
            ].each do |msg|
              error_found = errors.any? { |error| Regexp.new(msg).match(error) }
              assert error_found, "#{msg} not found in listed errors"
            end
          end

          test 'create request responds with an error if invalid ssh IP address' do
            @ssh_node_request[:driver_info][:ssh_address] = 'bad ip address'
            response = post(:create, deployment_id: @deployment.id, node: @ssh_node_request)
            errors   = JSON.parse(response.body)['errors']

            assert_response 422
            assert_not_empty errors
            error_found = errors.any? { |error| /driver_info\[:ssh_address\]:/.match(error) }
            assert error_found, 'driver_info[:ssh_address]: not found in listed errors'
          end

          test 'create request responds with an error if invalid ipmi IP address' do
            @ipmi_node_request[:driver_info][:ipmi_address] = 'bad ip address'
            response = post(:create, deployment_id: @deployment.id, node: @ipmi_node_request)
            errors   = JSON.parse(response.body)['errors']

            assert_response 422
            assert_not_empty errors
            error_found = errors.any? { |error| /driver_info\[:ipmi_address\]:/.match(error) }
            assert error_found, 'driver_info[:ipmi_address]: not found in listed errors'
          end

          test 'create request responds with an error if invalid MAC address' do
            @ssh_node_request[:address] = 'bad MAC address'
            response = post(:create, deployment_id: @deployment.id, node: @ssh_node_request)
            errors   = JSON.parse(response.body)['errors']

            assert_response 422
            assert_not_empty errors
            error_found = errors.any? { |error| /address:/.match(error) }
            assert error_found, 'address: not found in listed errors'
          end
        end

        test 'delete request should successfully delete a node' do
          mock_node = MockNode.new({uuid: '1234'})
          ::Fusor::IntrospectionTask.create({
                                                   deployment_id: @deployment.id,
                                                   task_id:       '5678',
                                                   node_uuid:     mock_node.uuid,
                                                   mac_address:   'aa:aa:aa:aa:aa:aa'
                                                 })
          Overcloud::UndercloudHandle.any_instance
            .expects(:delete_node)
            .with(mock_node.uuid)
            .once

          JSON.parse(delete(:destroy, deployment_id: @deployment.id, id: mock_node.uuid).body)
          assert_response :success
          assert_empty ::Fusor::IntrospectionTask.where(node_uuid: mock_node.uuid)
        end

        test 'list_ports request should return an array of ports' do
          mock_ports = [
            MockPort.new({uuid: '5678', address: 'aa:aa:aa:aa:aa:aa', node_uuid: '1234'}),
            MockPort.new({uuid: '5679', address: 'bb:bb:bb:bb:bb:bb', node_uuid: '1235'}),
            MockPort.new({uuid: '5680', address: 'cc:cc:cc:cc:cc:cc', node_uuid: '1236'})
          ]
          Overcloud::UndercloudHandle.any_instance
            .expects(:list_ports_detailed)
            .once
            .returns(mock_ports)

          response_body = JSON.parse(get(:list_ports, deployment_id: @deployment.id).body)
          assert_response :success
          assert_not_empty response_body
          assert_not_empty response_body['ports']

          mock_ports.each do |mock_port|
            port_found = response_body['ports'].any? do |port|
              port['uuid'] == mock_port.uuid && port['address'] == mock_port.address && port['node_uuid'] == mock_port.node_uuid
            end
            assert port_found, "MAC address #{mock_port.address} not found in response"
          end
        end

        test 'discover_macs request should return an array of MAC addresses' do
          mock_hosts = [
            MockHost.new({hostname: 'osp8_node_1', mac_addresses: %w(52:54:00:99:0c:e8 52:54:00:2e:01:39)}),
            MockHost.new({hostname: 'osp8_node_2', mac_addresses: %w(52:54:00:06:04:cd 52:54:00:65:b3:b9)})
          ]
          Utils::Fusor::DiscoverMacs.any_instance
            .expects(:discover)
            .once
            .returns(mock_hosts)

          response_body = JSON.parse(get(:discover_macs, deployment_id: @deployment.id).body)
          assert_response :success
          assert_not_empty response_body
          assert_not_empty response_body['nodes']

          mock_hosts.each do |mock_host|
            host_found = response_body['nodes'].any? do |response_host|
              response_host_macs = response_host['mac_addresses']
              mock_host_macs = mock_host.mac_addresses
              mock_host.hostname == response_host['hostname'] &&
                response_host_macs && mock_host_macs && response_host_macs.length == mock_host_macs.length &&
                mock_host_macs.all? { |mock_host_mac| response_host_macs.include? mock_host_mac }
            end
            assert host_found, "Host #{mock_host.hostname} not found."
          end
        end

      end
    end
  end
end
