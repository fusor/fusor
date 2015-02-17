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
  module Concerns
    module Api::ApiController
      extend ActiveSupport::Concern

      included do
        include ForemanTasks::Triggers

        respond_to :json
        before_filter :set_gettext_locale
      end

      # override warden current_user (returns nil because there is no user in that scope)
      def current_user
        # get the logged user from the correct scope
        User.current
      end

      protected

      def process_action(method_name, *args)
        super(method_name, *args)
        Rails.logger.debug "With body: #{response.body}\n"
      end

      def resource
        resource = instance_variable_get(:"@#{resource_name}")
        fail 'no resource loaded' if resource.nil?
        resource
      end

      def resource_collection
        resource = instance_variable_get(:"@#{resource_collection_name}")
        fail 'no resource collection loaded' if resource.nil?
        resource
      end

      def resource_collection_name
        controller_name
      end

      def resource_name
        controller_name.singularize
      end

      def respond(options = {})
        method_name = 'respond_for_' + params[:action].to_s
        fail "automatic response method '%s' not defined" % method_name unless respond_to?(method_name, true)
        return send(method_name.to_sym, options)
      end
    end
  end
end
