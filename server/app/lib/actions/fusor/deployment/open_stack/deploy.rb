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

module Actions::Fusor::Deployment::OpenStack
  class Deploy < Actions::Fusor::FusorBaseAction
    include Actions::Base::Polling

    input_format do
      param :deployment_id
    end

    def humanized_name
      _("Deploy Red Hat OpenStack Platform overcloud")
    end

    def plan(deployment)
      super(deployment)
      fail _("Unable to locate a RHEL OSP undercloud") unless deployment.openstack_undercloud_password
      sequence do
        plan_action(TransferConsumerRpm, deployment)
        plan_action(SshCommand, deployment, "sudo yum -y localinstall /tmp/katello-ca-consumer-latest.noarch.rpm")
        plan_action(SshCommand, deployment, "sudo subscription-manager register --org " + deployment.organization.label + " --activationkey " + activation_key(deployment))
        plan_action(SshCommand, deployment, "sudo yum -y install katello-agent")
        if deployment.enable_access_insights
          plan_action(SshCommand, deployment, "sudo yum -y install redhat-access-insights")
          plan_action(SshCommand, deployment, "sudo redhat-access-insights --register")
        end
      end

      sequence do
        # work around BZ 1281908
        plan_action(UndercloudNoHostWorkaround, deployment)
        plan_self(deployment_id: deployment.id)
        plan_action(SshCommand, deployment, "/opt/theforeman/tfm/root/bin/initialize_overcloud.sh")
        plan_action(ControllerCleanup, deployment)
        plan_action(OvercloudConfiguration, deployment)
        plan_action(CreateCr, deployment)
        plan_action(AddOspHostnames, deployment)
      end
    end

    def done?
      external_task
    end

    def invoke_external_task
      deployment = ::Fusor::Deployment.find(input[:deployment_id])
      undercloud_handle(deployment).deploy_plan('overcloud')
      false # it's not done yet, return false so we'll start polling
    end

    def poll_external_task
      deployment = ::Fusor::Deployment.find(input[:deployment_id])
      stack = undercloud_handle(deployment).get_stack_by_name('overcloud')
      if stack.nil?
        fail "ERROR: deployment not found on undercloud."
      end
      if stack.stack_status == 'CREATE_COMPLETE'
        @progress = 1
        return true # done!
      elsif stack.stack_status == 'CREATE_IN_PROGRESS'
        # estimate our current progress. Start at 10%, save 70% for node provisioning.
        # Leave 20% for post-node-provisioning setup.
        provisioned_nodes = 0
        for node in undercloud_handle(deployment).list_nodes
          if node.provision_state == 'active'
            provisioned_nodes += 1
          end
        end

        # Figure out how many total nodes we have
        unless defined?(@total_nodes)
          @total_nodes = count_nodes(deployment)
        end

        @progress = 0.1 + 0.7 * provisioned_nodes / @total_nodes
        return false # not done yet, try again later
      else
        fail "ERROR: deployment failed with status: " + stack.stack_status + " and reason: " + stack.stack_status_reason # errored, barf
      end
    end

    def run_progress
      if !defined?(@progress)
        0.1
      else
        @progress
      end
    end

    def run_progress_weight
      15
    end

    private

    def count_nodes(d)
      d.openstack_overcloud_ceph_storage_count +
          d.openstack_overcloud_cinder_storage_count +
          d.openstack_overcloud_swift_storage_count +
          d.openstack_overcloud_compute_count +
          d.openstack_overcloud_controller_count
    end

    def undercloud_handle(deployment)
      return Overcloud::UndercloudHandle.new('admin', deployment.openstack_undercloud_password, deployment.openstack_undercloud_ip_addr, 5000)
    end

    def activation_key(deployment)
      hostgroup = SETTINGS[:fusor][:host_groups][:openstack][:host_groups].last
      hg_name = hostgroup[:name]
      name = hostgroup[:activation_key][:name]

      [name, deployment.label, hg_name].map { |str| str.tr("-", "_") }.join('-')
    end
  end
end
