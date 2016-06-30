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

module Actions
  module Fusor
    module Deployment
      module PrepareOrg
        class CreateContentViewPuppetModule < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Create Content View Puppet Module")
          end

          def plan
            super
            fail _("Unable to locate fusor.yaml settings in config/settings.plugins.d") unless SETTINGS[:fusor]
            fail _("Unable to locate puppet module settings in config/settings.plugins.d/fusor.yaml") unless SETTINGS[:fusor][:puppet_module]
            plan_self
          end

          def run
            cv = ::Katello::ContentView.find_by_name('Fusor Puppet Content')
            puppet_module_name   = SETTINGS[:fusor][:puppet_module][:ovirt][:name]
            puppet_module_author = SETTINGS[:fusor][:puppet_module][:ovirt][:author]
            ::Katello::ContentViewPuppetModule.create(:content_view_id => cv['id'], :name => puppet_module_name, :author => puppet_module_author)
          end
        end
      end
    end
  end
end
