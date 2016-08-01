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

require 'egon'

module Fusor
  module Api
    module Openstack
      class NodesController < Api::Openstack::BaseController

        IP_ADDRESS_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.
                             (25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.
                             (25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.
                             (25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/x

        MAC_ADDRESS_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/

        def index
          render :json => undercloud_handle.list_nodes, :serializer => RootArraySerializer
        end

        def show
          render :json => {:node => undercloud_handle.get_node(params[:id])}
        end

        def create
          handle = undercloud_handle
          node_param_errors = validate_node_param(params[:node])
          unless node_param_errors.empty?
            return render json: {displayMessage: 'Invalid node parameter', errors: node_param_errors}, status: 422
          end

          begin
            node = handle.create_node_only(params[:node])
          rescue Excon::Errors::Conflict => undercloud_error
            body = JSON.parse(undercloud_error.response.try(:body))
            error_message = JSON.parse(body.try(:[], 'error_message'))
            fault_string = error_message.try(:[], 'faultstring')
            status = undercloud_error.response.try(:status)
            raise undercloud_error unless fault_string && status
            return render json: {displayMessage: fault_string, errors: [fault_string]}, status: status
          end

          task = async_task(::Actions::Fusor::Host::IntrospectOpenStackNode, @deployment, node.uuid)
          Fusor::IntrospectionTask.create({
                                            deployment:  @deployment,
                                            task_id:     task.id,
                                            node_uuid:   node.uuid,
                                            mac_address: params[:node][:address]
                                          })
          respond_for_async :resource => task
        end

        def destroy
          undercloud_handle.delete_node(params[:id])
          Fusor::IntrospectionTask.where(:node_uuid => params[:id]).destroy_all
          render json: {}, status: 204
        end

        def ready
          ready = undercloud_handle.introspect_node_status(params[:id])
          render :json => {:node => {:id => params[:id], :ready => ready}}.to_json
        end

        def list_ports
          render :json => {:ports => undercloud_handle.list_ports_detailed}
        end

        def discover_macs
          render :json => {:nodes => Utils::Fusor::DiscoverMacs.new(params).discover}
        end

        private

        def validate_node_param(node_param)
          errors = []

          driver = node_param.try(:[], 'driver')
          if driver != 'pxe_ssh' && driver != 'pxe_ipmitool'
            errors << 'driver: Node must specify a valid driver (pxe_ssh or pxe_ipmitool)'
          end

          errors.concat(validate_driver_info(node_param))

          capabilities = node_param.try(:[], 'properties').try(:[], 'capabilities')
          if capabilities.nil? || capabilities.empty?
            errors << 'properties[:capabilities]: Missing property capability. boot_option:local expected'
          end

          address = node_param.try(:[], 'address')
          if address.nil? || address.empty?
            errors << 'address: Node must specify a MAC address'
          elsif MAC_ADDRESS_REGEX.match(node_param['address']).nil?
            errors << 'address: Node MAC address was invalid'
          end

          errors
        end

        def validate_driver_info(node_param)
          errors = []
          driver = node_param.try(:[], 'driver')
          driver_info = node_param.try(:[], 'driver_info')

          if driver_info.nil? || driver_info.empty?
            return errors << 'driver_info: Node must specify a valid driver info'
          end

          if driver == 'pxe_ssh'
            errors.concat(validate_pxe_ssh_driver_info(node_param))
          end

          if driver == 'pxe_ipmitool'
            errors.concat(validate_pxe_ipmitool_driver_info(node_param))
          end

          if driver_info['deploy_kernel'].nil? || driver_info['deploy_kernel'].empty?
            errors << 'driver_info[:deploy_kernel]: Node must specify a valid deploy kernel'
          end

          if driver_info['deploy_ramdisk'].nil? || driver_info['deploy_ramdisk'].empty?
            errors << 'driver_info[:deploy_ramdisk]: Node must specify a valid deploy ram disk'
          end

          errors
        end

        def validate_pxe_ssh_driver_info(node_param)
          errors = []
          driver_info = node_param.try(:[], 'driver_info')

          if driver_info['ssh_address'].nil? || driver_info['ssh_address'].empty?
            errors << 'driver_info[:ssh_address]: Node must specify an IP address for ssh'
          elsif IP_ADDRESS_REGEX.match(driver_info['ssh_address']).nil?
            errors << 'driver_info[:ssh_address]: Node IP address for ssh was invalid'
          end

          if driver_info['ssh_username'].nil? || driver_info['ssh_username'].empty?
            errors << 'driver_info[:ssh_username]: Node must specify a valid ssh username'
          end

          if driver_info['ssh_password'].nil? || driver_info['ssh_password'].empty?
            errors << 'driver_info[:ssh_password]: Node must specify a valid ssh password'
          end

          if driver_info['ssh_virt_type'].nil? || driver_info['ssh_virt_type'].empty?
            errors << 'driver_info[:ssh_virt_type]: Node must specify a valid virtualization type'
          end

          errors
        end

        def validate_pxe_ipmitool_driver_info(node_param)
          errors = []
          driver_info = node_param.try(:[], 'driver_info')

          if driver_info['ipmi_address'].nil? || driver_info['ipmi_address'].empty?
            errors << 'driver_info[:ipmi_address]: Node must specify an IP address to the IPMI'
          elsif IP_ADDRESS_REGEX.match(driver_info['ipmi_address']).nil?
            errors << 'driver_info[:ipmi_address]: Node IP address for IPMI was invalid'
          end

          if driver_info['ipmi_username'].nil? || driver_info['ipmi_username'].empty?
            errors << 'driver_info[:ipmi_username]: Node must specify a valid IPMI username'
          end

          if driver_info['ipmi_password'].nil? || driver_info['ipmi_password'].empty?
            errors << 'driver_info[:ipmi_password]: Node must specify a valid IPMI password'
          end

          errors
        end
      end
    end
  end
end
