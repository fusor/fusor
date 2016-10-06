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
      module CloudForms
        class UpdateAdminPassword < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Update Admin Password on CloudForms Appliance")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug "================ UpdateAdminPassword run method ===================="

            deployment   = ::Fusor::Deployment.find(input[:deployment_id])
            cfme_addresses = [deployment.cfme_rhv_address, deployment.cfme_osp_address].compact
            admin_user   = "admin"
            old_password = "smartvm"
            new_password = deployment.cfme_admin_password

            data = {
              :action => "edit",
              :password => new_password
            }

            cfme_addresses.each do |cfme_address|
              begin
                request_url = "https://#{admin_user}:#{old_password}@#{cfme_address}/api/users"
                client = RestClient::Resource.new(request_url, :verify_ssl => OpenSSL::SSL::VERIFY_NONE)
                response = JSON.parse(client.get)

                # get the admin user id
                admin_id = get_user_id(response, admin_user, old_password)
                if admin_id.eql?("") || admin_id.nil?
                  fail _("ERROR: admin user ID not found! Failed to update admin password on appliance.")
                end

                # update the admin password
                request_url = "https://#{admin_user}:#{old_password}@#{cfme_address}/api/users/#{admin_id}"
                client = RestClient::Resource.new(request_url, :verify_ssl => OpenSSL::SSL::VERIFY_NONE)

                response = client.post data.to_json
                ::Fusor.log.debug response
                ::Fusor.log.info "Updated #{admin_user} user password: Status Code is #{response.code}"
              rescue Exception => e
                fail _("Failed to update admin password on appliance. Error message: #{e.message}")
              end
              ::Fusor.log.debug "================ Leaving UpdateAdminPassword run method ===================="
            end
          end

          def get_user_id(response, username, password)
            begin
              response["resources"].each do |users|
                # prepend admin credentials to each user URI
                uri = URI.parse(users["href"])
                uri.user = username
                uri.password = password

                # get and check the response to see if it is the admin user
                client = RestClient::Resource.new(uri.to_s, :verify_ssl => OpenSSL::SSL::VERIFY_NONE)
                user = JSON.parse(client.get)

                if user["userid"].eql?(username)
                  return user["id"]
                end
              end
              return ""
            rescue Exception => e
              fail _("Failed to get the admin user ID #{e.message}")
            end
          end
        end
      end
    end
  end
end
