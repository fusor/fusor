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
  module Api
    module CustomerPortal
      class CustomerPortalProxiesController < Api::V21::BaseController

        before_filter :verify_logged_in, :except => [:login, :logout, :is_authenticated]
        before_filter :verify_portal_credentials, :only => [:login]
        before_filter :proxy_request_path, :except => [:login, :logout, :is_authenticated]
        before_filter :proxy_request_body, :except => [:login, :logout, :is_authenticated]

        def login
          session[:portal_username] = params[:username]
          session[:portal_password] = params[:password]
          render :json => {}
        end

        def logout
          session.delete(:portal_username)
          session.delete(:portal_password)
          render :json => {}
        end

        def is_authenticated
          authenticated = false
          if session[:portal_username] && session[:portal_password]
            # they are not nil, let's make sure neither is empty
            authenticated = !session[:portal_username].empty? && !session[:portal_password].empty?
          end
          render :json => authenticated
        end

        def get
          response = Resources::CustomerPortal::Proxy.get(@request_path, credentials)
          logger.debug response
          render :json => response
        end

        def post
          response = Resources::CustomerPortal::Proxy.post(@request_path, credentials, @request_body.read)
          logger.debug response
          render :json => response
        end

        def delete
          response = Resources::CustomerPortal::Proxy.delete(@request_path, credentials, @request_body.read)
          logger.debug response
          render :json => response
        end

        private

        def proxy_request_path
          @request_path = drop_api_namespace(@_request.fullpath)
        end

        def proxy_request_body
          @request_body = @_request.body
        end

        def drop_api_namespace(original_request_path)
          prefix = "/customer_portal"
          original_request_path.gsub(prefix, '')
        end

        def verify_portal_credentials
          unless (params[:username] && params[:password])
            fail ::Katello::HttpErrors::Unauthorized, _("Please provide username and password.")
          end
        end

        def verify_logged_in
          unless (session[:portal_username] && session[:portal_password])
            fail ::Katello::HttpErrors::Unauthorized, _("Customer portal credentials are required.  Please provide them using login.")
          end
        end

        def credentials
          { :username => session[:portal_username], :password => session[:portal_password] }
        end
      end
    end
  end
end
