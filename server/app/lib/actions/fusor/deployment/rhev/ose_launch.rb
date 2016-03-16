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

module Actions
  module Fusor
    module Deployment
      module Rhev
        #Setup and Launch OSE VM
        class OseLaunch < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Setup and Launch OSE VM')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug '====== OSE Launch run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])

            # launch master nodes
            for i in 1..deployment.openshift_number_master_nodes do
              vmlauncher = Utils::Fusor::VMLauncher.new(deployment, 
                                                        'ose', 
                                                        deployment.openshift_install_loc,
                                                        'RedHat 7.1',
                                                        'x86_64')
              vmlauncher.set_hostname("#{deployment.label.tr('_', '-')}-ose-master#{i}")
              
              host = vmlauncher.launch_openshift_vm(deployment.openshift_master_vcpu,
                                                    deployment.openshift_master_ram,
                                                    deployment.openshift_master_disk,
                                                    deployment.openshift_storage_size)
              ::Fusor.log.debug "====== OSE Launched VM Name : #{host.name} ======"
              ::Fusor.log.debug "====== OSE Launched VM IP   : #{host.ip}   ======"
              #TODO save host.ip and host.name in deployment
            end

            # launch worker nodes
            for i in 1..deployment.openshift_number_worker_nodes do
              vmlauncher = Utils::Fusor::VMLauncher.new(deployment, 
                                                        'ose', 
                                                        deployment.openshift_install_loc,
                                                        'RedHat 7.1',
                                                        'x86_64')
              vmlauncher.set_hostname("#{deployment.label.tr('_', '-')}-ose-node#{i}")
              
              host = vmlauncher.launch_openshift_vm(deployment.openshift_node_vcpu,
                                                    deployment.openshift_node_ram,
                                                    deployment.openshift_node_disk,
                                                    deployment.openshift_storage_size)
              ::Fusor.log.debug "====== OSE Launched VM Name : #{host.name} ======"
              ::Fusor.log.debug "====== OSE Launched VM IP   : #{host.ip}   ======"
              #TODO save host.ip and host.name in deployment
            end

            ::Fusor.log.debug '====== Leaving OSE Launch run method ======'
          end

          def ose_launch_completed
            ::Fusor.log.info 'OSE Launch Completed'
          end

          def ose_launch_failed(hostname)
            fail _('OSE Launch failed #{hostname}')
          end
        end
      end
    end
  end
end
