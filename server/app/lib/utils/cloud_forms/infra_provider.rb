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

require 'openssl'
require 'json'
require 'rest_client'

module Utils
  module CloudForms
    class InfraProvider
      def self.add(cfme_ip, provider_params, deployment)
        Rails.logger.debug "Adding the RHEV provider at #{provider_params[:ip]} to the CloudForms VM at #{cfme_ip}"

        data = {
          :action => "create",
          :resources => [
            {
              :name => provider_params[:name],
              :type => "ManageIQ::Providers::Redhat::InfraManager",
              :hostname => provider_params[:hostname],
              :port => "443",
              :zone_id => "1000000000001",
              :credentials => [{
                :userid => provider_params[:username],
                :password => provider_params[:password]
              }, {
                :userid => "engine",
                :password => deployment.rhev_engine_admin_password,
                :auth_type => 'metrics'
              }]
            }
          ]
        }

        request_url = "https://admin:#{deployment.cfme_admin_password}@#{cfme_ip}/api/providers"
        client = RestClient::Resource.new(request_url, :verify_ssl => OpenSSL::SSL::VERIFY_NONE)

        begin
          response = client.post data.to_json
          puts "Status Code: #{response.code}"
          puts response
        rescue RestClient::Exception => e
          puts e
          puts e.response
        end
      end
    end
  end
end
