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
require 'openssl'

module Utils
  module CloudForms
    class Provider
      def self.add(cfme_ip, provider_params)
        Rails.logger.debug "Adding the RHEV provider at #{provider_params[:ip]} to the CloudForms VM at #{cfme_ip}"

        agent = Mechanize.new
        agent.verify_mode = OpenSSL::SSL::VERIFY_NONE

        logged_in_page = agent.post("https://#{cfme_ip}/dashboard/authenticate?button=login",
                                    { "user_name" => "admin",
                                      "user_password" => "smartvm" })

        # The referer is VERY IMPORTANT in manageIQ
        # If 'agent.page.uri' is removed in below request it will not function
        # We will receive a '403'

        emfra_new = agent.get("https://#{cfme_ip}/ems_infra/new", [], agent.page.uri)
        csrf_token = emfra_new.at('meta[name="csrf-token"]')[:content]

        new_provider_form = emfra_new.form
        new_provider_form["name"] = provider_params[:name]
        new_provider_form["server_emstype"] = provider_params[:type]

        # hostname and ipaddress are added dynamically from javascript when rhevm is selected
        # so we need to add these as new fields
        new_provider_form.add_field!("hostname", provider_params[:hostname])
        new_provider_form.add_field!("ipaddress", provider_params[:ip])

        new_provider_form.port = ""
        new_provider_form.server_zone = "default"
        new_provider_form.default_userid = provider_params[:username]
        new_provider_form.default_password = provider_params[:password]
        new_provider_form.default_verify = provider_params[:password]
        new_provider_form.metrics_userid = ""
        new_provider_form.metrics_password = ""
        new_provider_form.metrics_verify = ""

        submit_headers = {
            "Referer" => agent.page.uri,
            "X-CSRF-Token" => csrf_token,
            "Accept" => "text/html,application/xhtml+xml,application/xml,application/json",
            "Accept-Encoding" => "gzip, deflate, sdch",
            "Accept-Language" => "en-US,en",
            "Content-Type" => "application/x-www-form-urlencoded"
        }
        request_data = new_provider_form.request_data
        provider_added = agent.post("https://#{cfme_ip}/ems_infra/create/new?button=add", request_data, submit_headers)
      end
    end
  end
end
