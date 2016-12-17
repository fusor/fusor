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
      module CloudForms
        class AddSatelliteProvider < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Add Satellite Provider")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug "================ AddSatelliteProvider run method ===================="

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            settings = YAML.load(File.open('/etc/fusor-installer/fusor-installer.answers.yaml'))
            sat_pwd = settings["fusor"]["foreman_admin_password"] ? settings["fusor"]["foreman_admin_password"] : "changeme"
            cfme_address = deployment.cfme_rhv_address || deployment.cfme_osp_address
            fqdn = Setting[:foreman_url].gsub(/^https:\/\//, "")

            provider = {
              :name => "#{deployment.label}-Satellite",
              :type => "ManageIQ::Providers::Foreman::Provider",
              :url => fqdn,
              :credentials => [{
                :userid => "admin",
                :password => sat_pwd
              }]
            }

            url_params = "?provider_class=provider"

            ::Fusor.log.info "Adding Satellite provider #{provider[:name]} to CFME."

            Utils::CloudForms::AddProvider.add(cfme_address, provider, deployment, url_params)
            Utils::CloudForms::AddCredentialsForHosts.add(cfme_address, deployment)

            ::Fusor.log.debug "================ Leaving AddSatelliteProvider run method ===================="
          end
        end
      end
    end
  end
end
