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

require 'mechanize'

module Actions
  module Fusor
    module Deployment
      module OpenStack
        # Add URL and Password to deployment model
        class OvercloudCredentials < Actions::Base
          def humanized_name
            _('SSH and run an arbitrary command on the Undercloud')
          end

          def plan(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            Rails.logger.debug '====== OvercloudCredentials run method ======'

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            ucloud = deployment.openstack_undercloud_ip_addr

            agent = Mechanize.new
            agent.verify_mode = OpenSSL::SSL::VERIFY_NONE
            agent.open_timeout = 180
            csrf = agent.post("http://#{ucloud}").form.csrfmiddlewaretoken

            agent.post("http://#{ucloud}/dashboard/auth/login/?button=loginBtn",
                       'username' => 'admin', 'csrfmiddlewaretoken' => csrf,
                       'password' => deployment.openstack_undercloud_password,
                       'region' => "http://#{ucloud}:5000/v2.0")

            dashboard = agent.get("http://#{ucloud}/dashboard/infrastructure",
                                  [], agent.page.uri)

            address = dashboard.link_with(href: /^http.*admin/).uri.to_s
                               .gsub('http://', '').gsub('/dashboard/admin', '')
            document = Nokogiri::HTML(dashboard.body)
            password = document.css('span.password-button')
                       .attribute('data-content').value

            deployment.openstack_overcloud_address = address
            deployment.openstack_overcloud_password = password
            deployment.save!

            Rails.logger.debug '=== Leaving OvercloudCredentials run method ==='
          end

          def overcloud_credentials_completed
            Rails.logger.info 'Overcloud Credentials saved'
          end

          def overcloud_credentials_failed
            fail _('Failed to Retreive Overcloud Credentials')
          end
        end
      end
    end
  end
end
