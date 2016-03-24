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
require 'net/scp'

module Actions
  module Fusor
    module Deployment
      module OpenShift
        class CopySshKey < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Generate and Copy SSH Keys to OpenShift VMs")
          end

          def plan(deployment, key_type)
            super(deployment)
            plan_self(deployment_id: deployment.id,
                      key_type: key_type)
          end

          def run
            ::Fusor.log.debug "================ Copy SSH Key run method ===================="
            begin
              deployment = ::Fusor::Deployment.find(input[:deployment_id])
              key_type = input[:key_type]
              keyutils = Utils::Fusor::OseSshKeyUtils.new(deployment, key_type)

              # Generate SSH Keys
              keyutils.generate_ssh_keys
              deployment.ose_private_key_path = "#{keyutils.get_ssh_private_key_path}"
              deployment.ose_public_key_path = "#{keyutils.get_ssh_private_key_path}.pub"
              deployment.save!

              # Distribute the key to each Master Nodes
              deployment.ose_master_hosts.each do |host|
                keyutils.copy_keys_to_user(host.name, deployment.openshift_username)
              end

              # Distribute the key to each worker Nodes
              deployment.ose_worker_hosts.each do |host|
                keyutils.copy_keys_to_user(host.name, deployment.openshift_username)
              end
            end
            ::Fusor.log.debug "================ Leaving Copy SSH Key run method ===================="
          end
        end
      end
    end
  end
end
