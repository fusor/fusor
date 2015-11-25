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
require 'fog'

module Actions
  module Fusor
    module Deployment
      module Rhev
        # Create the RHEV Compute Resource in Foreman
        class CreateCr < Actions::Base
          def humanized_name
            _('Create the RHEV Compute Resource in Foreman')
          end

          def plan(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            Rails.logger.debug '====== RHEV Compute Resource run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            cr = { "name" => "#{deployment['name']}-RHEV",
                   "location_ids" => ["", Location.where(:name => "Default Location").first.id],
                   "url" => "https://#{::Host.find(deployment['rhev_engine_host_id']).name}/api",
                   "provider" => "Foreman::Model::Ovirt", "user" => 'admin@internal',
                   "password" => deployment.rhev_root_password,
                   "organization_ids" => [deployment["organization_id"]] }
            ::Foreman::Model::Ovirt.create(cr)
            Rails.logger.debug '=== Leaving RHEV Compute Resource run method ==='
          end

          def create_cr_completed
            Rails.logger.info 'Compute Resource Created'
          end

          def create_cr_failed
            fail _('Compute Resource Creation failed')
          end
        end
      end
    end
  end
end
