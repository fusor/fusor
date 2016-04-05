#
# Copyright 2016 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Utils
  module CloudForms
    class ImageLookup
      def self.find_image_details(repository, image_file_name, image_prefix)
        ## Expecting image_prefix to be one of 'cfme-rhevm' or 'cfme-rhos'

        images = ::Katello.pulp_server.extensions.repository.unit_search(repository.pulp_id)

        if image_file_name
          image_file = images.find { |image| image[:metadata][:name] == image_file_name }
          if !image_file
            fail _("Unable to find image '%{image_file_name}'") % { :image_file_name => image_file_name}
          end
          image_name = image_file[:metadata][:name]
          image_path = image_file[:metadata][:_storage_path]
        else
          images = images.find_all { |image| image[:metadata][:name].starts_with?(image_prefix) }
          image_name = images.compact.sort_by { |k| k[:name] }.last[:metadata][:name]
          image_path = images.compact.sort_by { |k| k[:name] }.last[:metadata][:_storage_path]
        end

        return image_path, image_name
      end
    end
  end
end
