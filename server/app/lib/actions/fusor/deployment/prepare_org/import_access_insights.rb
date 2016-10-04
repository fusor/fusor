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

module Actions
  module Fusor
    module Deployment
      module PrepareOrg
        class ImportAccessInsights < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Import access insights puppet class")
          end

          def plan
            super
            plan_self
          end

          def run
            importer = PuppetClassImporter.new({ :url => SmartProxy.first.url })
            changes = importer.changes
            unless changes.empty? || changes.nil?
              ['new', 'updated', 'obsolete'].each do |kind|
                changes[kind].each_key do |key|
                  changes[kind.to_s][key] = changes[kind.to_s][key].to_json
                end
              end
              PuppetClassImporter.new.obsolete_and_new(changes)
            end
          end
        end
      end
    end
  end
end
