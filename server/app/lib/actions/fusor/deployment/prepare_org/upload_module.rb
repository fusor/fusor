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
        class UploadModule < Actions::Fusor::FusorActionWithSubPlans
          def humanized_name
            _("Upload Module")
          end

          def plan
            super
            fail _("Unable to locate fusor.yaml settings in config/settings.plugins.d") unless SETTINGS[:fusor]
            fail _("Unable to locate puppet module settings in config/settings.plugins.d/fusor.yaml") unless SETTINGS[:fusor][:puppet_module]
            plan_self
          end

          def create_sub_plans
            repository = ::Katello::Repository.find_by_name('Puppet')
            modulepath = SETTINGS[:fusor][:puppet_module][:ovirt][:filepath]
            file = File.new(modulepath)
            trigger(::Actions::Katello::Repository::UploadFiles, repository, [{:path => file.path}])
          end
        end
      end
    end
  end
end
