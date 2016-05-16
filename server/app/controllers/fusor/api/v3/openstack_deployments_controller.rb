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
  class Api::V3::OpenstackDeploymentsController < Api::V3::BaseController

    def index
      if params[:deployment_id]
        @openstack_deployments = Fusor::OpenstackDeployment.where(:deployment_id => params[:deployment_id])
      else
        @openstack_deployments = OpenstackDeployment.all
      end
      render :json => @openstack_deployments, :each_serializer => Fusor::OpenstackDeploymentSerializer
    end

    def create
      @openstack_deployment = Fusor::OpenstackDeployment.new(openstack_deployment_params)
      if @openstack_deployment.save
        render :json => @openstack_deployment, :serializer => Fusor::OpenstackDeploymentSerializer
      else
        render json: {errors: @openstack_deployment.errors}, status: 422
      end
    end

    def show
      @openstack_deployment = Fusor::OpenstackDeployment.find(params[:id])
      render :json => @openstack_deployment, :serializer => Fusor::OpenstackDeploymentSerializer
    end

    def update
      @openstack_deployment = Fusor::OpenstackDeployment.find(params[:id])

      @openstack_deployment.attributes = openstack_deployment_params
      @openstack_deployment.save(:validate => false)

      render :json => @openstack_deployment, :serializer => Fusor::OpenstackDeploymentSerializer
    end

    def destroy
      @openstack_deployment = Fusor::OpenstackDeployment.find(params[:id])
      @openstack_deployment.destroy
      render json: {}, status: 204
    end

    def sync_openstack
      @openstack_deployment = Fusor::OpenstackDeployment.find(params[:id])

      return render json: {errors: @openstack_deployment.errors}, status: 422 unless @openstack_deployment.valid?

      undercloud_handle.edit_plan_parameters('overcloud', build_openstack_params)
      sync_failures = get_sync_failures
      return render json: {errors: sync_failures}, status: 500 unless sync_failures.empty?

      render json: {}, status: 204
    end

    private

    def undercloud_handle
      Overcloud::UndercloudHandle.new('admin', @openstack_deployment.undercloud_admin_password, @openstack_deployment.undercloud_ip_address, 5000)
    end

    def build_openstack_params
      osp_params = {}
      Fusor::OpenstackDeployment::ATTR_PARAM_HASH.each { |attr_name, param_name| osp_params[param_name] = @openstack_deployment.send(attr_name) }
      osp_params
    end

    def get_sync_failures
      plan = undercloud_handle.get_plan_parameters('overcloud')
      errors = {}

      Fusor::OpenstackDeployment::ATTR_PARAM_HASH.each do |attr_name, param_name|
        attr_value = @openstack_deployment.send(attr_name)
        param_value = plan[param_name].try(:[], 'Default')
        errors[attr_name] = [_("Openstack #{param_name} was not properly synchronized.  Expected: #{attr_value} but got #{param_value}")] unless attr_value == param_value
      end

      errors
    end

    def openstack_deployment_params
      params[:openstack_deployment].delete :undercloud_admin_password
      params[:openstack_deployment].delete :undercloud_ip_address
      params[:openstack_deployment].delete :undercloud_ssh_username
      params[:openstack_deployment].delete :undercloud_ssh_password

      params.require(:openstack_deployment).permit(:overcloud_ext_net_interface,
                                                   :overcloud_private_net,
                                                   :overcloud_float_net,
                                                   :overcloud_float_gateway,
                                                   :overcloud_password,
                                                   :overcloud_address,
                                                   :overcloud_libvirt_type,
                                                   :overcloud_node_count,
                                                   :overcloud_compute_flavor,
                                                   :overcloud_compute_count,
                                                   :overcloud_controller_flavor,
                                                   :overcloud_controller_count,
                                                   :overcloud_ceph_storage_flavor,
                                                   :overcloud_ceph_storage_count,
                                                   :overcloud_block_storage_flavor,
                                                   :overcloud_block_storage_count,
                                                   :overcloud_object_storage_flavor,
                                                   :overcloud_object_storage_count,
                                                   :undercloud_hostname,
                                                   :overcloud_hostname)
    end
  end
end
