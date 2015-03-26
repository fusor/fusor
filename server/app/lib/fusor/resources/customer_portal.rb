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

# rubocop:disable SymbolName
module Fusor
  module Resources
    require 'rest_client'

    module CustomerPortal
      class Proxy
        def self.post(path, body)
          Rails.logger.debug "Sending POST request to Customer Portal: #{ path }"
          client = CustomerPortalResource.rest_client(path)
          client.post(body, { :accept => :json, :content_type => :json })
        end

        def self.delete(path, body = nil)
          Rails.logger.debug "Sending DELETE request to Customer Portal: #{ path }"
          client = CustomerPortalResource.rest_client(path)
          # Some candlepin calls will set the body in DELETE requests.
          client.options[:payload] = body unless body.nil?
          client.delete({ :accept => :json, :content_type => :json })
        end

        def self.get(path)
          Rails.logger.debug "Sending GET request to Customer Portal: #{ path }"
          client = CustomerPortalResource.rest_client(path)
          client.get({ :accept => :json })
        end
      end

      class CustomerPortalResource
        def self.default_headers
          { 'accept' => 'application/json',
            'accept-language' => I18n.locale,
            'content-type' => 'application/json' }
        end

        def self.name_to_key(a_name)
          a_name.tr(' ', '_')
        end

        def self.rest_client(path)
          settings = SETTINGS[:fusor][:customer_portal]
          prefix = settings[:url] || "https://subscription.rhn.redhat.com:443/subscription/"
          username = settings[:username]
          password = settings[:password]

          if ::Katello.config.cdn_proxy && ::Katello.config.cdn_proxy.host
            proxy_config = ::Katello.config.cdn_proxy
            uri = URI('')

            uri.scheme = URI.parse(proxy_config.host).scheme
            uri.host = URI.parse(proxy_config.host).host
            uri.port = proxy_config.port
            uri.user = proxy_config.user
            uri.password = proxy_config.password

            RestClient.proxy = uri.to_s
          end

          RestClient::Resource.new(prefix + path,
                                   :user => username,
                                   :password => password,
                                   :headers => self.default_headers)
        end
      end
    end
  end
end
