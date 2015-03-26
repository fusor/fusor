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
  class Api::CustomerPortal::CustomerPortalProxiesController < Api::V2::BaseController

    before_filter :proxy_request_path, :proxy_request_body

    def get
      response = Resources::CustomerPortal::Proxy.get(@request_path)
      logger.debug response
      render :json => response
    end

    def post
      response = Resources::CustomerPortal::Proxy.post(@request_path, @request_body.read)
      logger.debug response
      render :json => response
    end

    def delete
      response = Resources::CustomerPortal::Proxy.delete(@request_path, @request_body.read)
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
  end
end
