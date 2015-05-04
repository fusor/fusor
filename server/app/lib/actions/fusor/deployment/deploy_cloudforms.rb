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
      class DeployCloudForms < Actions::Base
        def humanized_name
          _("Deploy CloudForms Management Engine")
        end

        def plan(deployment)
          Rails.logger.warn "XXX ================ Planning RHEV Deployment ===================="

          # VERIFY PARAMS HERE
          #if deployment.deploy_cfme
          #  fail _("Unable to locate a RHEV Engine Host") unless deployment.rhev_engine_host
          #end

          plan_self deployment_id: deployment.id
        end

        def finalize
          Rails.logger.warn "XXX ================ Deploy CFME finalize method ===================="

          deployment_id = input.fetch(:deployment_id)

          deployment = ::Fusor::Deployment.find(deployment_id)
          Rails.logger.warn "XXX #{deployment.id}"

          Rails.logger.warn "XXX ================ Leaving CFME  finalize method ===================="
        end

        private

        def is_rhev_up()
           # TODO: figure out how to detect if rhev is running.
           return true
        end

      end
    end
  end
end
