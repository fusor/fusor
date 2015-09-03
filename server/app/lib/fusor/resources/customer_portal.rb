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

module Fusor
  module Resources
    require 'rest_client'

    module CustomerPortal
      class Proxy
        def self.post(path, credentials, body)
          Rails.logger.debug "Sending POST request to Customer Portal: #{path}"
          client = CustomerPortalResource.rest_client(path, credentials)
          client.post(body, { :accept => :json, :content_type => :json })
        end

        def self.delete(path, credentials, body = nil)
          Rails.logger.debug "Sending DELETE request to Customer Portal: #{path}"
          client = CustomerPortalResource.rest_client(path, credentials)
          # Some candlepin calls will set the body in DELETE requests.
          client.options[:payload] = body unless body.nil?
          client.delete({ :accept => :json, :content_type => :json })
        end

        def self.get(path, credentials)
          Rails.logger.debug "Sending GET request to Customer Portal: #{path}"
          client = CustomerPortalResource.rest_client(path, credentials)
          client.get({ :accept => :json })
        end
      end

      class Consumer
        def self.get(uuid, credentials)
          client = CustomerPortalResource.rest_client("/consumers/#{uuid}", credentials)
          response = client.get({ :accept => :json })
          JSON.parse(response).with_indifferent_access
        end

        def self.export(uuid, credentials)
          client = CustomerPortalResource.rest_client("/consumers/#{uuid}/export", credentials)
          client.get
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

        def self.rest_client(path, credentials)
          settings = SETTINGS[:fusor][:customer_portal]
          prefix = (settings && settings[:url]) || "https://subscription.rhn.redhat.com:443/subscription"

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

          options = {}
          if credentials[:username] && credentials[:password]
            options[:headers] = self.default_headers
            options[:user] = credentials[:username]
            options[:password] = credentials[:password]
          else
            options[:ssl_client_cert] = OpenSSL::X509::Certificate.new(credentials[:client_cert])
            options[:ssl_client_key] = OpenSSL::PKey::RSA.new(credentials[:client_key])
            options[:verify_ssl] = OpenSSL::SSL::VERIFY_NONE
          end

          RestClient::Resource.new(prefix + path, options)
        end
      end
    end
  end
end
