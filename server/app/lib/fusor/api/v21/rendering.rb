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
    module V21
      module Rendering
        def respond_with_template(action, resource_name, options = {}, &_block)
          yield if block_given?
          status = options[:status] || 200

          render :template => "fusor/api/v21/#{resource_name}/#{action}",
                 :status => status,
                 :locals => { :object_name => options[:object_name],
                              :root_name => options[:root_name] },
                 :layout => "fusor/api/v21/layouts/#{options[:layout]}"
        end
      end # module Rendering
    end # module V21
  end # module Api
end # module Fusor
